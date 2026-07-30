import { z } from "zod";

/** A single quiz question parsed from the CSV. */
export const QuestionSchema = z.object({
  topic_slug: z.string(),
  question: z.string(),
  A: z.string(),
  B: z.string(),
  C: z.string(),
  D: z.string(),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation_vi: z.string(),
  difficulty: z.coerce.number().int(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const OptionKey = z.enum(["A", "B", "C", "D"]);
export type OptionKey = z.infer<typeof OptionKey>;

/**
 * One clip in the timing manifest. Durations are in frames (at the
 * composition fps). `audioSrc` is a staticFile()-resolvable path or null
 * when TTS is disabled (preview mode uses estimated durations instead).
 */
export const ClipSchema = z.object({
  questionAudioSrc: z.string().nullable(),
  questionAudioFrames: z.number(),
  explanationAudioSrc: z.string().nullable(),
  explanationAudioFrames: z.number(),
});
export type Clip = z.infer<typeof ClipSchema>;

/**
 * Props shared by both compositions. `questions` + `clips` are index-aligned.
 * When `clips` is empty the scene falls back to estimated (no-audio) timings,
 * which keeps Remotion Studio previews instant without a TTS pre-render.
 */
export const QuizPropsSchema = z.object({
  questions: z.array(QuestionSchema),
  clips: z.array(ClipSchema),
  /** Seconds to read the question before the countdown (extended to fit TTS). */
  readSeconds: z.number().min(1).max(30).default(3),
  /** Seconds the countdown timer runs before revealing the answer. */
  countdownSeconds: z.number().min(1).max(30).default(5),
  /** Seconds the answer stays highlighted before the explanation. */
  revealSeconds: z.number().min(0.5).max(20).default(2.5),
  /** Seconds the explanation panel is shown (min; extended to fit TTS). */
  explanationSeconds: z.number().min(1).max(30).default(4),
  /** Human-friendly title for the intro card (landscape). */
  title: z.string().default("Quiz Time"),
  /** Subtitle / topic label for the intro card (fallback if book/subject/lesson empty). */
  subtitle: z.string().default(""),
  /** Optional book name, e.g. "Tin học 6 — Kết nối tri thức". */
  book: z.string().default(""),
  /** Optional subject / chủ đề (proper Vietnamese), e.g. "Chủ đề 5: Ứng dụng tin học". */
  subject: z.string().default(""),
  /** Optional lesson title / tựa bài (proper Vietnamese), e.g. "Bài 10 — Sơ đồ tư duy". */
  lesson: z.string().default(""),
  /**
   * Optional custom background images (staticFile-relative paths, e.g.
   * "backgrounds/space.jpg"). When non-empty, scenes use these instead of the
   * procedural pop-art background, cycling through the list by scene index.
   * The CLI shuffles this list randomly on every run.
   */
  backgrounds: z.array(z.string()).default([]),
  /**
   * Optional book-cover image (staticFile-relative, e.g. "covers/book.png").
   * When set, it is shown on the intro card (landscape) and, smaller, on the
   * outro. Leave null to hide it.
   */
  cover: z.string().nullable().default(null),
});
export type QuizProps = z.infer<typeof QuizPropsSchema>;

export const FORMATS = ["short", "landscape"] as const;
export type Format = (typeof FORMATS)[number];

export const FPS = 30;
export const DIMENSIONS: Record<Format, { width: number; height: number }> = {
  short: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
};
