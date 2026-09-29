import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, X, Sparkles, UserCheck, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { UserAccount } from '../types/rental';
import { DEMO_ACCOUNTS, verifyAccountCredentials } from '../data/mockAccounts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminAccount: UserAccount) => void;
  onOpenCustomerModal?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenCustomerModal
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('admin@setista.com');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const result = verifyAccountCredentials(emailOrUsername, pin);
    if (!result.success || !result.account) {
      setError(result.error || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
      return;
    }

    // STRICT CHECK: ONLY ADMIN CAN ENTER BACKOFFICE
    if (result.account.role !== 'admin') {
      setError(`⛔ ปฏิเสธการเข้าสู่ระบบ: บัญชี "${result.account.name}" เป็นประเภท [ลูกค้าทั่วไป] ไม่มีสิทธิ์เข้าถึงระบบหลังบ้านสำหรับแอดมิน! กรุณาใช้บัญชีแอดมิน`);
      return;
    }

    onLoginSuccess(result.account);
    onClose();
  };

  const handleQuickAdminLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    if (account.role === 'admin') {
      setError(null);
      onLoginSuccess(account);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-stone-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2 border border-rose-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>ADMIN SECURITY GATEWAY</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight">
            เข้าสู่ระบบหลังบ้านสำหรับแอดมิน
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-light leading-relaxed">
            พื้นที่เฉพาะเจ้าของร้านและแอดมิน สำหรับลงชุดใหม่ แก้ไขราคา อนุมัติคำสั่งเช่า และจัดการข้อมูลหลังบ้าน
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 sm:p-7 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Quick 1-Click Admin Demo Login */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 font-mono">
              ⚡ บัญชีแอดมินสำหรับทดสอบ (คลิกเพื่อเข้าสู่ระบบ):
            </label>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.filter(a => a.role === 'admin').map(admin => (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => handleQuickAdminLogin(admin)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-neutral-900 hover:bg-stone-50 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-rose-300 flex items-center justify-center font-bold text-xs">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-rose-900">
                        {admin.name}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {admin.email} · {admin.adminTitle?.split('&')[0]}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    เข้าสู่ระบบ
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-stone-400 font-mono">หรือกรอกบัญชีด้วยตนเอง</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
              อีเมลแอดมิน / Username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-neutral-900 bg-stone-50"
              placeholder="admin@setista.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                รหัสผ่าน / PIN แอดมิน
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                (PIN: 1234)
              </span>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-mono tracking-widest bg-stone-50"
              placeholder="••••"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-rose-300" />
              <span>เข้าสู่แผงควบคุมหลังบ้าน (Admin Console)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Customer Redirection */}
          <div className="pt-2 text-center border-t border-stone-100">
            <p className="text-[11px] text-stone-500">
              🛍️ หากคุณเป็นลูกค้าทั่วไปที่ต้องการเช่าชุด{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCustomerModal) onOpenCustomerModal();
                }}
                className="text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer inline"
              >
                เข้าสู่ระบบลูกค้าที่นี่
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
