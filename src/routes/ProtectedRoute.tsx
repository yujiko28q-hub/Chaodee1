import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserAccount } from '../types/rental';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  currentUser?: UserAccount | null;
  requiredRole?: 'admin' | 'customer';
  fallbackRoute?: () => void;
  onOpenAuth?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentUser: propUser,
  requiredRole,
  fallbackRoute,
  onOpenAuth,
}) => {
  const auth = useAuth();
  const effectiveUser = propUser !== undefined ? propUser : auth.currentUser;
  const isAuthenticated = !!effectiveUser;

  // If requires login but guest
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-stone-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            หน้านี้สงวนสิทธิ์สำหรับสมาชิก SETISTA กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ
          </p>
          <div className="flex flex-col gap-2.5">
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              >
                เข้าสู่ระบบ / สมัครสมาชิก
              </button>
            )}
            {fallbackRoute && (
              <button
                onClick={fallbackRoute}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
              >
                กลับสู่หน้าหลัก
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If specific role required (e.g. admin) but user role doesn't match
  if (requiredRole && effectiveUser?.role !== requiredRole) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-stone-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            ระบบจัดการหลังบ้านสงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น บัญชีปัจจุบัน ({effectiveUser?.email}) ไม่มีสิทธิ์การเข้าถึงส่วนนี้
          </p>
          {fallbackRoute && (
            <button
              onClick={fallbackRoute}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปหน้าเลือกชุด
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
