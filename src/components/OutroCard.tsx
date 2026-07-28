import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { Logo } from "./Logo";
import { theme, fonts } from "../lib/theme";

export const OutroCard: React.FC<{ message?: string }> = ({
  message = "Cảm ơn đã xem!",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const big = width * 0.08;

  return (
    <AbsoluteFill>
      <Background seed={3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: big * 0.5 }}>
        <Logo
          size={big * 1.5}
          style={{
            transform: `scale(${scale})`,
            filter: "drop-shadow(0 10px 0 rgba(0,0,0,0.25))",
          }}
        />
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
