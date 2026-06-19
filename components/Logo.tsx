
import React from 'react';

interface LogoProps {
  /**
   * Size of the mark icon in px. Defaults to 36.
   */
  size?: number;
  /**
   * Show "figment" wordmark text beside the mark.
   */
  showWordmark?: boolean;
  /**
   * Show "creative studio" tagline below the wordmark.
   * Requires showWordmark to be true.
   */
  showTagline?: boolean;
  /**
   * Render the mark only — no text regardless of other props.
   */
  iconOnly?: boolean;
  className?: string;
  /**
   * Custom text color for the "figment" wordmark text.
   * Defaults to white (#FFFFFF).
   */
  textColor?: string;
}

/**
 * Figment Creative Studio — official brand logo component.
 *
 * Uses the real /logo.png asset (RGBA transparent background),
 * so the orange flame mark renders cleanly on any background color.
 *
 * Three visual variants:
 *  iconOnly                        → flame mark only (compact nav/favicon contexts)
 *  showWordmark                    → flame mark + "figment" (main header)
 *  showWordmark + showTagline      → flame mark + "figment" + "creative studio" (footer, hero)
 */
const Logo: React.FC<LogoProps> = ({
  size = 36,
  className = '',
  textColor = '#FFFFFF',
}) => {

  const isDarkText = textColor !== '#FFFFFF' && textColor !== 'white' && !textColor.startsWith('rgba(255');
  const imgFilter = isDarkText ? 'brightness(0)' : 'none';

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{
        height: size,
        width: Math.round(size * 3.8), // Tighter layout width for a more elegant horizontal balance
        overflow: 'hidden', // Crops the excessive transparent padding cleanly
      }}
      aria-label="figment creative studio logo"
    >
      {/* ── Transparent logo text image ── */}
      <img
        src="/logo-text.png"
        alt="" // decorative since wrapper has aria-label
        draggable={false}
        style={{
          height     : Math.round(size * 3.9), // Adjusted to ~3.9x for a clearer, less overpowering elegance
          width      : 'auto',
          maxWidth   : 'none', // Critical: allows image to overflow its container for cropping
          display    : 'block',
          flexShrink : 0,
          filter     : imgFilter,
          transform  : 'translateY(-2px)', // Optical adjustment to align the visual top of the logo text with the menu text
        }}
      />
    </div>
  );
};

export default Logo;
