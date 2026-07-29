import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { BookCover } from "./IntroCard";
import { theme, fonts } from "../lib/theme";

export const OutroCard: React.FC<{
  message?: string;
  backgroundSrc?: string;
  coverSrc?: string;
}> = ({ message = "Cảm ơn đã xem!", backgroundSrc, coverSrc }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  // Slightly smaller content + a ~5% safe-area margin on every side.
  const big = width * 0.07;
  const pad = width * 0.11;

  return (
    <AbsoluteFill>
      <Background seed={3} imageSrc={backgroundSrc} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: big * 0.5,
          padding: pad,
        }}
      >
        {coverSrc ? (
          <BookCover src={coverSrc} scale={scale} height={width * 0.22} tilt={0} />
        ) : null}
        <div
          style={{
            transform: `scale(${scale})`,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: big,
            color: theme.colors.yellow,
            textShadow: "0 4px 0 rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          {message}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: big * 0.4,
            color: theme.colors.white,
            opacity: 0.9,
          }}
        >
          👍 Like · 🔔 Đăng ký
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
