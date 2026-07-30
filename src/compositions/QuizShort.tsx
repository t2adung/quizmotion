import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { QuestionScene } from "../components/QuestionScene";
import { IntroCard } from "../components/IntroCard";
import { OutroCard } from "../components/OutroCard";
import { questionDuration } from "../lib/manifest";
import { FPS, type QuizProps } from "../schema";

const INTRO_SECONDS = 3;
const OUTRO_SECONDS = 4;

/**
 * Shorts / Reels format (9:16): title slide → a single quiz question →
 * a celebratory fireworks outro. Only the first question is used.
 */
export const QuizShort: React.FC<QuizProps> = (props) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const outroFrames = Math.round(OUTRO_SECONDS * FPS);
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
        <Series.Sequence durationInFrames={outroFrames}>
          <OutroCard backgroundSrc={props.backgrounds[0]} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const calcQuizShortMetadata = ({ props }: { props: QuizProps }) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const outroFrames = Math.round(OUTRO_SECONDS * FPS);
  const questionFrames = props.questions.length
    ? questionDuration(props, 0, FPS)
    : FPS * 5;
  return {
    durationInFrames: Math.max(1, Math.round(introFrames + questionFrames + outroFrames)),
  };
};
