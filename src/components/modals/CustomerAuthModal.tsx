import React, { useState } from 'react';
import { UserCheck, Sparkles, X, Heart, ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types/rental';
import { DEMO_ACCOUNTS, verifyAccountCredentials } from '../data/mockAccounts';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomer: UserAccount | null;
  onLoginSuccess: (customer: UserAccount) => void;
  onLogoutCustomer: () => void;
  onOpenAdminLogin: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentCustomer,
  onLoginSuccess,
  onLogoutCustomer,
  onOpenAdminLogin
}) => {
  const [email, setEmail] = useState('customer@setista.com');
  const [pin, setPin] = useState('1234');
  const [customerName, setCustomerName] = useState('คุณพิมพ์ลดา พัฒนกิจ');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [phone, setPhone] = useState('089-112-3456');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (isRegisterMode) {
      if (!customerName.trim()) {
        setError('กรุณาระบุชื่อ-นามสกุล');
        return;
      }
      const newCustomer: UserAccount = {
        id: `usr-cust-${Date.now().toString().slice(-4)}`,
        name: customerName,
        email: email || 'customer@setista.com',
        role: 'customer',
        tier: 'Standard',
        phone: phone || '089-000-0000',
        memberSince: 'วันนี้'
      };
      onLoginSuccess(newCustomer);
      onClose();
      return;
    }

    const result = verifyAccountCredentials(email, pin);
    if (!result.success || !result.account) {
      setError(result.error || 'เข้าสู่ระบบไม่สำเร็จ');
      return;
    }

    if (result.account.role === 'admin') {
      setError('บัญชีนี้เป็นบัญชีแอดมิน กรุณาเข้าสู่ระบบผ่านช่องทาง "เข้าหลังบ้านแอดมิน"');
      return;
    }

    onLoginSuccess(result.account);
    onClose();
  };

  const handleSelectQuickAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    if (acc.role === 'customer') {
      onLoginSuccess(acc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 text-left relative"
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
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>CUSTOMER STOREFRONT PORTAL</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight">
            {currentCustomer ? 'บัญชีลูกค้าของคุณ' : (isRegisterMode ? 'สมัครสมาชิกเช่าชุดใหม่' : 'เข้าสู่ระบบบัญชีลูกค้า')}
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-light leading-relaxed">
            บัญชีสำหรับลูกค้าเลือกดูชุดเซ็ท จองเช่า คำนวณไซส์ และดูตู้เสื้อผ้าที่เช่า (เฉพาะระบบหน้าบ้าน)
          </p>
        </div>

        {/* If already logged in */}
        {currentCustomer && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-950 text-rose-200 flex items-center justify-center font-bold text-lg">
                {currentCustomer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm truncate">{currentCustomer.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {currentCustomer.tier || 'ลูกค้า VIP'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">{currentCustomer.email}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">เบอร์ติดต่อ: {currentCustomer.phone || '-'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>🛡️ สิทธิ์การเข้าถึง:</span>
                <span className="text-neutral-900 bg-amber-200/60 px-2 py-0.5 rounded-md">หน้าบ้านเท่านั้น (Storefront Only)</span>
              </p>
              <p className="text-[11px] text-stone-600">
                บัญชีลูกค้าไม่สามารถเข้าหรือแก้ไขระบบหลังบ้านได้ หากคุณเป็นเจ้าของร้าน กรุณาออกจากระบบลูกค้าและเข้าสู่ระบบด้วยบัญชีแอดมิน
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                เลือกดูชุดเซ็ทต่อที่หน้าร้าน
              </button>

              <button
                type="button"
                onClick={() => {
                  onLogoutCustomer();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 font-medium text-xs transition-colors cursor-pointer"
              >
                ออกจากระบบลูกค้า
              </button>
            </div>
          </div>
        )}

        {/* If not logged in */}
        {!currentCustomer && (
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Customer Switcher */}
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 font-mono">
                ⚡ บัญชีลูกค้าทดสอบ (คลิกเดียวเพื่อเข้าสู่ระบบ):
              </label>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.filter(a => a.role === 'customer').map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectQuickAccount(acc)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 group-hover:text-rose-900">{acc.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{acc.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 group-hover:bg-rose-900 group-hover:text-white transition-colors">
                      เข้าใช้บัญชีนี้
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-stone-400 font-mono">หรือเข้าด้วยตนเอง</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50"
                    placeholder="เช่น คุณพิมพ์ลดา พัฒนกิจ"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  อีเมลลูกค้า
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50"
                  placeholder="customer@setista.com"
                />
              </div>

              {!isRegisterMode && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-700">
                      รหัสผ่าน / PIN
                    </label>
                    <span className="text-[10px] text-stone-400 font-mono">(PIN: 1234)</span>
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 font-mono"
                    placeholder="••••"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-rose-300" />
                  <span>{isRegisterMode ? 'ยืนยันสมัครสมาชิก' : 'เข้าสู่ระบบลูกค้า'}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-rose-700 hover:text-rose-900 font-medium underline cursor-pointer"
                >
                  {isRegisterMode ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิกลูกค้าใหม่'}
                </button>
              </div>
            </form>

            {/* Admin Back-Office Link for Store Staff */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>คุณเป็นเจ้าของร้านหรือแอดมิน?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="font-bold text-neutral-900 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-stone-500" />
                <span>เข้าสู่ระบบหลังบ้านแอดมิน</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
