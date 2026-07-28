import { parse } from "csv-parse/sync";
import { QuestionSchema, type Question } from "../schema";

/** Parse the quiz CSV text into validated Question rows (BOM-safe). */
export function parseQuiz(csvText: string): Question[] {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    bom: true, // strips the leading BOM on the header
    trim: true,
    relax_quotes: true,
  }) as Record<string, string>[];

  return records.map((row, i) => {
    const result = QuestionSchema.safeParse(row);
    if (!result.success) {
      throw new Error(
        `Invalid row ${i + 2} in CSV: ${result.error.issues
          .map((issue) => `${issue.path.join(".")} ${issue.message}`)
          .join("; ")}`,
      );
    }
    return result.data;
  });
}

export type QuizFilter = {
  topic?: string;
  difficulty?: number;
  limit?: number;
};

/** Filter questions by topic_slug and/or difficulty, optionally capping count. */
export function filterQuestions(
  questions: Question[],
  filter: QuizFilter,
): Question[] {
  let result = questions;
  if (filter.topic) {
    result = result.filter((q) => q.topic_slug === filter.topic);
  }
  if (filter.difficulty != null) {
    result = result.filter((q) => q.difficulty === filter.difficulty);
  }
  if (filter.limit != null && filter.limit > 0) {
    result = result.slice(0, filter.limit);
  }
  return result;
}

/** Distinct topic_slug values, in first-seen order. */
export function listTopics(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.topic_slug))];
}

/** Distinct difficulty values, sorted ascending. */
export function listDifficulties(questions: Question[]): number[] {
  return [...new Set(questions.map((q) => q.difficulty))].sort((a, b) => a - b);
}

/**
 * Turn a topic_slug like
 *   "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu"
 * into a readable label:
 *   { chuDe: "Chủ đề 1", bai: "Bài 1", title: "Thong tin va du lieu", ... }
 * The slug is ASCII (no diacritics), so we can only title-case it — good
 * enough for an intro card / file name.
 */
export function topicLabel(slug: string): {
  full: string;
  chuDe: string;
  bai: string;
  title: string;
} {
  const chuDeMatch = slug.match(/chu-de-(\d+)/);
  const baiMatch = slug.match(/bai-(\d+)/);
  const chuDe = chuDeMatch ? `Chủ đề ${chuDeMatch[1]}` : "";
  const bai = baiMatch ? `Bài ${baiMatch[1]}` : "";

  // Everything after "bai-<n>-" is the lesson title.
  const afterBai = slug.replace(/^.*bai-\d+-/, "");
  const title = afterBai
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const full = [chuDe, bai].filter(Boolean).join(" · ") + (title ? ` — ${title}` : "");
  return { full, chuDe, bai, title };
}

/** Filesystem-safe short id for a topic (for output file names). */
export function topicFileId(slug: string): string {
  const chuDe = slug.match(/chu-de-(\d+)/)?.[1] ?? "x";
  const bai = slug.match(/bai-(\d+)/)?.[1] ?? "x";
  return `cd${chuDe}-bai${bai}`;
}
