import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${variantStyles[variant]} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="w-36 h-8" />
      <Skeleton className="w-48 h-3" />
    </div>
  );
}

export default Skeleton;
