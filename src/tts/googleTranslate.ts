import type { TtsProvider } from "./index";

/**
 * Free Vietnamese TTS via Google Translate's speech endpoint. No API key, plain
 * HTTPS (proxy-friendly). The endpoint caps each request at ~200 chars, so long
 * text is split on word boundaries and the resulting mp3 chunks concatenated
 * (same-source CBR mp3s concatenate cleanly for playback).
 *
 * Note: this depends on an undocumented endpoint and needs outbound access to
 * translate.google.com. If your environment blocks it, register a different
 * provider in tts/index.ts. Generation failures fall back to silent (no-audio)
 * timings in the CLI, so a blocked endpoint never breaks video output.
 */
const MAX_CHARS = 190;

export function googleTranslateProvider(lang = "vi"): TtsProvider {
  return {
    id: "google",
    async synthesize(text: string): Promise<Buffer> {
      const chunks = splitText(text, MAX_CHARS);
      const buffers: Buffer[] = [];
      for (const chunk of chunks) {
        buffers.push(await fetchChunk(chunk, lang));
      }
      return Buffer.concat(buffers);
    },
  };
}

async function fetchChunk(text: string, lang: string): Promise<Buffer> {
  const url =
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob` +
    `&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      Referer: "https://translate.google.com/",
    },
  });
  if (!res.ok) {
    throw new Error(`TTS request failed (${res.status}) for chunk: "${text.slice(0, 40)}…"`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Split text into <= maxLen pieces, preferring sentence then word boundaries. */
export function splitText(text: string, maxLen: number): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return [clean];

  const words = clean.split(" ");
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}
