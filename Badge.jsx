import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const variantStyles = {
    default: 'bg-white/5 text-zinc-400 border-white/10',
    silver: 'bg-white/10 text-white border-white/25 shadow-[0_0_10px_rgba(255,255,255,0.08)]',
    purple: 'bg-white/10 text-white border-white/25 shadow-[0_0_10px_rgba(255,255,255,0.08)]', // backwards compatible
    green: 'bg-[#00D09C]/15 text-[#00D09C] border-[#00D09C]/30',
    amber: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30',
    red: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium font-mono',
    md: 'text-xs px-2.5 py-1 font-medium font-mono',
    lg: 'text-sm px-3 py-1.5 font-semibold font-mono',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
