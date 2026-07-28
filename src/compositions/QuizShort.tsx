import React from "react";
import { AbsoluteFill } from "remotion";
import { QuestionScene } from "../components/QuestionScene";
import { questionDuration } from "../lib/manifest";
import { FPS, type QuizProps } from "../schema";

/**
 * Shorts / Reels format (9:16): a single quiz question.
 * If `questions` has more than one entry, only the first is used.
 */
export const QuizShort: React.FC<QuizProps> = (props) => {
  return (
    <AbsoluteFill>
      <QuestionScene props={props} index={0} />
    </AbsoluteFill>
  );
};

export const calcQuizShortMetadata = ({ props }: { props: QuizProps }) => {
  const duration = props.questions.length
    ? questionDuration(props, 0, FPS)
    : FPS * 5;
  return { durationInFrames: Math.max(1, Math.round(duration)) };
};
