
import React from 'react';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  iconOnly?: boolean;
  color?: string;
  className?: string;
}

/**
 * Figment Studio — refined mark-only SVG.
 * A geometric "F" constructed from two precise horizontal bars and a vertical stroke,
 * all in the brand orange, designed for dark backgrounds.
 */
const Logo: React.FC<LogoProps> = ({
  size = 36,
  showWordmark = false,
  iconOnly = false,
  color = '#F07A3A',
  className = '',
}) => {
  const displayWordmark = showWordmark && !iconOnly;

  return (
    <div className={`inline-flex items-center gap-3 flex-shrink-0 ${className}`}>
      {/* Mark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Figment Studio mark"
        className="flex-shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Vertical stem */}
        <rect x="8" y="6" width="4" height="28" fill={color} />
        {/* Top bar */}
        <rect x="8" y="6" width="22" height="4" fill={color} />
        {/* Middle bar (shorter — classic F proportions) */}
        <rect x="8" y="19" width="16" height="4" fill={color} />
      </svg>

      {displayWordmark && (
        <div className="leading-none select-none text-left">
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            Figment
          </p>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.5rem',
              fontWeight: 500,
              color,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: '4px',
              lineHeight: 1,
            }}
          >
            Studio
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
