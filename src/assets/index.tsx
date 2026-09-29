import React from 'react';

/**
 * SETISTA Brand Assets & SVG Icons
 */

export const SetistaLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-xl bg-stone-900 text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs ${className}`}>
    S
  </div>
);

export const SetistaFullBrand: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <SetistaLogo />
    <span className="font-serif text-xl tracking-widest font-extrabold uppercase text-stone-900">
      SETISTA
    </span>
  </div>
);
