import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export interface VerifiedBadgeProps {
  label?: string;
  showText?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  label = 'ยืนยันตัวตนแล้ว',
  showText = false,
  size = 'md',
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
    >
      <span
        className={`inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium select-none cursor-pointer transition-colors hover:bg-emerald-100/80 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
        title="ร้านค้า / เจ้าของชุดที่ผ่านการตรวจสอบตัวตนแล้ว"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
        {showText && <span>{label}</span>}
      </span>

      {/* Trust Signal Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-neutral-900 text-white text-[11px] rounded-xl shadow-xl z-50 pointer-events-none animate-fade-in border border-stone-800 text-left">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SETISTA Verified Partner</span>
          </div>
          <p className="text-stone-300 leading-tight">
            ผู้ให้เช่าผ่านการตรวจสอบบัตรประชาชน และชุดทุกชุดผ่านการตรวจสภาพรอยเย็บและเนื้อผ้า 100%
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
};
