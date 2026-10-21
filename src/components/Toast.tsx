import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex-shrink-0">
        {isSuccess && (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
        )}
        {isError && (
          <AlertCircle className="w-5 h-5 text-red-600 stroke-[2.2]" />
        )}
        {!isSuccess && !isError && (
          <Info className="w-5 h-5 text-blue-600" />
        )}
      </div>

      <div className="text-xs font-semibold tracking-tight text-slate-800 pr-2">
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
