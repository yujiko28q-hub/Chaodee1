import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'row' | 'detail' | 'text' | 'circle';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'card',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs animate-pulse ${className}`}
          >
            {/* Image Placeholder */}
            <div className="aspect-[3/4] bg-stone-200 relative">
              <div className="absolute top-3 left-3 w-16 h-5 bg-stone-300 rounded-full" />
              <div className="absolute top-3 right-3 w-8 h-8 bg-stone-300 rounded-full" />
            </div>

            {/* Content Placeholder */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3 bg-stone-200 rounded" />
                <div className="w-12 h-3 bg-stone-200 rounded" />
              </div>

              <div className="w-3/4 h-5 bg-stone-200 rounded" />
              
              <div className="flex gap-1.5 pt-1">
                <div className="w-8 h-5 bg-stone-100 rounded-md" />
                <div className="w-8 h-5 bg-stone-100 rounded-md" />
                <div className="w-8 h-5 bg-stone-100 rounded-md" />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="w-16 h-3 bg-stone-200 rounded" />
                  <div className="w-24 h-5 bg-stone-300 rounded" />
                </div>
                <div className="w-20 h-8 bg-stone-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs animate-pulse flex flex-col sm:flex-row gap-5 ${className}`}
          >
            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-stone-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-3 bg-stone-200 rounded" />
                  <div className="w-2/3 h-5 bg-stone-300 rounded" />
                </div>
                <div className="w-28 h-6 bg-stone-200 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="h-10 bg-stone-100 rounded-xl" />
                <div className="h-10 bg-stone-100 rounded-xl" />
                <div className="h-10 bg-stone-100 rounded-xl" />
                <div className="h-10 bg-stone-100 rounded-xl" />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                <div className="w-32 h-4 bg-stone-200 rounded" />
                <div className="flex gap-2">
                  <div className="w-20 h-8 bg-stone-200 rounded-xl" />
                  <div className="w-24 h-8 bg-stone-200 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-3xl animate-pulse ${className}`}>
        <div className="aspect-[3/4] bg-stone-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="w-24 h-4 bg-stone-200 rounded" />
          <div className="w-3/4 h-8 bg-stone-300 rounded" />
          <div className="w-32 h-4 bg-stone-200 rounded" />
          <div className="h-24 bg-stone-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-stone-200 rounded" />
            <div className="w-5/6 h-4 bg-stone-200 rounded" />
            <div className="w-2/3 h-4 bg-stone-200 rounded" />
          </div>
          <div className="h-12 bg-stone-300 rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={`w-12 h-12 bg-stone-200 rounded-full animate-pulse ${className}`} />
    );
  }

  return (
    <div className={`space-y-2.5 animate-pulse ${className}`}>
      {items.map((_, idx) => (
        <div key={idx} className="h-4 bg-stone-200 rounded w-full" />
      ))}
    </div>
  );
};
