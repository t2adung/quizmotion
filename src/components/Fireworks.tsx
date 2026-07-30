import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/** Deterministic pseudo-random in [0,1). */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Burst = {
  x: number; // 0..1
  y: number; // 0..1
  start: number; // frame
  hue: number;
  particles: number;
};

/**
 * Frame-driven fireworks: several bursts of particles that expand outward,
 * fall under gravity, and fade. Bursts loop over `period` frames so the effect
 * fills a celebratory outro. Pure divs — no canvas, deterministic per frame.
 */
export const Fireworks: React.FC<{ burstCount?: number; period?: number }> = ({
  burstCount = 7,
  period = 75,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const bursts: Burst[] = Array.from({ length: burstCount }, (_, i) => ({
    x: 0.12 + rand(i * 3 + 1) * 0.76,
    y: 0.15 + rand(i * 3 + 2) * 0.5,
    start: Math.floor(rand(i * 3 + 3) * period),
    hue: Math.floor(rand(i * 7 + 5) * 360),
    particles: 26,
  }));

  const lifetime = fps * 1.4; // frames a burst stays visible

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {bursts.map((b, bi) => {
        // Time since this burst's most recent launch (looping).
        const local = ((frame - b.start) % period + period) % period;
        if (local > lifetime) return null;
        const t = local / lifetime; // 0..1 progress
        const cx = b.x * width;
        const cy = b.y * height;
        const spread = Math.min(width, height) * 0.28;

        return (
          <div key={bi}>
            {Array.from({ length: b.particles }, (_, pi) => {
              const angle = (pi / b.particles) * Math.PI * 2 + rand(bi * 31 + pi) * 0.2;
              const speed = 0.6 + rand(bi * 17 + pi * 2) * 0.5;
              const dist = spread * speed * easeOut(t);
              const px = cx + Math.cos(angle) * dist;
              const py = cy + Math.sin(angle) * dist + easeOut(t) * spread * 0.5 * t; // gravity
              const size = Math.max(3, Math.min(width, height) * 0.012 * (1 - t * 0.7));
              const hue = (b.hue + pi * 4) % 360;
              return (
                <div
                  key={pi}
                  style={{
                    position: "absolute",
                    left: px,
                    top: py,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: `hsl(${hue}, 95%, ${62 + t * 12}%)`,
                    opacity: Math.max(0, 1 - t) ** 1.2,
                    boxShadow: `0 0 ${size * 2.5}px hsl(${hue}, 100%, 70%)`,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
