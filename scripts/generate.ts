import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  filterQuestions,
  listDifficulties,
  listTopics,
  parseQuiz,
  topicFileId,
  topicLabel,
} from "../src/lib/csv";
import { getProvider, prepareClips, runIdFor } from "../src/tts/index";
import {
  DIMENSIONS,
  FPS,
  type Format,
  type Question,
  type QuizProps,
} from "../src/schema";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");

type Options = {
  csv: string;
  format: Format;
  topic: string;
  difficulty: number | null;
  limit: number;
  questionIndex: number; // for short: which question in the filtered set
  tts: boolean;
  provider: string;
  readExplanation: boolean;
  out: string | null;
  /** Background spec: "auto" (use folder, shuffled), "none", or comma list. */
  bg: string;
  /** Optional book cover: filename in public/covers, a covers/ path, or "". */
  cover: string;
  /** Optional intro-slide text (proper Vietnamese). */
  book: string;
  subject: string;
  lesson: string;
};

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"]);

/** List image files (basenames) in a public/<sub> folder. */
async function listImageFiles(publicDir: string, sub: string): Promise<string[]> {
  try {
    const files = await readdir(path.join(publicDir, sub));
    return files.filter((f) => IMG_EXT.has(path.extname(f).toLowerCase())).sort();
  } catch {
    return [];
  }
}

const listCoverFiles = (publicDir: string) => listImageFiles(publicDir, "covers");

/**
 * Backgrounds for a format: prefer public/backgrounds/<format>/ (e.g. portrait
 * 9:16 images under short/, 16:9 under landscape/), falling back to the root
 * public/backgrounds/ folder. Returns the files and the sub-path they live in.
 */
async function backgroundsFor(
  publicDir: string,
  format: Format,
): Promise<{ files: string[]; sub: string }> {
  const formatSub = `backgrounds/${format}`;
  const formatFiles = await listImageFiles(publicDir, formatSub);
  if (formatFiles.length > 0) return { files: formatFiles, sub: formatSub };
  return { files: await listImageFiles(publicDir, "backgrounds"), sub: "backgrounds" };
}

