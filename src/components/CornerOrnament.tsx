import React from 'react';

interface CornerOrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}

export default function CornerOrnament({ position, className = '', size = 56 }: CornerOrnamentProps) {
  // Rotate SVG according to position
  const rotationClass = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90'
  }[position];

  return (
    <div 
      className={`absolute pointer-events-none text-gold-500/80 hover:text-gold-400 transition-colors duration-500 ${rotationClass} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: position.includes('top') ? '6px' : 'auto',
        bottom: position.includes('bottom') ? '6px' : 'auto',
        left: position.includes('left') ? '6px' : 'auto',
        right: position.includes('right') ? '6px' : 'auto',
      }}
      id={`ornament-${position}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Intricate academic corner lace and flourish path */}
        <path d="M 5,5 L 95,5 C 80,5 65,15 60,30 C 55,45 65,55 50,70 C 40,80 30,75 20,60 C 15,50 18,35 5,20 L 5,5 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.05" />
        <path d="M 5,5 C 15,15 25,20 40,20 C 55,20 65,12 80,5" />
        <path d="M 5,5 C 15,15 20,25 20,40 C 20,55 12,65 5,80" />
        <path d="M 8,8 Q 28,28 48,8" />
        <path d="M 8,8 Q 28,28 8,48" strokeWidth="1" />
        
        {/* Core floral cluster */}
        <circle cx="22" cy="22" r="3" fill="currentColor" />
        <path d="M 22,22 C 30,30 35,45 28,55 C 24,60 18,52 14,35" strokeWidth="1.2" />
        <path d="M 22,22 C 30,30 45,35 55,28 C 60,24 52,18 35,14" strokeWidth="1.2" />
        
        {/* Accent dots */}
        <circle cx="48" cy="14" r="1.5" fill="currentColor" />
        <circle cx="14" cy="48" r="1.5" fill="currentColor" />
        <circle cx="28" cy="28" r="2" fill="currentColor" />
        <circle cx="36" cy="36" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
