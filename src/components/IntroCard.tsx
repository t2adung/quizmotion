import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { theme, fonts } from "../lib/theme";

export const IntroCard: React.FC<{
  title: string;
  subtitle: string;
  count: number;
  backgroundSrc?: string;
}> = ({ title, subtitle, count, backgroundSrc }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const wobble = Math.sin(frame / 6) * 2;
  const big = width * 0.09;

  return (
    <AbsoluteFill>
      <Background imageSrc={backgroundSrc} />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", padding: width * 0.06 }}
      >
        <div
          style={{
            transform: `scale(${scale}) rotate(${wobble}deg)`,
            background: theme.colors.yellow,
            color: theme.colors.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: big,
            padding: `${big * 0.35}px ${big * 0.8}px`,
            borderRadius: theme.radius * 1.5,
            boxShadow: theme.shadow,
            border: "6px solid rgba(0,0,0,0.18)",
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: big * 0.5,
              opacity: interpolate(frame, [10, 25], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: big * 0.42,
              color: theme.colors.white,
              textAlign: "center",
              maxWidth: "85%",
              textShadow: "0 2px 3px rgba(0,0,0,0.35)",
            }}
          >
            {subtitle}
          </div>
        ) : null}
        <div
          style={{
            marginTop: big * 0.55,
            opacity: interpolate(frame, [18, 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            background: theme.colors.pink,
            color: theme.colors.white,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: big * 0.34,
            padding: `${big * 0.16}px ${big * 0.5}px`,
            borderRadius: 999,
            boxShadow: theme.shadow,
          }}
        >
          {count} câu hỏi
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
