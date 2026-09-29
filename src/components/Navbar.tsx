import React, { useState } from 'react';
import { Ruler, ShieldCheck, Heart, LayoutDashboard, User, LogOut, ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { UserAccount } from '../types/rental';

interface NavbarProps {
  currentCustomerTab: 'browse' | 'my-rentals' | 'care-policy';
  setCurrentCustomerTab: (tab: 'browse' | 'my-rentals' | 'care-policy') => void;
  onOpenSizeGuide: () => void;
  onOpenOnboarding?: () => void;
  activeBookingsCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenLoyaltyModal?: () => void;
  onGoToAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCustomerTab,
  setCurrentCustomerTab,
  onOpenSizeGuide,
  onOpenOnboarding,
  activeBookingsCount,
  currentUser,
  onOpenAuth,
  onOpenLoyaltyModal,
  onGoToAdmin,
  onLogout
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentCustomerTab('browse')}
            className="text-left flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-neutral-950 text-rose-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              S
            </span>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 block leading-none">
                SETISTA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-stone-500 block mt-0.5">
                Women's Set Rental Boutique
              </span>
            </div>
          </button>
        </div>

        {/* NAVIGATION: Changes dynamically based on whether user is logged in */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600">
          {currentUser ? (
            /* Logged in navigation (Full Services) */
            <>
              <button
                onClick={() => setCurrentCustomerTab('browse')}
                className={`transition-colors hover:text-neutral-950 cursor-pointer ${
                  currentCustomerTab === 'browse' ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-0.5' : ''
                }`}
              >
                คอลเลกชันชุดเซ็ททั้งหมด
              </button>

              <button
                onClick={onOpenSizeGuide}
                className="flex items-center gap-1.5 transition-colors text-rose-800 hover:text-rose-950 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>คำนวณไซส์ อก-เอว</span>
              </button>

              <button
                onClick={() => setCurrentCustomerTab('my-rentals')}
                className={`flex items-center gap-1.5 transition-colors hover:text-neutral-950 cursor-pointer ${
                  currentCustomerTab === 'my-rentals' ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-0.5' : ''
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-stone-400" />
                <span>ตู้เสื้อผ้าที่ฉันเช่า</span>
                {activeBookingsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] font-mono flex items-center justify-center">
                    {activeBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentCustomerTab('care-policy')}
                className={`flex items-center gap-1.5 transition-colors hover:text-neutral-950 cursor-pointer ${
                  currentCustomerTab === 'care-policy' ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 pb-0.5' : ''
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ซักแห้งฟรี & ประกันคราบ</span>
              </button>

              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="flex items-center gap-1.5 transition-colors text-stone-600 hover:text-neutral-950 font-medium cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span>ขั้นตอนการเช่า</span>
                </button>
              )}
            </>
          ) : (
            /* NOT LOGGED IN NAVIGATION (Guest sees only recommended showcase) */
            <>
              <a
                href="#recommended-sets"
                className="flex items-center gap-1.5 text-neutral-900 font-bold hover:text-rose-900 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>ชุดเซ็ทแนะนำประจำสัปดาห์</span>
              </a>

              <button
                onClick={onOpenSizeGuide}
                className="flex items-center gap-1.5 transition-colors text-rose-800 hover:text-rose-950 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>คำนวณไซส์ อก-เอว</span>
              </button>

              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="flex items-center gap-1.5 transition-colors text-stone-600 hover:text-neutral-950 font-medium cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span>วิธีเช่า 4 ขั้นตอน</span>
                </button>
              )}

              <button
                onClick={() => setCurrentCustomerTab('care-policy')}
                className="flex items-center gap-1.5 transition-colors hover:text-neutral-950 cursor-pointer text-stone-600"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ซักแห้งฟรี & ประกันคราบ</span>
              </button>
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* USER ACCOUNT BADGE / SIGN IN BUTTON */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-neutral-900 text-rose-200 border-neutral-800'
                    : 'bg-stone-50 text-neutral-800 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentUser.role === 'admin' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[110px] truncate font-semibold">
                  {currentUser.name}
                </span>

                {currentUser.role === 'customer' ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold flex items-center gap-1 border border-amber-200 shadow-3xs">
                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                    <span>{(currentUser.loyaltyPoints ?? 0).toLocaleString()} pts</span>
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-rose-900/60 text-rose-300">
                    แอดมิน
                  </span>
                )}

                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-left animate-fade-in"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div className="p-2.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-neutral-900">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-[10px] text-stone-600">
                      <span>สถานะ:</span>
                      <strong className={currentUser.role === 'admin' ? 'text-rose-700' : 'text-neutral-800'}>
                        {currentUser.role === 'admin' ? '👔 บัญชีแอดมิน (จัดการหลังบ้าน)' : `🛍️ ลูกค้า (${currentUser.loyaltyTier || 'Silver'} Member)`}
                      </strong>
                    </div>
                  </div>

                  <div className="py-1">
                    {/* CUSTOMER ONLY sees customer services */}
                    {currentUser.role === 'customer' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenLoyaltyModal) onOpenLoyaltyModal();
                            else onOpenAuth();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-900 hover:bg-rose-50 rounded-lg flex items-center justify-between cursor-pointer font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                            <span>คะแนนสะสม & สถานะสมาชิก</span>
                          </div>
                          <span className="font-mono font-bold text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                            {(currentUser.loyaltyPoints ?? 0).toLocaleString()} pts
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCustomerTab('my-rentals');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-stone-50 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 text-stone-400" />
                          <span>ตู้เสื้อผ้าและประวัติการเช่า</span>
                        </button>
                      </>
                    )}

                    {/* ONLY ADMIN sees backoffice entry */}
                    {currentUser.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          onGoToAdmin();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-neutral-900 font-bold hover:bg-rose-50 hover:text-rose-900 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-rose-700" />
                        <span>เปิดแผงควบคุมหลังบ้าน (Admin Console)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuth();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-stone-50 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>สลับบัญชีผู้ใช้</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Clear Sign In Button when NOT logged in */
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-rose-300" />
              <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
            </button>
          )}

          {/* ADMIN ONLY BUTTON: ONLY visible when logged in as Admin! */}
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={onGoToAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs bg-neutral-950 hover:bg-neutral-800 text-white"
              title="เปิดแผงควบคุมหลังบ้านสำหรับแอดมิน"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">แผงหลังบ้าน (Admin)</span>
            </button>
          )}

          {/* Customer Wardrobe Button (Only shown when customer is logged in) */}
          {currentUser && (
            <button
              type="button"
              onClick={() => setCurrentCustomerTab('my-rentals')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-neutral-900 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer border border-rose-200/60 whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span className="hidden sm:inline">ชุดที่ฉันเช่า</span>
              <span>({activeBookingsCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="lg:hidden flex items-center justify-around border-t border-stone-100 bg-stone-50 px-2 py-2 text-[11px] font-medium text-neutral-600">
        {currentUser ? (
          <>
            <button
              onClick={() => setCurrentCustomerTab('browse')}
              className={`py-1 px-2.5 rounded-md ${currentCustomerTab === 'browse' ? 'bg-white text-neutral-950 shadow-xs font-bold' : ''}`}
            >
              แคตตาล็อกชุด
            </button>
            <button
              onClick={onOpenSizeGuide}
              className="py-1 px-2.5 rounded-md text-rose-800 font-semibold"
            >
              คำนวณไซส์
            </button>
            <button
              onClick={() => setCurrentCustomerTab('my-rentals')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${currentCustomerTab === 'my-rentals' ? 'bg-white text-neutral-950 shadow-xs font-bold' : ''}`}
            >
              <span>ชุดที่ฉันเช่า</span>
              {activeBookingsCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentCustomerTab('care-policy')}
              className={`py-1 px-2.5 rounded-md ${currentCustomerTab === 'care-policy' ? 'bg-white text-neutral-950 shadow-xs font-bold' : ''}`}
            >
              ซักแห้งฟรี
            </button>
            {onOpenLoyaltyModal && (
              <button
                onClick={onOpenLoyaltyModal}
                className="py-1 px-2 rounded-md text-amber-900 font-bold flex items-center gap-1 bg-amber-50 border border-amber-200"
                title="ดูคะแนนสะสมและสถานะสมาชิก"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{(currentUser.loyaltyPoints ?? 0).toLocaleString()} pts</span>
              </button>
            )}
          </>
        ) : (
          <>
            <a
              href="#recommended-sets"
              className="py-1 px-2.5 rounded-md text-neutral-900 font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-rose-600" />
              <span>ชุดแนะนำ</span>
            </a>
            <button
              onClick={onOpenSizeGuide}
              className="py-1 px-2.5 rounded-md text-rose-800 font-semibold"
            >
              คำนวณไซส์
            </button>
            <button
              onClick={() => setCurrentCustomerTab('care-policy')}
              className="py-1 px-2.5 rounded-md text-stone-600"
            >
              ซักแห้งฟรี
            </button>
            <button
              onClick={onOpenAuth}
              className="py-1 px-2.5 rounded-md bg-neutral-900 text-white font-bold"
            >
              เข้าสู่ระบบ
            </button>
          </>
        )}

        {/* ONLY ADMIN sees this on mobile */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={onGoToAdmin}
            className="py-1 px-2 rounded-md text-rose-700 font-bold flex items-center gap-1"
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>หลังบ้าน</span>
          </button>
        )}
      </div>
    </header>
  );
};
