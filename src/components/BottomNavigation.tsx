import React from 'react';
import { 
  Compass, Sparkles, ShoppingBag, ShieldCheck, User, LayoutDashboard, LogIn 
} from 'lucide-react';
import { UserAccount } from '../types/rental';

export interface BottomNavigationProps {
  currentTab: 'browse' | 'my-rentals' | 'care-policy' | 'guest';
  onNavigateTab: (tab: 'browse' | 'my-rentals' | 'care-policy') => void;
  currentUser: UserAccount | null;
  activeBookingsCount?: number;
  onOpenAuth: () => void;
  onGoToAdmin?: () => void;
  systemMode?: 'storefront' | 'admin';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onNavigateTab,
  currentUser,
  activeBookingsCount = 0,
  onOpenAuth,
  onGoToAdmin,
  systemMode = 'storefront',
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 items-center">
        {/* Tab 1: หน้าหลัก / เลือกชุด */}
        <button
          type="button"
          onClick={() => onNavigateTab('browse')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'browse'
              ? 'text-neutral-950 font-bold bg-stone-100/80 scale-102'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'browse' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className="text-[10px] mt-1 tracking-tight leading-none">
            {currentUser ? 'ค้นหาชุด' : 'คอลเลกชัน'}
          </span>
        </button>

        {/* Tab 2: การเช่าของฉัน / ตู้เสื้อผ้า (with Active Count Badge) */}
        <button
          type="button"
          onClick={() => {
            if (currentUser) {
              onNavigateTab('my-rentals');
            } else {
              onOpenAuth();
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'my-rentals'
              ? 'text-neutral-950 font-bold bg-stone-100/80 scale-102'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentTab === 'my-rentals' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight leading-none">
            ตู้เสื้อผ้า
          </span>
        </button>

        {/* Tab 3: ประกันคราบ & ซักฟรี */}
        <button
          type="button"
          onClick={() => onNavigateTab('care-policy')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'care-policy'
              ? 'text-neutral-950 font-bold bg-stone-100/80 scale-102'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${currentTab === 'care-policy' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className="text-[10px] mt-1 tracking-tight leading-none">
            ประกัน & แคร์
          </span>
        </button>

        {/* Tab 4: โปรไฟล์ / แอดมิน / เข้าสู่ระบบ */}
        {currentUser ? (
          currentUser.role === 'admin' ? (
            <button
              type="button"
              onClick={onGoToAdmin}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-rose-700 hover:text-rose-800 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] mt-1 font-semibold tracking-tight leading-none">
                แอดมิน
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-serif font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight leading-none truncate max-w-[54px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-rose-600 hover:text-rose-700 font-semibold transition-all cursor-pointer"
          >
            <LogIn className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] mt-1 tracking-tight leading-none">
              เข้าสู่ระบบ
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
