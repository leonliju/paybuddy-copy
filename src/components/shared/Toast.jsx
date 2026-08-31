import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-white flex-shrink-0" />,
  };

  const borders = {
    success: 'border-[#00D09C]/30 shadow-[0_0_20px_-5px_rgba(0,208,156,0.3)]',
    error: 'border-[#EF4444]/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]',
    warning: 'border-[#F59E0B]/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]',
    info: 'border-white/25 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 md:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#141416] border ${borders[toast.type] || borders.info} text-white shadow-2xl animate-fade-in`}
            role="alert"
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
