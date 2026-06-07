import React from 'react';

interface CrestLogoProps {
  className?: string;
  size?: number;
}

export default function CrestLogo({ className = '', size = 180 }: CrestLogoProps) {
  return (
    <div 
      className={`mx-auto flex items-center justify-center text-gold-500 hover:text-gold-400 transition-all duration-300 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      id="crest-logo"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Outer Circular Bounds */}
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
        <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="1.2" />

        {/* Outer Top Text: MENTOR ACADEMY */}
        <path
          id="textArcTop"
          d="M 28,100 A 72,72 0 1,1 172,100"
          fill="none"
          stroke="transparent"
        />
        <text className="font-display fill-current text-[11.5px] uppercase tracking-[0.2em] font-bold">
          <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
            Mentor Academy
          </textPath>
        </text>

        {/* Outer Bottom Laurels */}
        <path
          id="textArcBottom"
          d="M 172,100 A 72,72 0 0,1 28,100"
          fill="none"
          stroke="transparent"
        />
        <text className="font-serif italic fill-current text-[8px] tracking-[0.15em]">
          <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
            • HONOR • INTEGRITY • EXCELLENCE •
          </textPath>
        </text>

        {/* Laurel Wreath wrapping the inner seal */}
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="opacity-90">
          {/* Left Laurel */}
          <path d="M 52,118 C 45,100 48,80 57,65" />
          <path d="M 47,112 C 48,110 52,111 52,114 C 52,117 48,117 47,112 Z" fill="currentColor" />
          <path d="M 44,100 C 46,98 50,100 50,102 C 50,104 46,105 44,100 Z" fill="currentColor" />
          <path d="M 45,88  C 47,86 51,89 50,91 C 49,93 45,92 45,88 Z" fill="currentColor" />
          <path d="M 49,77  C 51,75 55,78 53,80 C 52,82 48,81 49,77 Z" fill="currentColor" />
          <path d="M 55,67  C 56,65 60,68 58,70 C 57,72 53,70 55,67 Z" fill="currentColor" />

          {/* Right Laurel */}
          <path d="M 148,118 C 155,100 152,80 143,65" />
          <path d="M 153,112 C 152,110 148,111 148,114 C 148,117 152,117 153,112 Z" fill="currentColor" />
          <path d="M 156,100 C 154,98 150,100 150,102 C 150,104 154,105 156,100 Z" fill="currentColor" />
          <path d="M 155,88  C 153,86 149,89 150,91 C 151,93 155,92 155,88 Z" fill="currentColor" />
          <path d="M 151,77  C 149,75 145,78 147,80 C 148,82 152,81 151,77 Z" fill="currentColor" />
          <path d="M 145,67  C 144,65 140,68 142,70 C 143,72 147,70 145,67 Z" fill="currentColor" />
        </g>

        {/* Central Shield Container */}
        <g stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05">
          <path d="M 75,70 Q 100,74 125,70 L 125,105 Q 125,130 100,142 Q 75,130 75,105 Z" />
        </g>

        {/* Shield Internal Ribbons */}
        <line x1="76" y1="102" x2="124" y2="102" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        {/* Open Book in the bottom compartment */}
        <g stroke="currentColor" strokeWidth="1" fill="none" transform="translate(85, 108)">
          <path d="M 1,12 Q 7,7 14,9 Q 21,7 28,12 L 28,3 Q 21,-2 14,0 Q 7,-2 1,3 Z" fill="currentColor" fillOpacity="0.1" />
          <line x1="14" y1="0" x2="14" y2="10" />
        </g>

        {/* Torch in the upper compartment */}
        <g stroke="currentColor" strokeWidth="1.2" fill="currentColor">
          {/* Torch Handle */}
          <line x1="100" y1="94" x2="100" y2="82" strokeWidth="2.5" />
          <path d="M 94,80 L 106,80 L 102,84 L 98,84 Z" />
          {/* Flame */}
          <path d="M 100,72 C 103,75 104,78 100,80 C 96,78 97,75 100,72" fill="currentColor" />
        </g>

        {/* Bold Letters M A in the center shield area */}
        <text 
          x="100" 
          y="98" 
          textAnchor="middle" 
          className="font-display fill-current font-black text-[22px] tracking-widest embossed-gold"
          style={{ letterSpacing: '0.12em' }}
        >
          MA
        </text>

        {/* Center Star details */}
        <polygon points="100,154 103,161 110,161 105,166 107,173 100,169 93,173 95,166 90,161 97,161" fill="currentColor" />
      </svg>
    </div>
  );
}
