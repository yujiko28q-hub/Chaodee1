import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { StepByStepGuide } from './StepByStepGuide';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExplore?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 max-sm:p-0 max-sm:items-end bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl max-sm:rounded-b-none max-sm:rounded-t-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile Pull Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                คู่มือการใช้งาน SETISTA
              </h3>
              <p className="text-[11px] text-stone-500 font-light">
                วิธีการเช่าชุด การฟิตติ้ง และระบบคุ้มครองมัดจำปลอดภัย
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <StepByStepGuide
            className="border-0 p-0 shadow-none"
            onStartExplore={() => {
              onClose();
              onStartExplore?.();
            }}
          />

          {/* Safe & Clean Guarantee Notice */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-stone-900 block">รับประกันความสะอาด & ความแท้ 100%</strong>
                <span className="text-stone-500 font-light">
                  ชุดทุกชุดผ่านการฆ่าเชื้อด้วยโอโซน และมีสัญญาเช่าดิจิทัลคุ้มครองทั้งสองฝ่าย
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartExplore?.();
              }}
              className="px-4 py-2 rounded-xl bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer shrink-0 self-stretch sm:self-auto text-center"
            >
              เข้าใจแล้ว เริ่มเลือกชุด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
