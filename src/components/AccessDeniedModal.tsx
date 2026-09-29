import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types/rental';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomer: UserAccount | null;
  onSwitchToAdminLogin: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  currentCustomer,
  onSwitchToAdminLogin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-200 text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Security Warning Header */}
        <div className="bg-rose-950 text-white p-6 sm:p-7 relative border-b border-rose-900/50">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2 border border-rose-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>403 FORBIDDEN · ACCESS DENIED</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                ไม่มีสิทธิ์เข้าถึงระบบหลังบ้าน
              </h2>
              <p className="text-xs text-rose-200/80 font-light mt-0.5">
                สองระบบถูกแยกออกจากกันอย่างเด็ดขาด
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-4">
          {/* Current Account Information */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">บัญชีที่คุณใช้อยู่ปัจจุบัน:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                บัญชีลูกค้าทั่วไป
              </span>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm">
                {currentCustomer?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 leading-tight">
                  {currentCustomer?.name || 'ลูกค้าทั่วไป (Customer)'}
                </p>
                <p className="text-xs text-stone-500 font-mono">
                  {currentCustomer?.email || 'customer@setista.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice Message */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 space-y-2 leading-relaxed">
            <p className="font-semibold text-rose-900 flex items-center gap-1.5">
              <span>🔒 กฎความปลอดภัยของระบบ:</span>
            </p>
            <ul className="space-y-1.5 text-stone-600 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span><strong>ระบบหน้าบ้าน (Storefront):</strong> สำหรับลูกค้าเลือกดูแบบชุด คำนวณไซส์ จองเช่า และติดตามตู้เสื้อผ้า</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span><strong>ระบบหลังบ้าน (Admin Back-Office):</strong> สงวนสิทธิ์เฉพาะ <strong>"บัญชีแอดมิน"</strong> เพื่อแก้ไขชุด ปรับราคา และอนุมัติคำสั่งเช่า</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToAdminLogin();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-rose-300" />
              <span>สลับไปเข้าสู่ระบบด้วย "บัญชีแอดมิน"</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าร้านเพื่อเลือกเช่าชุดตามปกติ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
