import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { QuestionScene } from "../components/QuestionScene";
import { IntroCard } from "../components/IntroCard";
import { questionDuration } from "../lib/manifest";
import { FPS, type QuizProps } from "../schema";

const INTRO_SECONDS = 2.5;

/**
 * Shorts / Reels format (9:16): a title slide + a single quiz question.
 * If `questions` has more than one entry, only the first is used.
 */
export const QuizShort: React.FC<QuizProps> = (props) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const questionFrames = props.questions.length
    ? Math.max(1, questionDuration(props, 0, FPS))
    : FPS * 5;

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={introFrames}>
          <IntroCard
            title={props.title}
            subtitle={props.subtitle}
            count={props.questions.length}
            backgroundSrc={props.backgrounds[0]}
            coverSrc={props.cover ?? undefined}
            book={props.book}
            subject={props.subject}
            lesson={props.lesson}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={questionFrames}>
          <QuestionScene props={props} index={0} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const calcQuizShortMetadata = ({ props }: { props: QuizProps }) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const questionFrames = props.questions.length
    ? questionDuration(props, 0, FPS)
    : FPS * 5;
  return { durationInFrames: Math.max(1, Math.round(introFrames + questionFrames)) };
};
