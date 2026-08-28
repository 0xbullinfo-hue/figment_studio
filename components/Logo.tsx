
import React from 'react';

interface LogoProps {
  /**
   * Size of the mark icon in px. Defaults to 36.
   */
  size?: number;
  /**
   * Show "figment creative studio" wordmark text beside the mark.
   */
  showWordmark?: boolean;
  /**
   * Show "creative studio" tagline below the wordmark.
   */
  showTagline?: boolean;
  /**
   * Render the mark only - no text regardless of other props.
   */
  iconOnly?: boolean;
  className?: string;
  /**
   * Custom text color (preserved for interface compatibility).
   */
  textColor?: string;
}

/**
 * Figment Creative Studio - official brand logo component using the official assets.
 */
const Logo: React.FC<LogoProps> = ({
  size = 36,
  showWordmark = true,
  iconOnly = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 flex-shrink-0 select-none ${className}`}
      aria-label="Figment Creative Studio Logo"
    >
      {/* Official Flame/Wing Mark */}
      <img
        src="/logo-icon.png"
        alt="Figment Studio Mark"
        style={{
          height: Math.round(size * 0.682),
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
          flexShrink: 0,
        }}
        draggable={false}
      />

      {/* Official "figment creative studio" Wordmark */}
      {!iconOnly && showWordmark && (
        <img
          src="/logo-text.png"
          alt="Figment Creative Studio"
          style={{
            height: Math.round(size * 0.72),
            width: 'auto',
            display: 'block',
            objectFit: 'contain',
            flexShrink: 0,
          }}
          draggable={false}
        />
      )}
    </div>
  );
};

export default Logo;


