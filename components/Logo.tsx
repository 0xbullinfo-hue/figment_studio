
import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  /** 'default' = orange mark; 'white' = fully white for certain overlays */
  variant?: 'default' | 'white';
}

/**
 * Figment Studio logo — inline SVG (transparent background, always visible on dark).
 * The mark is a stylised swoosh "F": two curved strokes forming an abstract F shape
 * in the brand orange (#F07A3A).
 */
const LogoMark: React.FC<{ color?: string; className?: string }> = ({
  color = '#F07A3A',
  className = 'w-10 h-10',
}) => (
  <svg
    className={className}
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Upper swoosh — top bar of the F */}
    <path
      d="M18 44 C22 32 40 24 62 27 C76 29 84 35 78 43 C72 51 54 49 36 55"
      stroke={color}
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Lower swoosh — middle arm flowing into vertical stem */}
    <path
      d="M36 55 C44 52 54 51 60 55 C66 59 63 67 56 70 C44 74 24 76 20 96"
      stroke={color}
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const Logo: React.FC<LogoProps> = ({ className = 'w-9 h-9', iconOnly = false, variant = 'default' }) => {
  const markColor = variant === 'white' ? '#FFFFFF' : '#F07A3A';
  const textColor = variant === 'white' ? '#FFFFFF' : '#F07A3A';

  if (iconOnly) {
    return <LogoMark color={markColor} className={className} />;
  }

  return (
    <div className="flex items-center gap-3">
      <LogoMark color={markColor} className={className} />
      <div className="leading-none select-none">
        <p
          className="font-body font-semibold tracking-tight"
          style={{ color: variant === 'white' ? '#fff' : '#F2EDE6', fontSize: '0.9rem', lineHeight: 1 }}
        >
          Figment
        </p>
        <p
          className="font-body font-semibold uppercase"
          style={{
            color: textColor,
            fontSize: '0.5rem',
            letterSpacing: '0.22em',
            marginTop: '3px',
            lineHeight: 1,
          }}
        >
          creative studio
        </p>
      </div>
    </div>
  );
};

export default Logo;
