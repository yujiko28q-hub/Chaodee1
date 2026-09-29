import { UserAccount, LoyaltyPointTransaction } from '../types/rental';
import { calculatePointsEarned, getLoyaltyTier } from '../utils/loyalty';
import { StorageKeys, getStorageItem, setStorageItem } from './apiClient';

export const loyaltyService = {
  /**
   * Adds loyalty points for a completed or confirmed rental.
   */
  awardRentalPoints(
    user: UserAccount,
    totalRentalPrice: number,
    bookingId: string
  ): { updatedUser: UserAccount; earnedPoints: number } {
    const userTier = user.loyaltyTier || (user.tier === 'VIP Gold' ? 'Gold' : user.tier === 'Platinum' ? 'Platinum' : 'Silver');
    const earnedPoints = calculatePointsEarned(totalRentalPrice, userTier);

    const nowStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const currentPoints = user.loyaltyPoints || 0;
    const newPoints = currentPoints + earnedPoints;
    const newTier = getLoyaltyTier(newPoints);

    const transaction: LoyaltyPointTransaction = {
      id: `pt-${Date.now().toString().slice(-6)}`,
      bookingId,
      points: earnedPoints,
      type: 'earned',
      description: `คะแนนจากการเช่าชุดคำสั่งซื้อ #${bookingId}`,
      date: nowStr,
      balanceAfter: newPoints,
    };

    const updatedUser: UserAccount = {
      ...user,
      loyaltyPoints: newPoints,
      lifetimePoints: (user.lifetimePoints || currentPoints) + earnedPoints,
      loyaltyTier: newTier,
      tier: newTier,
      pointsHistory: [transaction, ...(user.pointsHistory || [])],
    };

    setStorageItem(StorageKeys.CURRENT_USER, updatedUser);

    return { updatedUser, earnedPoints };
  }
};
