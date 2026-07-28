import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../lib/theme";

/** Animated pop-art background: purple base, halftone dots, comic rays. */
export const Background: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const rot = (frame * 0.15 + seed * 30) % 360;

  const rays = Array.from({ length: 16 }, (_, i) => i);
  const dots = Array.from({ length: 42 }, (_, i) => i);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${theme.colors.purpleLight}, ${theme.colors.purple} 55%, ${theme.colors.purpleDeep})`,
        overflow: "hidden",
      }}
    >
      {/* Sunburst rays */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.14,
          transform: `rotate(${rot}deg)`,
        }}
      >
        <div style={{ position: "relative", width: 0, height: 0 }}>
          {rays.map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 3000,
                height: 130,
                left: -1500,
                top: -65,
                background: theme.colors.yellow,
                transform: `rotate(${(360 / rays.length) * i}deg)`,
                transformOrigin: "center",
                opacity: i % 2 === 0 ? 1 : 0,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* Halftone dots */}
      <AbsoluteFill>
        {dots.map((i) => {
          const x = (i * 137.5) % 100;
          const y = (i * 61.8) % 100;
          const size = 10 + ((i * 7) % 26);
          const drift = Math.sin((frame + i * 20) / 40) * 8;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background:
                  i % 3 === 0
                    ? theme.colors.pink
                    : i % 3 === 1
                      ? theme.colors.cyan
                      : theme.colors.yellowSoft,
                opacity: 0.22,
                transform: `translateY(${drift}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
