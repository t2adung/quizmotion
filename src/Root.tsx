import React from "react";
import { Composition } from "remotion";
import { QuizShort, calcQuizShortMetadata } from "./compositions/QuizShort";
import {
  QuizLandscape,
  calcQuizLandscapeMetadata,
} from "./compositions/QuizLandscape";
import { QuizPropsSchema, FPS, DIMENSIONS } from "./schema";
import { sampleProps } from "./sample";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuizShort"
        component={QuizShort}
        schema={QuizPropsSchema}
        fps={FPS}
        width={DIMENSIONS.short.width}
        height={DIMENSIONS.short.height}
        defaultProps={sampleProps(1)}
        calculateMetadata={calcQuizShortMetadata}
      />
      <Composition
        id="QuizLandscape"
        component={QuizLandscape}
        schema={QuizPropsSchema}
        fps={FPS}
        width={DIMENSIONS.landscape.width}
        height={DIMENSIONS.landscape.height}
        defaultProps={sampleProps(5)}
        calculateMetadata={calcQuizLandscapeMetadata}
      />
    </>
  );
};
