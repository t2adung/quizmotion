import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { QuestionScene } from "../components/QuestionScene";
import { IntroCard } from "../components/IntroCard";
import { OutroCard } from "../components/OutroCard";
import { allQuestionsDuration, phaseTiming } from "../lib/manifest";
import { FPS, type QuizProps } from "../schema";

const INTRO_SECONDS = 3;
const OUTRO_SECONDS = 3;

/**
 * YouTube landscape format (16:9): intro → N questions → outro.
 */
export const QuizLandscape: React.FC<QuizProps> = (props) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const outroFrames = Math.round(OUTRO_SECONDS * FPS);

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={introFrames}>
          <IntroCard
            title={props.title}
            subtitle={props.subtitle}
            count={props.questions.length}
            backgroundSrc={props.backgrounds[0]}
          />
        </Series.Sequence>

        {props.questions.map((q, i) => (
          <Series.Sequence
            key={`${q.topic_slug}-${i}`}
            durationInFrames={Math.max(1, phaseTiming(props, i, FPS).totalFrames)}
          >
            <QuestionScene props={props} index={i} number={i + 1} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={outroFrames}>
          <OutroCard
            backgroundSrc={props.backgrounds[props.backgrounds.length - 1]}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const calcQuizLandscapeMetadata = ({ props }: { props: QuizProps }) => {
  const introFrames = Math.round(INTRO_SECONDS * FPS);
  const outroFrames = Math.round(OUTRO_SECONDS * FPS);
  const questions = allQuestionsDuration(props, FPS);
  return {
    durationInFrames: Math.max(1, introFrames + questions + outroFrames),
  };
};
