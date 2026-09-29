import React from 'react';
import { Store, LayoutDashboard, Sparkles, ArrowRight, User, Shirt, CheckCircle } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentRole: 'customer' | 'owner';
  onSwitchRole: (role: 'customer' | 'owner') => void;
  pendingOrdersCount: number;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSwitchRole,
  pendingOrdersCount
}) => {
  return (
    <div className="bg-neutral-950 text-stone-200 border-b border-stone-800 py-2.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Role Indicator Description */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
              ระบบแยกบทบาท:
            </span>
          </div>

          {currentRole === 'owner' ? (
            <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full text-rose-200">
              <Shirt className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-semibold text-xs">
                โหมดเจ้าของร้าน (ลงเสื้อผ้าเอง & จัดการออเดอร์เช่า)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-stone-800/80 border border-stone-700 px-3 py-1 rounded-full text-stone-100">
              <Store className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-semibold text-xs">
                โหมดลูกค้า (เข้ามาเลือกดูชุด & กดเช่าชุดเซ็ท)
              </span>
            </div>
          )}
        </div>

        {/* Right: Explicit Segmented Switcher Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-400 hidden lg:inline">
            คลิกสลับหน้าจอ:
          </span>
          <div className="flex items-center p-1 bg-stone-900 rounded-xl border border-stone-800 shadow-inner">
            <button
              type="button"
              onClick={() => onSwitchRole('customer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'customer'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>🛍️ ลูกค้ามาเลือกเช่า</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchRole('owner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentRole === 'owner'
                  ? 'bg-white text-neutral-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>👩‍💼 เจ้าของร้านลงชุดเอง</span>
              {pendingOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
