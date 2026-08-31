import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function BottomSheet({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md transition-opacity">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet / Modal Container */}
      <div
        className={`relative w-full ${maxWidth} bg-[#181818] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden animate-fade-in`}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle indicator */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-white font-display tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#8A8F98] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A8F98] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;
