import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../lib/theme";

/**
 * Scene background. If `imageSrc` is given (a staticFile-relative path such as
 * "backgrounds/space.jpg") the image is shown full-bleed with a subtle overlay
 * for text legibility. Otherwise it falls back to the animated pop-art
 * background: purple base, halftone dots, comic rays.
 */
export const Background: React.FC<{ seed?: number; imageSrc?: string }> = ({
  seed = 0,
  imageSrc,
}) => {
  if (imageSrc) {
    return <ImageBackground imageSrc={imageSrc} />;
  }
  return <ProceduralBackground seed={seed} />;
};

const ImageBackground: React.FC<{ imageSrc: string }> = ({ imageSrc }) => {
  return (
    <AbsoluteFill style={{ background: theme.colors.purpleDeep }}>
      <Img
        src={staticFile(imageSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Soft top/bottom shading keeps white cards & text readable on any image. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.32) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const ProceduralBackground: React.FC<{ seed: number }> = ({ seed }) => {
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
