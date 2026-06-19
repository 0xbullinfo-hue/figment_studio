
import React from 'react';

interface LogoProps {
  /**
   * Size of the mark icon in px. Default 36.
   */
  size?: number;
  /**
   * Show "figment" text beside / below the mark.
   * Default false.
   */
  showWordmark?: boolean;
  /**
   * Show "creative studio" tagline below the wordmark.
   * Only relevant when showWordmark is true.
   * Default false.
   */
  showTagline?: boolean;
  /**
   * Render mark only (no wordmark regardless of showWordmark).
   * Default false.
   */
  iconOnly?: boolean;
  /**
   * Primary brand colour for the mark and tagline.
   * Default: '#F07A3A'
   */
  color?: string;
  className?: string;
}

/**
 * Figment Creative Studio — accurate brand mark.
 *
 * The mark is a stylised calligraphic "F" formed by two overlapping
 * curved flame/wing strokes in brand orange, matching the official logo.
 *
 * Variants:
 *  - iconOnly / no showWordmark  →  mark only
 *  - showWordmark (no tagline)   →  mark + "figment"         (header use)
 *  - showWordmark + showTagline  →  mark + "figment" + "creative studio" (footer / hero)
 */
const Logo: React.FC<LogoProps> = ({
  size = 36,
  showWordmark = false,
  showTagline = false,
  iconOnly = false,
  color = '#F07A3A',
  className = '',
}) => {
  const displayWordmark = showWordmark && !iconOnly;
  const displayTagline  = displayWordmark && showTagline;

  // Scale factor for line widths / font sizes relative to mark size
  const scale = size / 36;

  return (
    <div className={`inline-flex items-center gap-2.5 flex-shrink-0 select-none ${className}`}>

      {/* ── Brand Mark SVG ── */}
      <svg
        viewBox="0 0 80 86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Figment Creative Studio"
        role="img"
        style={{ width: size, height: Math.round(size * 86 / 80), flexShrink: 0 }}
      >
        {/*
          The Figment "F" flame mark:
          Two overlapping calligraphic swoosh strokes.
          Stroke 1 (outer / primary) — the larger wing arc, orange fill.
          Stroke 2 (inner / shadow)  — smaller wing sitting inside the outer one,
                                       darker tint creates the depth/overlap effect.
        */}

        {/* Outer primary flame stroke */}
        <path
          d="
            M 22 78
            C 14 65, 10 46, 14 30
            C 18 14, 32 4, 48 5
            C 62 6, 72 16, 70 30
            C 68 43, 56 50, 44 53
            C 36 56, 28 60, 26 70
            Z
          "
          fill={color}
        />

        {/* Inner shadow stroke — overlaps the outer, creating the two-layer flame effect */}
        <path
          d="
            M 32 74
            C 26 62, 24 47, 30 35
            C 35 24, 48 18, 60 22
            C 69 26, 72 36, 68 46
            C 64 55, 54 60, 46 63
            C 40 66, 34 68, 32 74
            Z
          "
          fill="rgba(0,0,0,0.28)"
        />

        {/* Highlight — thin inner edge to give the mark a glossy depth */}
        <path
          d="
            M 36 70
            C 31 60, 30 48, 35 38
            C 40 28, 52 23, 62 28
          "
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
          fill="none"
        />
      </svg>

      {/* ── Wordmark ── */}
      {displayWordmark && (
        <div className="leading-none text-left" style={{ lineHeight: 1 }}>
          {/* "figment" — bold rounded sans */}
          <p
            style={{
              fontFamily: "'Outfit', 'DM Sans', sans-serif",
              fontSize : `${Math.round(14 * scale)}px`,
              fontWeight: 800,
              color    : '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              margin   : 0,
            }}
          >
            figment
          </p>

          {/* "creative studio" — only when tagline enabled */}
          {displayTagline && (
            <p
              style={{
                fontFamily  : "'Outfit', 'DM Sans', sans-serif",
                fontSize    : `${Math.round(7 * scale)}px`,
                fontWeight  : 500,
                color       : color,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                lineHeight  : 1,
                marginTop   : `${Math.round(4 * scale)}px`,
              }}
            >
              creative studio
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
