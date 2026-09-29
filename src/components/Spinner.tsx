import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'stone' | 'rose';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }[size];

  const variantClasses = {
    primary: 'border-stone-200 border-t-stone-900',
    white: 'border-white/30 border-t-white',
    stone: 'border-stone-300 border-t-stone-600',
    rose: 'border-rose-200 border-t-rose-600',
  }[variant];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} role="status">
      <div
        className={`${sizeClasses} ${variantClasses} rounded-full animate-spin`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs font-medium text-stone-600 select-none">
          {label}
        </span>
      )}
    </div>
  );
};
