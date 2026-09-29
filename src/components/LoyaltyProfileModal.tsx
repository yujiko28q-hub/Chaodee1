import React, { useState } from 'react';
import { 
  X, Sparkles, Award, TrendingUp, Gift, ChevronRight, 
  Clock, ShieldCheck, Check, ArrowRight, Star, Heart,
  Flame, HelpCircle, AlertCircle
} from 'lucide-react';
import { UserAccount, LoyaltyTier } from '../types/rental';
import { LOYALTY_TIERS, getTierProgress, getLoyaltyTier, calculatePointsEarned } from '../utils/loyalty';

interface LoyaltyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onExploreItems?: () => void;
}

export const LoyaltyProfileModal: React.FC<LoyaltyProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onExploreItems
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'benefits'>('status');
  const [simAmount, setSimAmount] = useState<number>(1500);

  // Keyboard shortcut: Press Escape to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const points = currentUser.loyaltyPoints ?? 0;
  const currentTier = currentUser.loyaltyTier || getLoyaltyTier(points);
  const tierConfig = LOYALTY_TIERS[currentTier];
  const progress = getTierProgress(points);
  const history = currentUser.pointsHistory || [];

  // Simulated calculations
  const simEarned = calculatePointsEarned(simAmount, currentTier);
  const simMaxDiscount = Math.min(points, simAmount);
  const simPayable = Math.max(0, simAmount - simMaxDiscount);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-left font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left animate-scale-in border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon with Luxury Gradient */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-rose-950 text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Ambient blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider border border-rose-400/30 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>SETISTA REWARDS CLUB</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-rose-200 flex items-center justify-center font-bold text-xl font-serif shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-stone-300 font-mono mt-0.5">
                  {currentUser.email} • สมาชิกตั้งแต่ {currentUser.memberSince || '2024'}
                </p>
              </div>
            </div>

            {/* Current Tier Badge */}
            <div className={`px-4 py-2 rounded-2xl border ${tierConfig.borderColor} ${tierConfig.badgeBg} flex items-center gap-2 self-start sm:self-auto shadow-sm`}>
              <span className="text-base">{tierConfig.icon}</span>
              <div>
                <span className={`text-xs font-bold ${tierConfig.badgeText} block font-serif`}>
                  {tierConfig.nameTh}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  คูณแต้ม {tierConfig.multiplier}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-5 sm:px-6 gap-2 pt-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white border-t border-x border-stone-200 text-neutral-950 font-bold -mb-px'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            ภาพรวมสถานะ & ความคืบหน้า
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white border-t border-x border-stone-200 text-neutral-950 font-bold -mb-px'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            <span>ประวัติการได้/ใช้คะแนน</span>
            {history.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-[10px] font-mono">
                {history.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`py-2.5 px-3 rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'benefits'
                ? 'bg-white border-t border-x border-stone-200 text-neutral-950 font-bold -mb-px'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            สิทธิประโยชน์ตามระดับ
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-neutral-800 flex-1">
          
          {/* TAB 1: STATUS & TIER PROGRESS */}
          {activeTab === 'status' && (
            <div className="space-y-5 animate-fade-in">
              {/* Points Card */}
              <div className="p-5 rounded-3xl bg-neutral-950 text-white relative overflow-hidden shadow-md">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-900/30 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-mono block">
                      คะแนนสะสมคงเหลือ (Available Balance)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-white font-mono">
                        {points.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-300 font-mono">
                        คะแนน (= ฿{points.toLocaleString()})
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-200/80 mt-1">
                      💡 สามารถใช้เป็นส่วนลดเงินสดได้ทันทีในหน้าชำระเงิน (1 คะแนน = ฿1)
                    </p>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-3 text-right shrink-0">
                    <span className="text-[10px] text-stone-400 block font-mono">คะแนนสะสมตลอดชีพ</span>
                    <span className="text-base font-bold font-mono text-stone-100">
                      {(currentUser.lifetimePoints || points).toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Tier Progress Tracker */}
                <div className="mt-5 pt-4 border-t border-white/10 relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>สถานะระดับสมาชิก: {tierConfig.nameTh}</span>
                    </span>
                    <span className="text-rose-200 font-mono text-[11px]">
                      {progress.label}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-400 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  {/* Milestone Indicators */}
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono pt-1">
                    <span className={currentTier === 'Silver' ? 'text-white font-bold' : ''}>
                      Silver (0 pt)
                    </span>
                    <span className={currentTier === 'Gold' ? 'text-amber-300 font-bold' : ''}>
                      Gold (500 pts)
                    </span>
                    <span className={currentTier === 'Platinum' ? 'text-rose-300 font-bold' : ''}>
                      Platinum VIP (1,500 pts)
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Tier Perks Quick Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>สิทธิพิเศษที่คุณได้รับในระดับ {tierConfig.nameTh}</span>
                  </h4>
                  <span className="text-[10px] text-rose-800 font-semibold font-mono">
                    ตัวคูณคะแนน {tierConfig.multiplier}x
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {tierConfig.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white border border-stone-200/80">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="text-stone-700 text-[11px] leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Earn More Points */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2.5">
                <h4 className="font-serif text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>วิธีสะสมคะแนนเพิ่มเพื่ออัปเกรดระดับสมาชิก</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/60 text-center">
                    <span className="text-base block mb-0.5">👗</span>
                    <strong className="block text-neutral-900 text-xs">เช่าชุดทุกรุ่น</strong>
                    <span className="text-[10px] text-stone-500 font-light block mt-0.5">
                      รับ 1 คะแนน ทุก ฿10 ของค่าเช่า
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/60 text-center">
                    <span className="text-base block mb-0.5">⭐</span>
                    <strong className="block text-neutral-900 text-xs">รีวิวชุด 5 ดาว</strong>
                    <span className="text-[10px] text-stone-500 font-light block mt-0.5">
                      รับโบนัสพิเศษ +50 คะแนน ทันที
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/60 text-center">
                    <span className="text-base block mb-0.5">👑</span>
                    <strong className="block text-neutral-900 text-xs">เลื่อนระดับสมาชิก</strong>
                    <span className="text-[10px] text-stone-500 font-light block mt-0.5">
                      รับสิทธิ์แต้มคูณสูงสุดถึง 1.5x
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Points & Discount Calculator Widget */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧮</span>
                    <div>
                      <h4 className="font-serif text-xs font-bold text-neutral-900">
                        เครื่องคำนวณแต้มสะสม & ส่วนลดเงินสด (Live Calculator)
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        จำลองยอดเช่าเพื่อดูคะแนนที่จะได้รับและส่วนลดที่ใช้ได้ทันที
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    {tierConfig.nameTh} ({tierConfig.multiplier}x)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-stone-700 block mb-1">
                      กำหนดยอดเช่าชุดที่สนใจ (บาท):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-mono text-xs">฿</span>
                      <input
                        type="number"
                        min={100}
                        step={100}
                        value={simAmount}
                        onChange={(e) => setSimAmount(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-neutral-900 focus:outline-rose-900"
                      />
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                      {[990, 1500, 2500, 3900].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSimAmount(amt)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            simAmount === amt
                              ? 'bg-amber-900 text-white font-bold'
                              : 'bg-white border-amber-200 text-stone-600 hover:bg-amber-100/50'
                          }`}
                        >
                          ฿{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>✨ คะแนนที่จะได้รับ:</span>
                      <span className="font-mono font-bold text-sm">+{simEarned} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-900">
                      <span>👑 ใช้คะแนนที่มีลดได้:</span>
                      <span className="font-mono font-bold">-฿{simMaxDiscount.toLocaleString()}</span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-100 flex justify-between items-center font-bold text-neutral-950">
                      <span>ยอดจ่ายจริงเหลือ:</span>
                      <span className="font-mono text-base text-rose-950">฿{simPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POINTS TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-neutral-900">
                    สมุดบัญชีประวัติคะแนนสะสม (Points Ledger)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    บันทึกรายการได้รับคะแนนจากการเช่าชุด รีวิว และการใช้คะแนนเป็นส่วนลด
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-neutral-900 bg-stone-100 px-3 py-1 rounded-xl">
                  ยอดคงเหลือ: {points.toLocaleString()} pts
                </span>
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <Clock className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-800">ยังไม่มีรายการประวัติคะแนน</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    เมื่อคุณเช่าชุดหรือรีวิว รายการคะแนนจะแสดงที่นี่โดยอัตโนมัติค่ะ
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-2xs">
                  {history.map((tx) => {
                    const isPositive = tx.points > 0;

                    return (
                      <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isPositive ? '+' : '-'}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 truncate text-xs">
                              {tx.description}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400 font-mono">
                              <span>{tx.date}</span>
                              {tx.bookingId && (
                                <>
                                  <span>•</span>
                                  <span>ออเดอร์: {tx.bookingId}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono font-bold text-xs ${
                            isPositive ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {isPositive ? `+${tx.points}` : tx.points} pts
                          </span>
                          <span className="block text-[10px] text-stone-400 font-mono">
                            คงเหลือ {tx.balanceAfter} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TIER COMPARISON & BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif text-sm font-bold text-neutral-900">
                  สิทธิพิเศษตามระดับสมาชิก SETISTA Club
                </h4>
                <p className="text-[11px] text-stone-500">
                  สะสมคะแนนจากการเช่าเพื่อปลดล็อกสิทธิประโยชน์สุดเอ็กซ์คลูซีฟ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['Silver', 'Gold', 'Platinum'] as LoyaltyTier[]).map((tierKey) => {
                  const t = LOYALTY_TIERS[tierKey];
                  const isCurrent = currentTier === tierKey;

                  return (
                    <div 
                      key={tierKey}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isCurrent 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-600/20 shadow-xs' 
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">{t.icon}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-900 text-white text-[9px] font-bold">
                              ระดับปัจจุบันของคุณ
                            </span>
                          )}
                        </div>

                        <h5 className="font-serif text-sm font-bold text-neutral-900">
                          {t.nameTh}
                        </h5>
                        <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {t.maxPoints === Infinity ? '1,500+ คะแนน' : `${t.minPoints} - ${t.maxPoints} คะแนน`}
                        </p>

                        <div className="my-3 py-1 px-2.5 rounded-lg bg-stone-100 text-stone-800 text-[10px] font-mono font-semibold">
                          ⚡ ตัวคูณคะแนนสะสม {t.multiplier}x
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-stone-600">
                          {t.perks.map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            1 คะแนน = ฿1 ส่วนลดเงินสดในการเช่าชุดทุกชุด
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-neutral-900 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>

            {onExploreItems && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreItems();
                }}
                className="px-5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>ไปเลือกเช่าชุดเพื่อใช้คะแนน</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
