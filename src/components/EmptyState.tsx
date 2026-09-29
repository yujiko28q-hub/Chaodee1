import React, { ReactNode } from 'react';
import { Search, Sparkles, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export interface EmptyStateProps {
  icon?: 'search' | 'wardrobe' | 'favorites' | 'catalog' | ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const renderIcon = () => {
    if (typeof icon !== 'string') {
      return icon;
    }

    switch (icon) {
      case 'wardrobe':
        return (
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
        );
      case 'favorites':
        return (
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-2xs">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
        );
      case 'catalog':
        return (
          <div className="w-16 h-16 rounded-3xl bg-stone-100 text-stone-700 flex items-center justify-center mx-auto mb-4 border border-stone-200 shadow-2xs">
            <Sparkles className="w-8 h-8 stroke-[1.5]" />
          </div>
        );
      case 'search':
      default:
        return (
          <div className="w-16 h-16 rounded-3xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-4 border border-stone-200 shadow-2xs">
            <Search className="w-8 h-8 stroke-[1.5]" />
          </div>
        );
    }
  };

  return (
    <div
      className={`py-16 sm:py-20 px-6 text-center bg-white rounded-3xl border border-stone-200 shadow-2xs max-w-2xl mx-auto ${className}`}
    >
      {renderIcon()}

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed font-light">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 active:scale-98"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
