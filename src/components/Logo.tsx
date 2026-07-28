import React from "react";

/**
 * Brand logo: a graduation cap over a rounded "b" monogram, grey on a pale
 * lime rounded tile — recreated as SVG from the supplied reference so it stays
 * crisp at any size and works offline.
 *
 * To use the exact original artwork instead, drop the file at
 * `public/logo.png` (or .svg) and render <Img src={staticFile("logo.png")} />
 * where <Logo/> is used.
 */
export const Logo: React.FC<{
  size: number;
  /** Show the pale rounded tile behind the mark (for contrast on the purple bg). */
  withTile?: boolean;
  tileColor?: string;
  markColor?: string;
  style?: React.CSSProperties;
}> = ({
  size,
  withTile = true,
  tileColor = "#E9F5A3",
  markColor = "#6E6E6E",
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      style={{ display: "block", ...style }}
      role="img"
      aria-label="Logo"
    >
      {withTile ? (
        <rect x="0" y="0" width="240" height="240" rx="48" fill={tileColor} />
      ) : null}

      <g fill={markColor}>
        {/* "b" stem */}
        <rect x="80" y="82" width="24" height="104" rx="12" />
        {/* "b" bowl (donut for the counter) */}
        <path
          d="M128 122
             a38 38 0 1 0 0.001 0 Z
             M128 150
             a10 10 0 1 1 -0.001 0 Z"
          fillRule="evenodd"
        />

        {/* Graduation cap sitting on the stem, tilted slightly */}
        <g transform="rotate(-8 120 66)">
          {/* Mortarboard (diamond) */}
          <polygon points="120,40 176,66 120,92 64,66" />
          {/* Cap band under the board */}
          <path d="M96 78 h48 v10 a24 12 0 0 1 -48 0 Z" />
          {/* Button + tassel */}
          <circle cx="120" cy="40" r="6" />
          <path
            d="M120 40 C 150 44, 168 50, 168 66"
            stroke={markColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="168" cy="80" r="8" />
          <rect x="164" y="64" width="8" height="16" rx="4" />
        </g>
      </g>
    </svg>
  );
};
