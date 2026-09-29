import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, Copy, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'copy';

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'success',
  onClose,
  duration = 3500,
  className = '',
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose?.();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'error':
        return {
          bg: 'bg-rose-950 text-white border-rose-800',
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
        };
      case 'info':
        return {
          bg: 'bg-stone-900 text-white border-stone-700',
          icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
        };
      case 'copy':
        return {
          bg: 'bg-neutral-900 text-white border-stone-800',
          icon: <Copy className="w-4 h-4 text-amber-300 shrink-0" />,
        };
      case 'success':
      default:
        return {
          bg: 'bg-neutral-950 text-white border-stone-800',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <div
      role="alert"
      className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium border max-w-sm sm:max-w-md transition-all duration-200 ${
        isExiting ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
      } ${config.bg} ${className}`}
    >
      {config.icon}
      <span className="flex-1 leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
