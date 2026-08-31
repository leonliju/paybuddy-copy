import React from 'react';

export function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  glow = null, // 'silver' | 'green' | 'amber' | 'red'
  onClick,
  ...props
}) {
  const glowClasses = {
    silver: 'shadow-[0_0_35px_-5px_rgba(255,255,255,0.18)] border-[rgba(255,255,255,0.22)]',
    purple: 'shadow-[0_0_35px_-5px_rgba(255,255,255,0.18)] border-[rgba(255,255,255,0.22)]', // backwards compatible
    green: 'shadow-[0_0_25px_-5px_rgba(0,208,156,0.25)] border-[rgba(0,208,156,0.3)]',
    amber: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)] border-[rgba(245,158,11,0.3)]',
    red: 'shadow-[0_0_25px_-5px_rgba(239,68,68,0.25)] border-[rgba(239,68,68,0.3)]',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-[#141416] 
        border border-[rgba(255,255,255,0.1)] 
        rounded-2xl 
        p-5 
        transition-all duration-200 
        shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        ${glow ? glowClasses[glow] : ''}
        ${hoverEffect ? 'hover:border-[rgba(255,255,255,0.22)] hover:bg-[#1A1A1E] cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