/** Resolve a cover spec into a staticFile-relative path ("covers/x.png") or null. */
function resolveCover(spec: string): string | null {
  const s = spec.trim();
  if (!s) return null;
  if (s.includes("/")) return s.replace(/^public\//, "");
  return `covers/${s}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Resolve the background spec into shuffled staticFile-relative paths. Shuffled
 * fresh on every call, so each generation randomly picks/orders backgrounds.
 */
async function resolveBackgrounds(
  spec: string,
  publicDir: string,
  format: Format,
): Promise<string[]> {
  if (spec === "none") return [];
  const { files, sub } = await backgroundsFor(publicDir, format);
  if (files.length === 0) return [];

  let chosen = files;
  if (spec && spec !== "auto") {
    const wanted = spec.split(",").map((s) => s.trim());
    chosen = files.filter((f) => wanted.includes(f));
    if (chosen.length === 0) chosen = files;
  }
  return shuffle(chosen).map((f) => `${sub}/${f}`);
}

async function main() {
  const csvPath = argValue("csv") ?? path.join(ROOT, "data", "multichoice.csv");
  const csvText = await readFile(csvPath, "utf8");
  const all = parseQuiz(csvText);

  const opts = hasFlags()
    ? resolveFromFlags(all, csvPath)
    : await promptOptions(all, csvPath);

  const filtered = filterQuestions(all, {
    topic: opts.topic,
    difficulty: opts.difficulty ?? undefined,
  });
  if (filtered.length === 0) {
    throw new Error("No questions match the selected topic/difficulty.");
  }

  const selected: Question[] =
    opts.format === "short"
      ? [filtered[Math.min(opts.questionIndex, filtered.length - 1)]]
      : filtered.slice(0, opts.limit);

  const backgrounds = await resolveBackgrounds(
    opts.bg,
    path.join(ROOT, "public"),
    opts.format,
  );
  if (backgrounds.length) {
    console.log(
      `🖼️  Background (${opts.format}): ${backgrounds.length} ảnh (ngẫu nhiên) — bắt đầu: ${backgrounds[0]}`,
    );
  } else if (opts.bg !== "none") {
    console.log(
      `🖼️  Không có ảnh cho '${opts.format}' (public/backgrounds/${opts.format}/ hoặc public/backgrounds/) → nền pop-art mặc định.`,
    );
  }

  const label = topicLabel(opts.topic);
  const cover = resolveCover(opts.cover);
  if (cover) console.log(`📘 Bìa sách: ${cover}`);

  const props: QuizProps = {
    questions: selected,
    clips: [],
    readSeconds: 3,
    countdownSeconds: 5,
    revealSeconds: 2.5,
    explanationSeconds: 4,
    title: "Quiz Time",
    subtitle: label.full,
    backgrounds,
    cover,
    book: opts.book,
    subject: opts.subject,
    lesson: opts.lesson,
  };

  // --- Optional TTS narration ---
  if (opts.tts) {
    try {
      console.log(`\n🔊 Generating narration (${opts.provider})…`);
      const runId = runIdFor([
        opts.provider,
        opts.topic,
        opts.difficulty ?? "all",
        opts.format,
        opts.readExplanation ? "exp" : "noexp",
        selected.length,
        selected[0]?.question ?? "",
      ]);
      props.clips = await prepareClips(selected, {
        provider: getProvider(opts.provider),
        readExplanation: opts.readExplanation,
        fps: FPS,
        publicDir: path.join(ROOT, "public"),
        runId,
      });
    } catch (err) {
      console.warn(
        `⚠️  TTS failed (${(err as Error).message}). Falling back to no-audio timings.`,
      );
      props.clips = [];
    }
  }

  // --- Render ---
  const compId = opts.format === "short" ? "QuizShort" : "QuizLandscape";
  const outFile =
    opts.out ??
    path.join(
      ROOT,
      "out",
      `${topicFileId(opts.topic)}-${opts.format}${opts.difficulty ? `-d${opts.difficulty}` : ""}.mp4`,
    );

  console.log(`\n🎬 Bundling…`);
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    publicDir: path.join(ROOT, "public"),
  });

  const composition = await selectComposition({
    serveUrl,
    id: compId,
    inputProps: props,
  });

  const { width, height } = DIMENSIONS[opts.format];
  console.log(
    `🎥 Rendering ${compId} (${width}×${height}, ${composition.durationInFrames} frames) → ${path.relative(ROOT, outFile)}`,
  );

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outFile,
    inputProps: props,
    onProgress: ({ progress }) =>
      process.stdout.write(`  ${Math.round(progress * 100)}%\r`),
  });

  console.log(`\n✅ Done: ${outFile}`);
  process.exit(0);
}

// ---------- Flag (non-interactive) mode ----------

function hasFlags(): boolean {
  return process.argv.includes("--format") || process.argv.includes("--topic");
}

function resolveFromFlags(all: Question[], csvPath: string): Options {
  const topics = listTopics(all);
  const topicArg = argValue("topic") ?? topics[0];
  // Allow either the full slug or a 0-based index into the topic list.
  const topic = /^\d+$/.test(topicArg) ? topics[Number(topicArg)] : topicArg;
  const diffArg = argValue("difficulty");
  return {
    csv: csvPath,
    format: (argValue("format") as Format) ?? "short",
    topic,
    difficulty: diffArg && diffArg !== "all" ? Number(diffArg) : null,
    limit: Number(argValue("limit") ?? 10),
    questionIndex: Number(argValue("question") ?? 0),
    tts: process.argv.includes("--tts"),
    provider: argValue("provider") ?? "google",
    readExplanation: !process.argv.includes("--no-explanation"),
    out: argValue("out"),
    bg: argValue("bg") ?? "auto",
    cover: argValue("cover") ?? "",
    book: argValue("book") ?? "",
    subject: argValue("subject") ?? "",
    lesson: argValue("lesson") ?? "",
  };
}

function argValue(name: string): string | null {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return null;
}

// ---------- Interactive mode ----------

async function promptOptions(all: Question[], csvPath: string): Promise<Options> {
  const { select, number, confirm, input } = await import("@inquirer/prompts");

  const format = (await select({
    message: "Định dạng video?",
    choices: [
      { name: "📱 Short / Reels (dọc 9:16, 1 câu)", value: "short" },
      { name: "🖥️  YouTube ngang (16:9, nhiều câu)", value: "landscape" },
    ],
  })) as Format;

  const topics = listTopics(all);
  const topic = await select({
    message: "Chọn chủ đề (topic_slug)?",
    choices: topics.map((t) => ({ name: topicLabel(t).full, value: t })),
    pageSize: 12,
  });

  const diffs = listDifficulties(filterQuestions(all, { topic }));
  const difficulty = (await select({
    message: "Độ khó?",
    choices: [
      { name: "Tất cả", value: null },
      ...diffs.map((d) => ({ name: `Mức ${d}`, value: d })),
    ],
  })) as number | null;

  const pool = filterQuestions(all, {
    topic,
    difficulty: difficulty ?? undefined,
  });

  let limit = 10;
  let questionIndex = 0;
  if (format === "landscape") {
    limit =
      (await number({
        message: `Số câu tối đa (nhóm có ${pool.length} câu)?`,
        default: Math.min(10, pool.length),
        min: 1,
      })) ?? Math.min(10, pool.length);
  } else {
    questionIndex = (await select({
      message: "Chọn câu hỏi cho video Short?",
      pageSize: 10,
      choices: pool.map((q, i) => ({
        name: `${i + 1}. ${q.question.slice(0, 70)}`,
        value: i,
      })),
    })) as number;
  }

  const tts = await confirm({ message: "Lồng tiếng (TTS)?", default: true });
  let readExplanation = true;
  if (tts) {
    readExplanation = await confirm({
      message: "Đọc cả phần giải thích?",
      default: true,
    });
  }

  // Background images for this format (public/backgrounds/<format>/ or root).
  const { files: bgFiles } = await backgroundsFor(path.join(ROOT, "public"), format);
  let bg = "none";
  if (bgFiles.length > 0) {
    const useBg = await confirm({
      message: `Dùng ảnh nền cho '${format}' (${bgFiles.length} ảnh, chọn ngẫu nhiên)?`,
      default: true,
    });
    bg = useBg ? "auto" : "none";
  }

  // Slide đầu (intro): thông tin tuỳ chọn.
  const book = await input({ message: "Tên sách (optional, Enter để bỏ qua):", default: "" });
  const subject = await input({ message: "Chủ đề (optional):", default: "" });
  const lesson = await input({ message: "Tựa bài (optional):", default: "" });

  // Book cover (public/covers).
  const coverFiles = await listCoverFiles(path.join(ROOT, "public"));
  let cover = "";
  if (coverFiles.length > 0) {
    cover = (await select({
      message: "Bìa sách (optional)?",
      choices: [
        { name: "— Không dùng —", value: "" },
        ...coverFiles.map((f) => ({ name: f, value: f })),
      ],
    })) as string;
  }

  return {
    csv: csvPath,
    format,
    topic,
    difficulty,
    limit,
    questionIndex,
    tts,
    provider: "google",
    readExplanation,
    out: null,
    bg,
    cover,
    book,
    subject,
    lesson,
  };
}

main().catch((err) => {
  console.error("\n❌", err);
  process.exit(1);
});
