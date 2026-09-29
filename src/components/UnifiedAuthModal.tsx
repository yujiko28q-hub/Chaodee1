import React, { useState } from 'react';
import { UserCheck, X, Heart, ShieldCheck, Mail, Lock, ArrowRight, LayoutDashboard, KeyRound, Sparkles, AlertCircle, Award, Gift, ChevronRight } from 'lucide-react';
import { UserAccount } from '../types/rental';
import { verifyAccountCredentials } from '../data/mockAccounts';
import { LOYALTY_TIERS, getTierProgress, getLoyaltyTier } from '../utils/loyalty';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (account: UserAccount) => void;
  onLogout: () => void;
  onOpenLoyaltyModal?: () => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenLoyaltyModal
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const result = verifyAccountCredentials(email, passwordOrPin);
    if (!result.success || !result.account) {
      setError(result.error || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง กรุณาตรวจสอบอีเมลและรหัสผ่าน');
      return;
    }

    onLoginSuccess(result.account);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('กรุณาระบุชื่อ-นามสกุล');
      return;
    }

    if (!email.trim()) {
      setError('กรุณาระบุอีเมล');
      return;
    }

    const newCustomer: UserAccount = {
      id: `usr-cust-${Date.now().toString().slice(-6)}`,
      name: regName.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer',
      tier: 'Standard',
      loyaltyTier: 'Silver',
      loyaltyPoints: 0,
      lifetimePoints: 0,
      pointsHistory: [],
      phone: regPhone.trim() || '089-000-0000',
      memberSince: 'วันนี้'
    };

    onLoginSuccess(newCustomer);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-fade-in text-left"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2 border border-rose-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>SETISTA ACCOUNT PORTAL</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight">
            {currentUser ? 'ข้อมูลบัญชีผู้ใช้' : 'เข้าสู่ระบบ'}
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-light leading-relaxed">
            {currentUser ? 'จัดการข้อมูลบัญชีและตรวจสอบสถานะของคุณ' : 'เข้าสู่ระบบเพื่อจัดการการเช่าชุดและสะสมคะแนน'}
          </p>
        </div>

        {/* Current User Logged In State */}
        {currentUser ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                currentUser.role === 'admin' ? 'bg-neutral-950 text-rose-300' : 'bg-rose-100 text-rose-900'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm truncate">{currentUser.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-900 text-rose-200'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentUser.role === 'admin' ? 'แอดมิน' : 'ลูกค้า'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">{currentUser.email}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  สมาชิกตั้งแต่: {currentUser.memberSince || '2024'}
                </p>
              </div>
            </div>

            {/* CUSTOMER LOYALTY STATUS TRACKER CARD */}
            {currentUser.role === 'customer' && (() => {
              const pts = currentUser.loyaltyPoints ?? 0;
              const tier = currentUser.loyaltyTier || getLoyaltyTier(pts);
              const tierCfg = LOYALTY_TIERS[tier];
              const prog = getTierProgress(pts);

              return (
                <div className="p-4 rounded-2xl bg-neutral-950 text-white space-y-3 relative overflow-hidden shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tierCfg.icon}</span>
                      <div>
                        <span className="font-serif font-bold text-xs text-white block">
                          {tierCfg.nameTh}
                        </span>
                        <span className="text-[10px] text-rose-300 font-mono">
                          คูณคะแนน {tierCfg.multiplier}x
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-mono">คะแนนสะสม</span>
                      <span className="text-lg font-bold font-mono text-white leading-tight">
                        {pts.toLocaleString()} pts
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-stone-300 font-mono">
                      <span>ความคืบหน้าสะสม</span>
                      <span className="text-rose-300">{prog.label}</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${prog.percent}%` }}
                      />
                    </div>
                  </div>

                  {onOpenLoyaltyModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenLoyaltyModal();
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-rose-200 border border-white/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                      <span>ดูสมุดบัญชีคะแนน & สิทธิประโยชน์เต็ม</span>
                      <ChevronRight className="w-3 h-3 text-rose-300" />
                    </button>
                  )}
                </div>
              );
            })()}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                ดูบริการและเลือกเช่าชุดต่อ
              </button>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 font-medium text-xs transition-colors cursor-pointer"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        ) : (
          /* Login Form (When not logged in) */
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Navigation Tabs inside modal */}
            <div className="flex border-b border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors ${
                  activeTab === 'login' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError(null);
                }}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors ${
                  activeTab === 'register' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleManualLogin} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-rose-800 transition-colors"
                    placeholder="กรอกอีเมลของคุณ (เช่น name@example.com)"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      รหัสผ่าน
                    </label>
                  </div>
                  <input
                    type="password"
                    value={passwordOrPin}
                    onChange={(e) => setPasswordOrPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 font-mono focus:bg-white focus:outline-rose-800 transition-colors"
                    placeholder="กรอกรหัสผ่านของคุณ"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-rose-300" />
                    <span>เข้าสู่ระบบ</span>
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setError(null);
                    }}
                    className="text-xs text-stone-600 hover:text-neutral-900 cursor-pointer"
                  >
                    ยังไม่มีบัญชีผู้ใช้? <span className="font-bold text-neutral-950 underline">สมัครสมาชิก</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-rose-800 transition-colors"
                    placeholder="เช่น คุณณิชาดา สุขใจ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-rose-800 transition-colors"
                    placeholder="your-email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-rose-800 transition-colors"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-rose-300" />
                    <span>สร้างบัญชีผู้ใช้</span>
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError(null);
                    }}
                    className="text-xs text-stone-600 hover:text-neutral-900 cursor-pointer"
                  >
                    มีบัญชีอยู่แล้ว? <span className="font-bold text-neutral-950 underline">เข้าสู่ระบบที่นี่</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
