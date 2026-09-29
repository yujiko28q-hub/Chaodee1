import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WomenSetItem, SetBooking, OccasionCategory, ApparelSize, UserAccount, SetReview, LoyaltyPointTransaction } from './types/rental';
import { INITIAL_SET_ITEMS, INITIAL_MY_BOOKINGS, MOCK_SET_REVIEWS } from './data/mockRentals';

// Architectural Layer 1: Page Views (src/pages/)
import { 
  GuestRecommendedPage, 
  StorefrontPage, 
  MyRentalsPage, 
  AdminBackofficePage, 
  CarePolicyPage 
} from './pages';

// Architectural Layer 2: Routing & Guards (src/routes/)
import { ProtectedRoute } from './routes';

// Architectural Layer 3: Reusable UI & Modal Components (src/components/)
import {
  Navbar,
  Footer,
  RentalDetailModal,
  CreateListingModal,
  UnifiedAuthModal,
  ChatModal,
  RentalAgreementModal,
  SizeGuideModal,
  ReviewModal,
  LoyaltyProfileModal,
  Toast,
  BottomNavigation,
  OnboardingModal,
} from './components';

// Architectural Layer 4: Services & Utilities (src/services/ & src/utils/)
import { calculatePointsEarned, getLoyaltyTier } from './utils/loyalty';
import { StorageKeys, getStorageItem, setStorageItem, removeStorageItem } from './services/apiClient';

import { 
  CheckCircle2, LayoutDashboard, PlusCircle, X
} from 'lucide-react';

