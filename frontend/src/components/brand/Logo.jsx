import React from 'react';

/**
 * ShopLite Official Brand Emblem
 * Features Ocean Blue (#219ebc), Golden Yellow (#ffb703), and Light Sky Blue (#8ecae6)
 */
export const LogoIcon = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hexagon in Ocean Blue */}
      <path
        d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
        fill="#219ebc"
        fillOpacity="0.18"
        stroke="#8ecae6"
        strokeWidth="1.75"
      />
      {/* Interlocking 'S' in Ocean Blue and White */}
      <path
        d="M11 11H21V16H11V21H21"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central Golden Yellow Core */}
      <circle cx="16" cy="16" r="2" fill="#ffb703" />
    </svg>
  );
};

export const Logo = ({ size = 'md', subtitle = 'Enterprise Ops', className = '' }) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28;
  const titleSize = size === 'sm' ? '0.95rem' : size === 'lg' ? '1.35rem' : '1.1rem';

  return (
    <div className={`flex items-center gap-2.5 ${className}`.trim()}>
      <div
        style={{
          width: iconSize + 8,
          height: iconSize + 8,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-ocean-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(33, 158, 188, 0.4)',
          border: '1px solid var(--color-sky-blue)',
        }}
      >
        <LogoIcon size={iconSize} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#ffffff',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ShopLite
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-sky-blue)',
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
