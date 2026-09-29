import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { WomenSetItem, SetBooking, SetReview, UserAccount } from '../types/rental';
import { INITIAL_SET_ITEMS, INITIAL_MY_BOOKINGS, MOCK_SET_REVIEWS } from '../data/mockRentals';
import { StorageKeys, getStorageItem, setStorageItem } from '../services/apiClient';
import { loyaltyService } from '../services/loyaltyService';
import { useAuth } from './AuthContext';

interface RentalContextType {
  items: WomenSetItem[];
  bookings: SetBooking[];
  userBookings: SetBooking[];
  reviewsMap: Record<string, SetReview[]>;
  activeBookingsCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  confirmBooking: (bookingData: Omit<SetBooking, 'id'>) => Promise<SetBooking>;
  updateBookingStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  saveItem: (item: WomenSetItem) => void;
  toggleItemAvailability: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  addReview: (itemId: string, review: SetReview) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [items, setItems] = useState<WomenSetItem[]>(() => {
    return getStorageItem<WomenSetItem[]>(StorageKeys.ITEMS, INITIAL_SET_ITEMS);
  });

  const [bookings, setBookings] = useState<SetBooking[]>(() => {
    return getStorageItem<SetBooking[]>(StorageKeys.BOOKINGS, INITIAL_MY_BOOKINGS);
  });

  const [reviewsMap, setReviewsMap] = useState<Record<string, SetReview[]>>(() => {
    return getStorageItem<Record<string, SetReview[]>>(StorageKeys.REVIEWS, MOCK_SET_REVIEWS);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Sync state to local storage
  useEffect(() => {
    setStorageItem(StorageKeys.ITEMS, items);
  }, [items]);

  useEffect(() => {
    setStorageItem(StorageKeys.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    setStorageItem(StorageKeys.REVIEWS, reviewsMap);
  }, [reviewsMap]);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filter bookings strictly for the logged-in user
  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter((b) => {
      if (b.userId && b.userId === currentUser.id) return true;
      if (b.userEmail && b.userEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
      return false;
    });
  }, [bookings, currentUser]);

  const activeBookingsCount = useMemo(() => {
    return userBookings.filter((b) =>
      ['confirmed', 'fitting_scheduled', 'tailoring', 'dispatched', 'in_use', 'return_pending'].includes(b.status)
    ).length;
  }, [userBookings]);

  const confirmBooking = async (bookingData: Omit<SetBooking, 'id'>): Promise<SetBooking> => {
    const bookingId = `ORD-${Date.now().toString().slice(-6)}`;
    const newBooking: SetBooking = {
      ...bookingData,
      id: bookingId,
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      renterName: currentUser?.name || bookingData.renterName,
      renterPhone: currentUser?.phone || bookingData.renterPhone,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Award loyalty points
    if (currentUser) {
      const { earnedPoints } = loyaltyService.awardRentalPoints(currentUser, newBooking.totalAmount, newBooking.id);
      updateCurrentUser((prev) => {
        const nextPoints = (prev.loyaltyPoints || 0) + earnedPoints;
        return {
          ...prev,
          loyaltyPoints: nextPoints,
        };
      });
      showToast(`จองชุดสำเร็จ! รับคะแนนสะสม +${earnedPoints} แต้ม`);
    } else {
      showToast('จองชุดเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อเพื่อยืนยันคิว');
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, newStatus: SetBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast(`อัปเดตสถานะคำสั่งซื้อ #${bookingId} เรียบร้อยแล้ว`);
  };

  const saveItem = (item: WomenSetItem) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = item;
        return copy;
      }
      return [item, ...prev];
    });
    showToast('บันทึกข้อมูลชุดเรียบร้อยแล้ว');
  };

  const toggleItemAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    showToast('ปรับสถานะความพร้อมให้เช่าแล้ว');
  };

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('ลบรายการชุดออกจากระบบเรียบร้อย');
  };

  const addReview = (itemId: string, review: SetReview) => {
    setReviewsMap((prev) => {
      const existing = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: [review, ...existing],
      };
    });
    showToast('ขอบพระคุณสำหรับการรีวิวและให้คะแนนชุดค่ะ!');
  };

  return (
    <RentalContext.Provider
      value={{
        items,
        bookings,
        userBookings,
        reviewsMap,
        activeBookingsCount,
        toastMessage,
        showToast,
        confirmBooking,
        updateBookingStatus,
        saveItem,
        toggleItemAvailability,
        deleteItem,
        addReview,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRentalContext = (): RentalContextType => {
  const ctx = useContext(RentalContext);
  if (!ctx) {
    const items = getStorageItem<WomenSetItem[]>(StorageKeys.ITEMS, INITIAL_SET_ITEMS);
    const bookings = getStorageItem<SetBooking[]>(StorageKeys.BOOKINGS, INITIAL_MY_BOOKINGS);
    const reviewsMap = getStorageItem<Record<string, SetReview[]>>(StorageKeys.REVIEWS, MOCK_SET_REVIEWS);
    return {
      items,
      bookings,
      userBookings: bookings,
      reviewsMap,
      activeBookingsCount: 0,
      toastMessage: null,
      showToast: () => {},
      confirmBooking: async (b) => ({ ...b, id: `ORD-${Date.now()}` } as SetBooking),
      updateBookingStatus: () => {},
      saveItem: () => {},
      toggleItemAvailability: () => {},
      deleteItem: () => {},
      addReview: () => {},
    };
  }
  return ctx;
};
