import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
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
  coverSrc?: string;
  book?: string;
  subject?: string;
  lesson?: string;
}> = ({ title, subtitle, count, backgroundSrc, coverSrc, book, subject, lesson }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const wobble = Math.sin(frame / 6) * 2;
  // Slightly smaller content + a ~5% safe-area margin on every side.
  const big = width * 0.078;
  const pad = width * 0.11;
  const align = coverSrc ? "flex-start" : "center";
  const textAlign = coverSrc ? "left" : "center";

  const fadeAt = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Subtitle lines: prefer the explicit subject/lesson, else the auto subtitle.
  const subtitleLines = subject || lesson ? [subject, lesson].filter(Boolean) : subtitle ? [subtitle] : [];

  const textBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        justifyContent: "center",
      }}
    >
      {book ? (
        <div
          style={{
            marginBottom: big * 0.35,
            opacity: fadeAt(4, 18),
            alignSelf: align,
            background: "rgba(0,0,0,0.32)",
            color: theme.colors.white,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: big * 0.3,
            padding: `${big * 0.12}px ${big * 0.4}px`,
            borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.35)",
          }}
        >
          📘 {book}
        </div>
      ) : null}
      <div
        style={{
          transform: `scale(${scale}) rotate(${wobble}deg)`,
          transformOrigin: coverSrc ? "left center" : "center",
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
      {subtitleLines.map((line, i) => (
        <div
          key={i}
          style={{
            marginTop: big * (i === 0 ? 0.5 : 0.15),
            opacity: fadeAt(10 + i * 6, 25 + i * 6),
            fontFamily: fonts.body,
            fontWeight: i === 0 ? 700 : 600,
            fontSize: big * (i === 0 ? 0.42 : 0.36),
            color: theme.colors.white,
            textAlign,
            maxWidth: "95%",
            textShadow: "0 2px 3px rgba(0,0,0,0.35)",
          }}
        >
          {line}
        </div>
      ))}
      <div
        style={{
          marginTop: big * 0.55,
          alignSelf: coverSrc ? "flex-start" : "center",
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
    </div>
  );

  return (
    <AbsoluteFill>
      <Background imageSrc={backgroundSrc} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: pad,
          gap: coverSrc ? width * 0.045 : 0,
          flexDirection: coverSrc ? "row" : "column",
        }}
      >
        {coverSrc ? <BookCover src={coverSrc} scale={scale} height={width * 0.34} /> : null}
        {textBlock}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A book cover image with a 2:3 frame, rounded corners, shadow, playful tilt. */
export const BookCover: React.FC<{
  src: string;
  scale: number;
  height: number;
  tilt?: number;
}> = ({ src, scale, height, tilt = -3 }) => {
  return (
    <div
      style={{
        flex: "0 0 auto",
        transform: `scale(${scale}) rotate(${tilt}deg)`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        border: "6px solid rgba(255,255,255,0.9)",
        background: theme.colors.white,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          height,
          width: height * (2 / 3),
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};