export default function App() {
  // Current Logged-in User Account: Admin vs Customer vs Guest (null)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
  });

  // System Mode: 'storefront' (หน้าบ้าน) vs 'admin' (หลังบ้านแอดมิน)
  const [systemMode, setSystemMode] = useState<'storefront' | 'admin'>(() => {
    const savedUser = getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
    const savedMode = getStorageItem<'storefront' | 'admin'>(StorageKeys.SYSTEM_MODE, 'storefront');
    if (savedUser?.role === 'admin' && savedMode === 'admin') {
      return 'admin';
    }
    return 'storefront';
  });

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Onboarding / How It Works Modal State
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Customer sub-navigation tab (Browse / My Rentals / Care Policy)
  const [customerTab, setCustomerTab] = useState<'browse' | 'my-rentals' | 'care-policy'>('browse');

  // Clothes and Outfits (The listings)
  const [items, setItems] = useState<WomenSetItem[]>(() => {
    return getStorageItem<WomenSetItem[]>(StorageKeys.ITEMS, INITIAL_SET_ITEMS);
  });

  // Rental Bookings
  const [bookings, setBookings] = useState<SetBooking[]>(() => {
    return getStorageItem<SetBooking[]>(StorageKeys.BOOKINGS, INITIAL_MY_BOOKINGS);
  });

  // Reviews Map State: Item ID -> SetReview[]
  const [reviewsMap, setReviewsMap] = useState<Record<string, SetReview[]>>(() => {
    return getStorageItem<Record<string, SetReview[]>>(StorageKeys.REVIEWS, MOCK_SET_REVIEWS);
  });

  // Local storage synchronization
  useEffect(() => {
    setStorageItem(StorageKeys.SYSTEM_MODE, systemMode);
  }, [systemMode]);

  useEffect(() => {
    if (currentUser) {
      setStorageItem(StorageKeys.CURRENT_USER, currentUser);
    } else {
      removeStorageItem(StorageKeys.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    setStorageItem(StorageKeys.ITEMS, items);
  }, [items]);

  useEffect(() => {
    setStorageItem(StorageKeys.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    setStorageItem(StorageKeys.REVIEWS, reviewsMap);
  }, [reviewsMap]);

  // Search & Filter State for Customer Storefront
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OccasionCategory>('all');
  const [selectedSize, setSelectedSize] = useState<ApparelSize | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<WomenSetItem | null>(null);
  const [selectedItemForChat, setSelectedItemForChat] = useState<WomenSetItem | null>(null);
  const [contractData, setContractData] = useState<{ item: WomenSetItem; days: number; startDate: string; endDate: string; size: ApparelSize } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<WomenSetItem | null>(null);
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{ booking: SetBooking; item: WomenSetItem } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Lock body scroll when any modal is open
  const isAnyModalOpen = Boolean(
    selectedItemForDetail ||
    showAuthModal ||
    showLoyaltyModal ||
    reviewModalData ||
    selectedItemForChat ||
    contractData ||
    showSizeGuideModal ||
    showCreateModal
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  // Keyboard shortcut: Press Escape to close whichever modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showOnboardingModal) setShowOnboardingModal(false);
        else if (showLoyaltyModal) setShowLoyaltyModal(false);
        else if (reviewModalData) setReviewModalData(null);
        else if (selectedItemForDetail) setSelectedItemForDetail(null);
        else if (selectedItemForChat) setSelectedItemForChat(null);
        else if (contractData) setContractData(null);
        else if (showSizeGuideModal) setShowSizeGuideModal(false);
        else if (showAuthModal) setShowAuthModal(false);
        else if (showCreateModal) {
          setShowCreateModal(false);
          setItemToEdit(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOnboardingModal, showLoyaltyModal, reviewModalData, selectedItemForDetail, selectedItemForChat, contractData, showSizeGuideModal, showAuthModal, showCreateModal]);

  // Filtered items computation for Customer Storefront
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedSize !== 'all' && !item.availableSizes.includes(selectedSize)) return false;
        if (onlyAvailable && !item.isAvailable) return false;
        if (item.pricePerDay > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchBrand = item.brand.toLowerCase().includes(q);
          const matchCat = item.categoryNameTh.toLowerCase().includes(q);
          const matchSetType = item.setTypeTh.toLowerCase().includes(q);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchBrand || matchCat || matchSetType || matchTag;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
  }, [items, selectedCategory, selectedSize, onlyAvailable, maxPrice, searchQuery, sortBy]);

  // Recommended items for unauthenticated showcase
  const recommendedItems = useMemo(() => {
    return items.filter((i) => i.isAvailable && i.rating >= 4.7).slice(0, 8);
  }, [items]);

  // Customer creates a rental booking
  const handleConfirmBooking = (newBookingData: Omit<SetBooking, 'id' | 'status' | 'bookedAt' | 'contractId'>) => {
    // If not logged in, prompt sign in first
    if (!currentUser) {
      setShowAuthModal(true);
      showToast('กรุณาเข้าสู่ระบบเพื่อดำเนินการจองเช่าชุดค่ะ ✨');
      return;
    }

    const pointsEarned = newBookingData.pointsEarned ?? calculatePointsEarned(newBookingData.rentalFee, currentUser.loyaltyTier || 'Silver');
    const pointsRedeemed = newBookingData.pointsRedeemed ?? 0;

    const bookingId = `ORD-${Date.now().toString().slice(-6)}`;
    const newBooking: SetBooking = {
      ...newBookingData,
      id: bookingId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      renterName: currentUser.name || newBookingData.renterName,
      renterPhone: currentUser.phone || newBookingData.renterPhone,
      status: 'pending_owner_approval',
      bookedAt: new Date().toISOString(),
      contractId: `CTR-${Date.now().toString().slice(-6)}`,
      pointsEarned,
      pointsRedeemed,
      pointsDiscount: newBookingData.pointsDiscount ?? pointsRedeemed
    };

    // Update customer's points balance, tier, and transaction ledger
    const prevPoints = currentUser.loyaltyPoints ?? 0;
    const nextPoints = Math.max(0, prevPoints - pointsRedeemed + pointsEarned);
    const prevLifetime = currentUser.lifetimePoints ?? prevPoints;
    const nextLifetime = prevLifetime + pointsEarned;
    const nextTier = getLoyaltyTier(nextPoints);

    const newTxList: LoyaltyPointTransaction[] = [];
    const nowStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

    if (pointsRedeemed > 0) {
      newTxList.push({
        id: `tx-red-${Date.now()}`,
        date: nowStr,
        description: `ใช้ส่วนลดคะแนนสำหรับออเดอร์ "${newBookingData.itemTitle}"`,
        points: -pointsRedeemed,
        type: 'redeemed',
        bookingId: bookingId,
        balanceAfter: prevPoints - pointsRedeemed
      });
    }

    if (pointsEarned > 0) {
      newTxList.push({
        id: `tx-earn-${Date.now()}`,
        date: nowStr,
        description: `รับคะแนนจากการเช่าชุด "${newBookingData.itemTitle}" (${newBookingData.totalDays} วัน)`,
        points: pointsEarned,
        type: 'earned',
        bookingId: bookingId,
        balanceAfter: nextPoints
      });
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      loyaltyPoints: nextPoints,
      lifetimePoints: nextLifetime,
      loyaltyTier: nextTier,
      tier: nextTier === 'Platinum' ? 'Platinum' : nextTier === 'Gold' ? 'VIP Gold' : 'Silver',
      pointsHistory: [...newTxList, ...(currentUser.pointsHistory || [])]
    };

    setCurrentUser(updatedUser);
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedItemForDetail(null);
    setCustomerTab('my-rentals');
    showToast(`จองชุด "${newBooking.itemTitle}" สำเร็จแล้ว! คุณได้รับ +${pointsEarned} คะแนนสะสม ✨`);
  };

  // Admin updates an order status in backoffice
  const handleUpdateBookingStatus = (bookingId: string, newStatus: SetBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Admin creates an outfit listing
  const handleAddListing = (newItem: WomenSetItem) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`ลงชุด "${newItem.title}" สำเร็จ! แสดงบนหน้าร้านให้ลูกค้าเลือกเช่าทันที 🎉`);
  };

  // Admin edits an outfit listing
  const handleUpdateListing = (updatedItem: WomenSetItem) => {
    setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    showToast(`อัปเดตข้อมูลชุด "${updatedItem.title}" เรียบร้อยแล้ว ✨`);
  };

  // Admin toggles availability
  const handleToggleAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const next = !item.isAvailable;
          showToast(next ? `เปิดให้เช่าชุด "${item.title}" แล้ว` : `ปิดรับจองชุด "${item.title}" ชั่วคราว`);
          return { ...item, isAvailable: next };
        }
        return item;
      })
    );
  };

  // Admin deletes an outfit
  const handleDeleteListing = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast('ลบชุดเซ็ทออกจากระบบเรียบร้อย');
  };

  // Customer submits a review for a completed rental
  const handleSubmitReview = (reviewData: {
    bookingId: string;
    itemId: string;
    rating: number;
    comment: string;
    fitFeedback: string;
    heightWeight: string;
    tags: string[];
    occasion: string;
  }) => {
    const booking = bookings.find((b) => b.id === reviewData.bookingId);
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: currentUser?.name || booking?.renterName || 'ลูกค้า SETISTA',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: reviewData.rating,
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      occasion: reviewData.occasion || booking?.eventOccasion || 'ไปงานสำคัญ',
      sizeWorn: booking ? `ไซส์ ${booking.selectedSize}` : 'ไซส์ S',
      heightWeight: reviewData.heightWeight || 'สัดส่วนมาตรฐาน',
      comment: reviewData.comment,
      fitFeedback: reviewData.fitFeedback,
      tags: reviewData.tags
    };

    // 1. Add to reviewsMap
    setReviewsMap((prev) => {
      const existing = prev[reviewData.itemId] || [];
      return {
        ...prev,
        [reviewData.itemId]: [newReview, ...existing]
      };
    });

    // 2. Mark booking as reviewed
    setBookings((prev) =>
      prev.map((b) =>
        b.id === reviewData.bookingId
          ? { ...b, isReviewed: true, reviewRating: reviewData.rating, reviewComment: reviewData.comment }
          : b
      )
    );

    // 3. Recalculate average rating & reviewCount for the garment item
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === reviewData.itemId) {
          const currentReviews = reviewsMap[reviewData.itemId] || [];
          const allRatings = [reviewData.rating, ...currentReviews.map((r) => r.rating)];
          const newAvg = Number((allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(2));
          return {
            ...it,
            rating: newAvg,
            reviewCount: it.reviewCount + 1
          };
        }
        return it;
      })
    );

    // 4. Award loyalty points bonus for reviewing (+50 points)
    if (currentUser) {
      const bonusPoints = 50;
      const prevPoints = currentUser.loyaltyPoints ?? 0;
      const nextPoints = prevPoints + bonusPoints;
      const nextLifetime = (currentUser.lifetimePoints ?? prevPoints) + bonusPoints;
      const nextTier = getLoyaltyTier(nextPoints);

      const reviewTx: LoyaltyPointTransaction = {
        id: `tx-rev-${Date.now()}`,
        date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        description: `โบนัสรีวิว ${reviewData.rating} ดาว สำหรับออเดอร์ #${reviewData.bookingId.slice(-6)}`,
        points: bonusPoints,
        type: 'review_reward',
        bookingId: reviewData.bookingId,
        balanceAfter: nextPoints
      };

      const updatedUser: UserAccount = {
        ...currentUser,
        loyaltyPoints: nextPoints,
        lifetimePoints: nextLifetime,
        loyaltyTier: nextTier,
        tier: nextTier === 'Platinum' ? 'Platinum' : nextTier === 'Gold' ? 'VIP Gold' : 'Silver',
        pointsHistory: [reviewTx, ...(currentUser.pointsHistory || [])]
      };

      setCurrentUser(updatedUser);
      showToast(`ขอบคุณสำหรับรีวิวค่ะ! คุณได้รับ +50 คะแนนสะสม และรีวิวของคุณแสดงในหน้ารายละเอียดชุดแล้ว ⭐`);
    } else {
      showToast(`ขอบคุณสำหรับรีวิวค่ะ! คะแนน ${reviewData.rating} ดาว และรีวิวของคุณแสดงในหน้ารายละเอียดชุดแล้ว ⭐`);
    }

    setReviewModalData(null);
  };

  // Unified Authentication Handler
  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    if (account.role === 'admin') {
      setSystemMode('admin');
      showToast(`เข้าสู่ระบบในฐานะแอดมิน: ยินดีต้อนรับ ${account.name}`);
    } else {
      setSystemMode('storefront');
      setCustomerTab('browse');
      showToast(`เข้าสู่ระบบลูกค้า: ยินดีต้อนรับ ${account.name}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSystemMode('storefront');
    setCustomerTab('browse');
    showToast('ออกจากระบบแล้ว กลับสู่หน้าที่แนะนำ');
  };

  // User-specific bookings: New accounts have no history until they rent a dress!
  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return bookings;
    
    return bookings.filter((b) => {
      if (b.userId) return b.userId === currentUser.id;
      if (b.userEmail) return b.userEmail.toLowerCase() === currentUser.email.toLowerCase();
      return currentUser.email.toLowerCase() === 'customer@setista.com' ||
             currentUser.name === 'คุณพิมพ์ลดา พัฒนกิจ';
    });
  }, [bookings, currentUser]);

  const activeBookingsCount = useMemo(() => {
    return userBookings.filter(
      (b) => b.status === 'fitting_scheduled' || b.status === 'dispatched' || b.status === 'active_renting'
    ).length;
  }, [userBookings]);

  // =========================================================================
  // SYSTEM 1: ADMIN BACK-OFFICE SYSTEM (หลังบ้าน)
  // Protected with ProtectedRoute to ensure role separation
  // =========================================================================
  if (systemMode === 'admin') {
    return (
      <ProtectedRoute
        currentUser={currentUser}
        requiredRole="admin"
        fallbackRoute={() => setSystemMode('storefront')}
        onOpenAuth={() => setShowAuthModal(true)}
      >
        <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
          {/* Toast Notification */}
          {toastMessage && (
            <Toast
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          )}

          {/* Main Admin Console from src/pages/ */}
          <AdminBackofficePage
            adminName={currentUser?.name || 'ผู้ดูแลระบบ'}
            myListings={items}
            allBookings={bookings}
            onOpenCreateModal={() => {
              setItemToEdit(null);
              setShowCreateModal(true);
            }}
            onEditListing={(item) => {
              setItemToEdit(item);
              setShowCreateModal(true);
            }}
            onToggleAvailability={handleToggleAvailability}
            onDeleteListing={handleDeleteListing}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onSwitchToStorefront={() => setSystemMode('storefront')}
            onLogoutAdmin={handleLogout}
            onOpenChatWithCustomer={(item) => setSelectedItemForChat(item)}
            showToast={showToast}
          />

          {/* Modal: Add/Edit Clothing Listing */}
          {showCreateModal && (
            <CreateListingModal
              onClose={() => {
                setShowCreateModal(false);
                setItemToEdit(null);
              }}
              onAddListing={handleAddListing}
              itemToEdit={itemToEdit}
              onUpdateListing={handleUpdateListing}
            />
          )}

          {/* Chat with Customer Modal in Admin Mode */}
          {selectedItemForChat && (
            <ChatModal
              item={selectedItemForChat}
              onClose={() => setSelectedItemForChat(null)}
              customerName="ลูกค้า"
            />
          )}
        </div>
      </ProtectedRoute>
    );
  }

  // =========================================================================
  // SYSTEM 2: STOREFRONT SYSTEM (หน้าบ้าน)
  // RULE 1: ถ้ายังไม่เข้าสู่ระบบ -> ให้เห็นเฉพาะ "หน้าที่แนะนำ" (Guest Recommended Page)
  // RULE 2: ถ้าเข้าสู่ระบบบัญชีลูกค้าแล้ว -> เห็นบริการเต็มรูปแบบ (StorefrontPage, MyRentalsPage, CarePolicyPage)
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-neutral-900 font-sans selection:bg-rose-900 selection:text-rose-100 pb-16 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Slim Admin Preview Ribbon (ONLY shown if an Admin account is previewing the storefront) */}
      {currentUser?.role === 'admin' && (
        <div className="bg-neutral-950 text-stone-200 border-b border-stone-800 py-2 px-4 text-xs select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">
                แอดมินกำลังดูตัวอย่างหน้าบ้าน (Storefront Preview)
              </span>
              <span className="text-stone-400 text-[11px] hidden md:inline">
                | กำลังเข้าสู่ระบบด้วย: <strong className="text-stone-200">{currentUser.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSystemMode('admin')}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>← กลับสู่แผงควบคุมหลังบ้านแอดมิน</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setItemToEdit(null);
                  setShowCreateModal(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
                <span>+ ลงชุดใหม่</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-2 py-1 rounded-lg text-stone-400 hover:text-white text-xs cursor-pointer"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer / Guest Navbar */}
      <Navbar
        currentCustomerTab={customerTab}
        setCurrentCustomerTab={setCustomerTab}
        onOpenSizeGuide={() => setShowSizeGuideModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        activeBookingsCount={activeBookingsCount}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenLoyaltyModal={() => setShowLoyaltyModal(true)}
        onGoToAdmin={() => setSystemMode('admin')}
        onLogout={handleLogout}
      />

      {/* Main Content Area: Routes to Pages */}
      <main className="flex-1">
        {/* CASE A: USER IS NOT LOGGED IN -> SHOW ONLY RECOMMENDED PAGE */}
        {!currentUser && customerTab !== 'care-policy' && (
          <GuestRecommendedPage
            recommendedItems={recommendedItems}
            onOpenAuth={() => setShowAuthModal(true)}
            onSelectItemPreview={(item) => setSelectedItemForDetail(item)}
            onOpenSizeGuide={() => setShowSizeGuideModal(true)}
          />
        )}

        {/* CASE B: USER IS LOGGED IN AS CUSTOMER -> FULL CUSTOMER SERVICES */}
        {currentUser && customerTab === 'browse' && (
          <StorefrontPage
            items={filteredItems}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onlyAvailable={onlyAvailable}
            setOnlyAvailable={setOnlyAvailable}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onOpenSizeGuide={() => setShowSizeGuideModal(true)}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onOpenChat={(item) => setSelectedItemForChat(item)}
          />
        )}

        {/* Customer Wardrobe View (ตู้เสื้อผ้าและประวัติการเช่าของลูกค้า) */}
        {currentUser && customerTab === 'my-rentals' && (
          <MyRentalsPage
            bookings={userBookings}
            items={items}
            currentUser={currentUser}
            onOpenLoyaltyModal={() => setShowLoyaltyModal(true)}
            onOpenContract={(item, days, start, end, size) => {
              setContractData({ item, days, startDate: start, endDate: end, size });
            }}
            onOpenChat={(item) => setSelectedItemForChat(item)}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onExploreItems={() => setCustomerTab('browse')}
            onOpenReviewModal={(booking, item) => setReviewModalData({ booking, item })}
          />
        )}

        {/* Customer Care & Guarantee Policy View (บริการซักแห้งฟรี & ประกันคราบ) */}
        {customerTab === 'care-policy' && (
          <CarePolicyPage />
        )}
      </main>

      {/* Customer Footer */}
      <Footer
        onSelectCategory={(cat) => {
          if (currentUser) {
            setSelectedCategory(cat);
            setCustomerTab('browse');
          } else {
            setShowAuthModal(true);
          }
        }}
        onNavigateTab={(tab) => {
          if (tab === 'my-rentals' && !currentUser) {
            setShowAuthModal(true);
            showToast('กรุณาเข้าสู่ระบบเพื่อดูตู้เสื้อผ้าของคุณค่ะ ✨');
          } else {
            setCustomerTab(tab);
          }
        }}
        onOpenSizeGuide={() => setShowSizeGuideModal(true)}
      />

      {/* Unified Login & Account Modal */}
      <UnifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenLoyaltyModal={() => setShowLoyaltyModal(true)}
      />

      {/* Detail / PDP & Customer Booking Checkout Modal */}
      {selectedItemForDetail && (
        <RentalDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
          onConfirmBooking={handleConfirmBooking}
          currentUser={currentUser}
          onOpenLoyaltyModal={() => setShowLoyaltyModal(true)}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenChat={(item) => {
            setSelectedItemForDetail(null);
            setSelectedItemForChat(item);
          }}
          onOpenContract={(item, days, start, end, size) => {
            setContractData({ item, days, startDate: start, endDate: end, size });
          }}
          onOpenSizeGuide={() => setShowSizeGuideModal(true)}
          reviews={reviewsMap[selectedItemForDetail.id] || []}
          completedBookingForReview={userBookings.find(
            (b) => b.itemId === selectedItemForDetail.id && b.status === 'completed'
          )}
          onOpenReviewModal={(booking, item) => setReviewModalData({ booking, item })}
        />
      )}

      {/* Loyalty & Rewards Profile Modal */}
      {showLoyaltyModal && currentUser && (
        <LoyaltyProfileModal
          isOpen={showLoyaltyModal}
          onClose={() => setShowLoyaltyModal(false)}
          currentUser={currentUser}
          onExploreItems={() => {
            setShowLoyaltyModal(false);
            setCustomerTab('browse');
          }}
        />
      )}

      {/* Review & Rating Modal */}
      {reviewModalData && (
        <ReviewModal
          booking={reviewModalData.booking}
          item={reviewModalData.item}
          onClose={() => setReviewModalData(null)}
          onSubmitReview={handleSubmitReview}
          currentUser={currentUser}
        />
      )}

      {/* Chat with Stylist & Contract Negotiation Modal */}
      {selectedItemForChat && (
        <ChatModal
          item={selectedItemForChat}
          onClose={() => setSelectedItemForChat(null)}
          customerName={currentUser?.name || 'ลูกค้า'}
          onOpenContract={(item) => {
            setContractData({
              item,
              days: 3,
              startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              size: item.availableSizes[0] || 'S'
            });
          }}
        />
      )}

      {/* Digital Rental Agreement Modal (e-Contract) */}
      {contractData && (
        <RentalAgreementModal
          item={contractData.item}
          days={contractData.days}
          startDate={contractData.startDate}
          endDate={contractData.endDate}
          size={contractData.size}
          onClose={() => setContractData(null)}
        />
      )}

      {/* Size Guide & Fit Finder Modal */}
      {showSizeGuideModal && (
        <SizeGuideModal
          onClose={() => setShowSizeGuideModal(false)}
          onSelectRecommendedSize={(size) => {
            setSelectedSize(size);
            showToast(`ปรับตัวกรองไซส์เป็น ${size} เรียบร้อยแล้วค่ะ`);
          }}
        />
      )}

      {/* Owner "+ ลงเสื้อผ้าเอง" / แก้ไขชุด Modal (เฉพาะแอดมินตอนดูตัวอย่าง) */}
      {showCreateModal && currentUser?.role === 'admin' && (
        <CreateListingModal
          onClose={() => {
            setShowCreateModal(false);
            setItemToEdit(null);
          }}
          onAddListing={handleAddListing}
          itemToEdit={itemToEdit}
          onUpdateListing={handleUpdateListing}
        />
      )}

      {/* Onboarding / How It Works Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onStartExplore={() => {
          setCustomerTab('browse');
          setShowOnboardingModal(false);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation Bar (Fixed for thumb-friendly mobile experience) */}
      <BottomNavigation
        currentTab={customerTab}
        onNavigateTab={(tab) => {
          setCustomerTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        activeBookingsCount={activeBookingsCount}
        onOpenAuth={() => setShowAuthModal(true)}
        onGoToAdmin={() => setSystemMode('admin')}
        systemMode={systemMode}
      />
    </div>
  );
}
