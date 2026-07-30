import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseBuffer } from "music-metadata";
import type { Clip, Question } from "../schema";
import { googleTranslateProvider } from "./googleTranslate";

/** A pluggable text-to-speech backend. */
export interface TtsProvider {
  id: string;
  /** Synthesize Vietnamese speech for `text` → mp3 bytes. */
  synthesize(text: string): Promise<Buffer>;
}

export const PROVIDERS: Record<string, () => TtsProvider> = {
  google: () => googleTranslateProvider(),
  // To add higher-quality neural voices, implement another TtsProvider here
  // (e.g. Microsoft Edge TTS via `msedge-tts`, or a paid API keyed by env var)
  // and register it under a new id.
};

export function getProvider(id: string): TtsProvider {
  const factory = PROVIDERS[id];
  if (!factory) {
    throw new Error(
      `Unknown TTS provider "${id}". Available: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }
  return factory();
}

async function mp3DurationSec(buf: Buffer): Promise<number> {
  const meta = await parseBuffer(buf, { mimeType: "audio/mpeg" });
  return meta.format.duration ?? 0;
}

export type PrepareOptions = {
  provider: TtsProvider;
  /** Also narrate each question's explanation. */
  readExplanation: boolean;
  fps: number;
  /** Absolute path to the project's `public/` directory. */
  publicDir: string;
  /** Sub-folder under public/audio to write into (usually a run id). */
  runId: string;
};

/**
 * Generate narration audio for `questions` and return index-aligned Clips.
 * Audio files land in public/audio/<runId>/ and clip.*Src are staticFile()
 * relative paths ("audio/<runId>/q0.mp3").
 */
export async function prepareClips(
  questions: Question[],
  opts: PrepareOptions,
): Promise<Clip[]> {
  const dir = path.join(opts.publicDir, "audio", opts.runId);
  await mkdir(dir, { recursive: true });

  const clips: Clip[] = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const question = await synthOne(
      q.question,
      path.join(dir, `q${i}.mp3`),
      `audio/${opts.runId}/q${i}.mp3`,
      opts,
    );

    let explanation = { src: null as string | null, frames: 0 };
    if (opts.readExplanation && q.explanation_vi.trim()) {
      explanation = await synthOne(
        q.explanation_vi,
        path.join(dir, `e${i}.mp3`),
        `audio/${opts.runId}/e${i}.mp3`,
        opts,
      );
    }

    clips.push({
      questionAudioSrc: question.src,
      questionAudioFrames: question.frames,
      explanationAudioSrc: explanation.src,
      explanationAudioFrames: explanation.frames,
    });
    process.stdout.write(`  ✓ audio ${i + 1}/${questions.length}\r`);
  }
  process.stdout.write("\n");
  return clips;
}

async function synthOne(
  text: string,
  absPath: string,
  relSrc: string,
  opts: PrepareOptions,
): Promise<{ src: string; frames: number }> {
  const mp3 = await opts.provider.synthesize(text);
  await writeFile(absPath, mp3);
  const seconds = await mp3DurationSec(mp3);
  return { src: relSrc, frames: Math.max(1, Math.round(seconds * opts.fps)) };
}

/** Deterministic run id from a selection, for cache-friendly folder names. */
export function runIdFor(parts: (string | number)[]): string {
  return createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 10);
}
