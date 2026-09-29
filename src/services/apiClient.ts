/**
 * SETISTA API Client Layer
 * Centralized HTTP / Mock Network communication layer with simulated latency,
 * response interceptors, and local storage persistence.
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ApiError';
  }
}

// Simulated network latency to mimic real-world server roundtrips
export async function simulateNetworkDelay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const StorageKeys = {
  CURRENT_USER: 'setista_current_user_v7',
  SYSTEM_MODE: 'setista_system_mode_v7',
  ITEMS: 'setista_items_v7',
  BOOKINGS: 'setista_bookings_v8',
  REVIEWS: 'setista_reviews_v7',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist to storage key "${key}":`, err);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove storage key "${key}":`, err);
  }
}
