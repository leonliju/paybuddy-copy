import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-white tracking-tight font-display">{title}</h4>
      <p className="text-sm text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-sm font-semibold hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
