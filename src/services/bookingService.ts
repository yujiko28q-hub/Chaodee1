import { SetBooking } from '../types/rental';
import { INITIAL_MY_BOOKINGS } from '../data/mockRentals';
import { 
  ApiResponse, 
  simulateNetworkDelay, 
  StorageKeys, 
  getStorageItem, 
  setStorageItem 
} from './apiClient';

export const bookingService = {
  /**
   * Fetches all bookings (admin view).
   */
  async getAllBookings(): Promise<SetBooking[]> {
    await simulateNetworkDelay(150);
    return getStorageItem<SetBooking[]>(StorageKeys.BOOKINGS, INITIAL_MY_BOOKINGS);
  },

  /**
   * Fetches bookings strictly associated with a specific user account.
   */
  async getBookingsForUser(userId?: string, userEmail?: string): Promise<SetBooking[]> {
    await simulateNetworkDelay(120);
    const all = await this.getAllBookings();
    if (!userId && !userEmail) return [];

    return all.filter((b) => {
      if (userId && b.userId === userId) return true;
      if (userEmail && b.userEmail && b.userEmail.toLowerCase() === userEmail.toLowerCase()) return true;
      return false;
    });
  },

  /**
   * Creates a new rental order booking.
   */
  async createBooking(booking: SetBooking): Promise<ApiResponse<SetBooking>> {
    await simulateNetworkDelay(250);
    const all = await this.getAllBookings();
    const updated = [booking, ...all];
    setStorageItem(StorageKeys.BOOKINGS, updated);

    return {
      success: true,
      data: booking,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Updates status of an existing booking (e.g. dispatched, tailored, returned, completed).
   */
  async updateStatus(bookingId: string, status: SetBooking['status']): Promise<ApiResponse<SetBooking>> {
    await simulateNetworkDelay(150);
    const all = await this.getAllBookings();
    const target = all.find((b) => b.id === bookingId);

    if (!target) {
      return {
        success: false,
        error: 'ไม่พบคำสั่งจองที่ต้องการอัปเดต',
        timestamp: new Date().toISOString(),
      };
    }

    target.status = status;
    setStorageItem(StorageKeys.BOOKINGS, all);

    return {
      success: true,
      data: target,
      timestamp: new Date().toISOString(),
    };
  }
};
