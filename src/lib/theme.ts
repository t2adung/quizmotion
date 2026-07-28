import "./fonts";

// Pop-art yellow/purple palette (matches the reference "Quiz Time" style).
export const theme = {
  colors: {
    purple: "#5B2A9D",
    purpleDeep: "#3A1466",
    purpleLight: "#7B3FBF",
    yellow: "#FFD400",
    yellowSoft: "#FFE875",
    pink: "#FF4FA3",
    cyan: "#39D8E8",
    white: "#FFFFFF",
    ink: "#1E0A3C",
    correct: "#27E67A",
    correctDeep: "#0FA858",
    dim: "rgba(255,255,255,0.22)",
  },
  radius: 28,
  shadow: "0 14px 0 rgba(0,0,0,0.28)",
} as const;

export const optionColors = {
  A: { bg: "#FF6B6B", label: "A" },
  B: { bg: "#4D96FF", label: "B" },
  C: { bg: "#FFA43D", label: "C" },
  D: { bg: "#22C1A6", label: "D" },
} as const;

// Self-hosted fonts (see src/lib/fonts.ts) with full Vietnamese coverage.
export const fonts = {
  display: "'Quicksand', system-ui, sans-serif",
  body: "'Be Vietnam Pro', system-ui, sans-serif",
};
