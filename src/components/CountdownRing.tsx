import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

/**
 * Circular countdown timer. `startFrame` is when counting begins, `frames`
 * is the total countdown length (relative to the enclosing Sequence).
 */
export const CountdownRing: React.FC<{
  startFrame: number;
  frames: number;
  size: number;
}> = ({ startFrame, frames, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.min(Math.max(frame - startFrame, 0), frames);
  const progress = 1 - elapsed / frames; // 1 -> 0
  const secondsLeft = Math.max(0, Math.ceil((frames - elapsed) / fps));

  const stroke = size * 0.09;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * progress;

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="rgba(0,0,0,0.25)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={progress > 0.35 ? theme.colors.yellow : theme.colors.pink}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: size * 0.42,
          color: theme.colors.white,
        }}
      >
        {secondsLeft}
      </div>
    </div>
  );
};
