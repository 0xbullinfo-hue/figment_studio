import React from 'react';

interface LogoProps {
  /**
   * Size of the mark icon in px. Defaults to { sm: 28, md: 32, lg: 38 }.
   */
  size?: number | { sm: number; md: number; lg: number };
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
  size = { sm: 28, md: 32, lg: 38 },
  showWordmark = true,
  showTagline = false,
  iconOnly = false,
  className = '',
}) => {
  // Resolve responsive size
  const resolvedSize = typeof size === 'number' ? size : size.lg;
  const iconHeight = Math.round(resolvedSize * 0.682);
  const wordmarkHeight = Math.round(resolvedSize * 0.72);

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 flex-shrink-0 select-none max-w-full ${className}`}
      aria-label="Figment Creative Studio Logo"
    >
      {/* Official Flame/Wing Mark */}
      <img
        src="/logo-icon.png"
        alt="Figment Studio Mark"
        className="block object-contain flex-shrink-0"
        style={{ height: iconHeight }}
        draggable={false}
      />

      {/* Official "figment creative studio" Wordmark */}
      {!iconOnly && showWordmark && (
        <div className="flex flex-col items-start overflow-hidden">
          <img
            src="/logo-text.png"
            alt="Figment Creative Studio"
            className="block object-contain flex-shrink-0 max-w-[120px] sm:max-w-[160px] md:max-w-none"
            style={{ height: wordmarkHeight }}
            draggable={false}
          />
          {showTagline && (
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-white/30 font-sans mt-0.5 hidden sm:block">
              Creative Studio
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
