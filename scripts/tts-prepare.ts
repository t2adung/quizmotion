import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { filterQuestions, listTopics, parseQuiz } from "../src/lib/csv";
import { getProvider, prepareClips, runIdFor } from "../src/tts/index";
import { FPS } from "../src/schema";

/**
 * Standalone narration pre-render: generates audio for a topic/difficulty and
 * writes a clips manifest to public/audio/<runId>/manifest.json. Useful for
 * pre-generating audio (or debugging TTS) independently of rendering, and a
 * building block for a future server-side render pipeline.
 *
 * Usage:
 *   npm run tts -- --topic <slug|index> [--difficulty <1|2|3>] [--limit 10]
 *                  [--provider google] [--no-explanation]
 */
const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

async function main() {
  const csvText = await readFile(path.join(ROOT, "data", "multichoice.csv"), "utf8");
  const all = parseQuiz(csvText);
  const topics = listTopics(all);

  const topicArg = arg("topic") ?? topics[0];
  const topic = /^\d+$/.test(topicArg) ? topics[Number(topicArg)] : topicArg;
  const difficulty = arg("difficulty") ? Number(arg("difficulty")) : undefined;
  const limit = Number(arg("limit") ?? 10);
  const readExplanation = !process.argv.includes("--no-explanation");
  const provider = arg("provider") ?? "google";

  const questions = filterQuestions(all, { topic, difficulty, limit });
  if (questions.length === 0) throw new Error("No questions matched.");

  const runId = runIdFor([provider, topic, difficulty ?? "all", questions.length]);
  console.log(`Generating ${questions.length} narration clip(s) → public/audio/${runId}/`);

  const clips = await prepareClips(questions, {
    provider: getProvider(provider),
    readExplanation,
    fps: FPS,
    publicDir: path.join(ROOT, "public"),
    runId,
  });

  const manifestPath = path.join(ROOT, "public", "audio", runId, "manifest.json");
  await writeFile(manifestPath, JSON.stringify({ topic, difficulty, clips }, null, 2));
  console.log(`✅ Manifest: ${path.relative(ROOT, manifestPath)}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
