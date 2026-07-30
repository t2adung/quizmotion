import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { Fireworks } from "./Fireworks";
import { theme, fonts } from "../lib/theme";

/** Celebratory end slide: fireworks + a "congratulations" message. */
export const OutroCard: React.FC<{
  message?: string;
  backgroundSrc?: string;
  coverSrc?: string;
}> = ({ message = "Chúc mừng!", backgroundSrc }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height >= width;
  const base = portrait ? width : height;
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 90 } });
  const wobble = Math.sin(frame / 7) * 2;
  const big = base * (portrait ? 0.11 : 0.1);

  return (
    <AbsoluteFill>
      <Background seed={3} imageSrc={backgroundSrc} />
      <Fireworks />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: big * 0.45,
          padding: base * 0.1,
        }}
      >
        <div style={{ fontSize: big * 1.4, transform: `scale(${pop})` }}>🎉</div>
        <div
          style={{
            transform: `scale(${pop}) rotate(${wobble}deg)`,
            background: theme.colors.yellow,
            color: theme.colors.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: big,
            lineHeight: 1.05,
            padding: `${big * 0.3}px ${big * 0.6}px`,
            borderRadius: theme.radius * 1.5,
            boxShadow: theme.shadow,
            border: "6px solid rgba(0,0,0,0.18)",
            textAlign: "center",
          }}
        >
          {message}
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: big * 0.5,
            color: theme.colors.white,
            textAlign: "center",
            textShadow: "0 3px 4px rgba(0,0,0,0.45)",
          }}
        >
          Bạn đã hoàn thành!
        </div>
        <div
          style={{
            marginTop: big * 0.2,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: big * 0.38,
            color: theme.colors.white,
            opacity: 0.92,
            textShadow: "0 2px 3px rgba(0,0,0,0.4)",
          }}
        >
          👍 Like · 🔔 Đăng ký
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
