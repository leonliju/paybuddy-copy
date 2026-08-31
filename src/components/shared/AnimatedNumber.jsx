import React from 'react';

export function AnimatedNumber({ value, prefix = '₹', suffix = '', decimals = 0, className = '' }) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  const formatted = numValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`tabular-nums font-semibold tracking-tight ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default AnimatedNumber;
