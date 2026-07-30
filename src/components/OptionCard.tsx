import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, optionColors, fonts } from "../lib/theme";
import type { OptionKey } from "../schema";

type Phase = "idle" | "reveal";

export const OptionCard: React.FC<{
  optionKey: OptionKey;
  text: string;
  /** Frame (relative) at which this card pops in. */
  appearAt: number;
  phase: Phase;
  isCorrect: boolean;
  fontSize: number;
}> = ({ optionKey, text, appearAt, phase, isCorrect, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = optionColors[optionKey];

  const pop = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.6 },
  });
  const enterX = interpolate(pop, [0, 1], [-60, 0]);

  const revealed = phase === "reveal";
  const dimmed = revealed && !isCorrect;
  const highlight = revealed && isCorrect;

  // Correct answer bounce on reveal.
  const revealPop = highlight
    ? spring({ frame: frame - appearAt, fps, config: { damping: 8, stiffness: 90 } })
    : 0;
  const scale = 0.9 + pop * 0.1 + (highlight ? revealPop * 0.06 : 0);

  const bg = highlight ? theme.colors.correct : palette.bg;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.7,
        background: bg,
        borderRadius: theme.radius,
        padding: `${fontSize * 0.55}px ${fontSize * 0.7}px`,
        boxShadow: highlight
          ? `0 0 0 6px ${theme.colors.white}, 0 16px 0 ${theme.colors.correctDeep}`
          : theme.shadow,
        opacity: dimmed ? 0.35 : pop,
        transform: `translateX(${enterX}px) scale(${scale})`,
        transformOrigin: "left center",
        border: `4px solid rgba(0,0,0,0.15)`,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: fontSize * 1.7,
          height: fontSize * 1.7,
          borderRadius: "50%",
          background: theme.colors.white,
          color: theme.colors.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: fontSize * 1.05,
        }}
      >
        {highlight ? "✓" : palette.label}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize,
          color: theme.colors.white,
          lineHeight: 1.15,
          textShadow: "0 2px 2px rgba(0,0,0,0.25)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
