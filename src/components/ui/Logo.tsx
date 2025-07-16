import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 320 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Global Law Logo"
  >
    {/* Icon: GL in a circle, stylized as an arrow */}
    <g>
      <circle cx="25" cy="25" r="24" fill="#00BFFF"/>
      <g stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* A path that combines G, L and an arrow shape */}
        <path d="M38 25 A 13 13 0 1 1 25 12 L 25 38 L 40 38 L 35 33 M 40 38 L 35 43" />
      </g>
    </g>
    
    {/* Text Part: GLOBAL LAW */}
    <g transform="translate(60, 0)">
      <text
        x="0"
        y="35"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="#2C2C2C"
        letterSpacing="1"
      >
        GLOBAL LAW
      </text>
      {/* Arrow overlay on the 'W' of LAW. Estimated position. */}
      <path
        d="M184 21 L206 21 L 201 17 M 206 21 L 201 25"
        stroke="#00BFFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default Logo;
