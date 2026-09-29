import React, { useState } from 'react';
import { Sparkles, Shirt } from 'lucide-react';

interface ItemVisualProps {
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  brand?: string;
  categoryNameTh?: string;
  className?: string;
  badge?: string;
}

export const ItemVisual: React.FC<ItemVisualProps> = ({
  imageUrl,
  imageAlt,
  title,
  brand,
  categoryNameTh,
  className = 'w-full h-full',
  badge
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (imageUrl && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
        {/* Placeholder shimmer while loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={imageAlt || title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle Bottom Gradient for High Legibility */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-neutral-900 shadow-sm border border-white/60">
            {badge}
          </div>
        )}

        {brand && (
          <div className="absolute bottom-2.5 left-3 text-[11px] text-white/95 font-medium tracking-wide drop-shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{brand}</span>
          </div>
        )}
      </div>
    );
  }

  // Graceful artistic fashion fallback
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-stone-900 via-neutral-900 to-rose-950 flex flex-col justify-between p-6 select-none text-white ${className}`}>
      <div className="flex items-center justify-between text-[11px] tracking-widest uppercase font-mono text-rose-200/70">
        <span>{brand || 'SETISTA EDITORIAL'}</span>
        <span className="px-2 py-0.5 rounded bg-white/10 text-white font-sans text-[10px]">
          {badge || 'MATCHING SET'}
        </span>
      </div>

      <div className="my-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-300/20 flex items-center justify-center mb-3">
          <Shirt className="w-8 h-8 text-rose-300 stroke-[1.5]" />
        </div>
        <p className="font-serif text-lg tracking-wide text-rose-100 max-w-[200px] line-clamp-2">
          {title}
        </p>
        <span className="text-xs text-rose-200/60 mt-1 font-light">
          {categoryNameTh || 'ชุดเซ็ทแฟชั่น'}
        </span>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
        <span>● รวมบริการซักแห้งพรีเมียม</span>
        <span className="text-rose-300 font-medium">สอยเก็บทรงฟรี</span>
      </div>
    </div>
  );
};
