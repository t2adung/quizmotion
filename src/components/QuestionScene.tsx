import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { OptionCard } from "./OptionCard";
import { CountdownRing } from "./CountdownRing";
import { theme, fonts } from "../lib/theme";
import { phaseTiming } from "../lib/manifest";
import type { OptionKey, QuizProps } from "../schema";

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

/**
 * Renders one full quiz question: read → countdown → reveal → explanation.
 * Works for both portrait (Shorts) and landscape layouts; sizing derives
 * from the constraining axis so text scales sensibly in either aspect.
 */
export const QuestionScene: React.FC<{
  props: QuizProps;
  index: number;
  /** 1-based number to show as a badge ("Câu 3"). */
  number?: number;
}> = ({ props, index, number }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height >= width;
  const base = portrait ? width : height;

  const q = props.questions[index];
  const clip = props.clips[index];
  const t = phaseTiming(props, index, fps);

  const countdownStart = t.readFrames;
  const revealStart = countdownStart + t.countdownFrames;
  const explanationStart = revealStart + t.revealFrames;

  const phase: "idle" | "reveal" = frame >= revealStart ? "reveal" : "idle";

  // Slightly smaller content so it fits above the countdown/logo band.
  const qFont = base * (portrait ? 0.046 : 0.05);
  const optFont = base * (portrait ? 0.035 : 0.04);
  const ringSize = base * (portrait ? 0.22 : 0.17);

  // Layout zones: question + options live in the top ~2/3; the countdown and
  // explanation live below without overlapping the content, and a safe strip at
  // the very bottom is reserved for a logo baked into the background. Landscape
  // needs a slightly taller content band because the 2×2 grid is wider.
  const CONTENT_FRAC = portrait ? 2 / 3 : 0.72;
  const logoSafe = height * (portrait ? 0.1 : 0.05);

  // Question card entrance.
  const qPop = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });

  const bgImage = props.backgrounds.length
    ? props.backgrounds[index % props.backgrounds.length]
    : undefined;

  return (
    <AbsoluteFill>
      <Background seed={index} imageSrc={bgImage} />

      {/* Audio narration */}
      {clip?.questionAudioSrc ? (
        <Sequence from={0} durationInFrames={Math.max(1, t.readFrames)}>
          <Audio src={staticFile(clip.questionAudioSrc)} />
        </Sequence>
      ) : null}
      {clip?.explanationAudioSrc ? (
        <Sequence from={explanationStart}>
          <Audio src={staticFile(clip.explanationAudioSrc)} />
        </Sequence>
      ) : null}

      {/* Content zone: top 2/3 of the frame */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${CONTENT_FRAC * 100}%`,
          padding: `${base * 0.07}px ${base * 0.08}px 0`,
          display: "flex",
          flexDirection: "column",
          gap: base * 0.03,
        }}
      >
        {/* Question number badge */}
        {number != null ? (
          <div
            style={{
              alignSelf: "flex-start",
              background: theme.colors.pink,
              color: theme.colors.white,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: base * 0.036,
              padding: `${base * 0.012}px ${base * 0.035}px`,
              borderRadius: 999,
              boxShadow: theme.shadow,
            }}
          >
            Câu {number}
          </div>
        ) : null}

        {/* Question card */}
        <div
          style={{
            transform: `scale(${0.92 + qPop * 0.08})`,
            transformOrigin: "top center",
            background: theme.colors.white,
            color: theme.colors.ink,
            borderRadius: theme.radius,
            padding: base * 0.045,
            boxShadow: theme.shadow,
            border: "5px solid rgba(0,0,0,0.12)",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: qFont,
            lineHeight: 1.18,
          }}
        >
          {q.question}
        </div>

        {/* Options */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: portrait ? "1fr" : "1fr 1fr",
            gap: base * 0.028,
            flex: 1,
            alignContent: "center",
          }}
        >
          {OPTION_KEYS.map((k, i) => (
            <OptionCard
              key={k}
              optionKey={k}
              text={q[k]}
              appearAt={6 + i * 5}
              phase={phase}
              isCorrect={q.correct_answer === k}
              fontSize={optFont}
            />
          ))}
        </div>
      </div>

      {/* Countdown ring — centered in the bottom third, above the logo strip */}
      <Sequence from={countdownStart} durationInFrames={t.countdownFrames}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${CONTENT_FRAC * 100}%`,
            bottom: logoSafe,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CountdownRing startFrame={0} frames={t.countdownFrames} size={ringSize} />
        </div>
      </Sequence>

      {/* Explanation panel — anchored above the bottom logo strip */}
      <ExplanationPanel
        text={q.explanation_vi}
        startFrame={explanationStart}
        base={base}
        bottomOffset={logoSafe}
      />
    </AbsoluteFill>
  );
};

const ExplanationPanel: React.FC<{
  text: string;
  startFrame: number;
  base: number;
  bottomOffset: number;
}> = ({ text, startFrame, base, bottomOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame) return null;

  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const y = interpolate(enter, [0, 1], [80, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        display: "flex",
        justifyContent: "center",
        paddingLeft: base * 0.06,
        paddingRight: base * 0.06,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          opacity: enter,
          background: theme.colors.yellow,
          color: theme.colors.ink,
          borderRadius: theme.radius,
          padding: base * 0.04,
          boxShadow: theme.shadow,
          border: "5px solid rgba(0,0,0,0.14)",
          maxWidth: "94%",
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: base * 0.036,
          lineHeight: 1.25,
        }}
      >
        <span style={{ fontFamily: fonts.display, fontWeight: 700 }}>💡 Giải thích: </span>
        {text}
      </div>
    </div>
  );
};
