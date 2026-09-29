import { UserAccount } from '../types/rental';
import { verifyAccountCredentials } from '../data/mockAccounts';
import { 
  ApiResponse, 
  simulateNetworkDelay, 
  StorageKeys, 
  getStorageItem, 
  setStorageItem, 
  removeStorageItem 
} from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export const authService = {
  /**
   * Retrieves the currently authenticated session from storage or API.
   */
  async getCurrentUser(): Promise<UserAccount | null> {
    await simulateNetworkDelay(50);
    return getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
  },

  /**
   * Authenticates user using email and password.
   */
  async login(email: string, passOrPin: string): Promise<ApiResponse<UserAccount>> {
    await simulateNetworkDelay(250);

    const result = verifyAccountCredentials(email, passOrPin);
    if (!result.success || !result.account) {
      return {
        success: false,
        error: result.error || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูล',
        timestamp: new Date().toISOString(),
      };
    }

    setStorageItem(StorageKeys.CURRENT_USER, result.account);

    return {
      success: true,
      data: result.account,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Registers a new customer account with 0 points and isolated profile.
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<UserAccount>> {
    await simulateNetworkDelay(300);

    if (!payload.name?.trim()) {
      return {
        success: false,
        error: 'กรุณาระบุชื่อ-นามสกุล',
        timestamp: new Date().toISOString(),
      };
    }

    if (!payload.email?.trim() || !payload.email.includes('@')) {
      return {
        success: false,
        error: 'กรุณาระบุอีเมลที่ถูกต้อง',
        timestamp: new Date().toISOString(),
      };
    }

    const newAccount: UserAccount = {
      id: `usr-cust-${Date.now().toString().slice(-6)}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || '08X-XXX-XXXX',
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(payload.name)}`,
      memberSince: '2026',
      loyaltyPoints: 0,
      loyaltyTier: 'Silver',
      tier: 'Silver',
      lifetimePoints: 0,
      pointsHistory: [],
    };

    setStorageItem(StorageKeys.CURRENT_USER, newAccount);

    return {
      success: true,
      data: newAccount,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Logs out the user and cleans up the active session.
   */
  async logout(): Promise<void> {
    await simulateNetworkDelay(100);
    removeStorageItem(StorageKeys.CURRENT_USER);
  }
};
