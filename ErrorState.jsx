import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function ErrorState({
  title = 'Failed to load intelligence data',
  description = 'An error occurred while connecting to the analytics engine. Please check your connection or retry.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-red-500/20 bg-red-500/[0.02]">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#EF4444] mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-sm text-[#8A8F98] max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
}

export default ErrorState;
