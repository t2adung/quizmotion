import type { Clip, QuizProps } from "../schema";

export type PhaseTiming = {
  /** Read-the-question phase (TTS narrates, options pop in). */
  readFrames: number;
  /** Countdown timer phase. */
  countdownFrames: number;
  /** Answer-reveal phase. */
  revealFrames: number;
  /** Explanation phase (TTS narrates the explanation). */
  explanationFrames: number;
  /** Sum of the above. */
  totalFrames: number;
};

/** Rough reading time for Vietnamese text when no TTS audio exists. */
export function estimateReadFrames(text: string, fps: number): number {
  const words = Math.max(1, text.trim().split(/\s+/).length);
  const seconds = Math.max(1.6, words / 2.6 + 0.6); // ~2.6 words/sec + lead-in
  return Math.round(seconds * fps);
}

/** Compute the frame timing for question `index`. */
export function phaseTiming(
  props: QuizProps,
  index: number,
  fps: number,
): PhaseTiming {
  const q = props.questions[index];
  const clip: Clip | undefined = props.clips[index];

  const pad = Math.round(0.6 * fps);

  const readFrames = clip?.questionAudioFrames
    ? clip.questionAudioFrames + pad
    : estimateReadFrames(q.question, fps);

  const countdownFrames = Math.round(props.countdownSeconds * fps);
  const revealFrames = Math.round(props.revealSeconds * fps);

  const explanationBase = Math.round(props.explanationSeconds * fps);
  const explanationFrames = clip?.explanationAudioFrames
    ? Math.max(explanationBase, clip.explanationAudioFrames + pad)
    : estimateReadFrames(q.explanation_vi, fps);

  const totalFrames =
    readFrames + countdownFrames + revealFrames + explanationFrames;

  return {
    readFrames,
    countdownFrames,
    revealFrames,
    explanationFrames,
    totalFrames,
  };
}

/** Total frames for a single question (used by the Short composition). */
export function questionDuration(
  props: QuizProps,
  index: number,
  fps: number,
): number {
  return phaseTiming(props, index, fps).totalFrames;
}

/** Total frames for all questions (used by the Landscape composition). */
export function allQuestionsDuration(props: QuizProps, fps: number): number {
  return props.questions.reduce(
    (sum, _q, i) => sum + phaseTiming(props, i, fps).totalFrames,
    0,
  );
}
