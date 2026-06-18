
import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'dark' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10', iconOnly = false, variant = 'default' }) => {
  if (iconOnly) {
    return (
      <img
        src="/logo.png"
        alt="Figment Studio"
        className={`object-contain ${className}`}
        style={{ filter: variant === 'light' ? 'brightness(0) invert(1)' : undefined }}
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Figment Studio"
        className={`object-contain ${className}`}
        style={{ filter: variant === 'light' ? 'brightness(0) invert(1)' : undefined }}
      />
    </div>
  );
};

export default Logo;
