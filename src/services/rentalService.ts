import { WomenSetItem } from '../types/rental';
import { INITIAL_SET_ITEMS } from '../data/mockRentals';
import { 
  ApiResponse, 
  simulateNetworkDelay, 
  StorageKeys, 
  getStorageItem, 
  setStorageItem 
} from './apiClient';

export const rentalService = {
  /**
   * Fetches all available rental listings.
   */
  async getItems(): Promise<WomenSetItem[]> {
    await simulateNetworkDelay(150);
    return getStorageItem<WomenSetItem[]>(StorageKeys.ITEMS, INITIAL_SET_ITEMS);
  },

  /**
   * Fetches an individual rental set by its ID.
   */
  async getItemById(id: string): Promise<WomenSetItem | null> {
    await simulateNetworkDelay(100);
    const items = await this.getItems();
    return items.find((item) => item.id === id) || null;
  },

  /**
   * Adds or updates a rental listing (used by Owner/Admin portal).
   */
  async saveItem(item: WomenSetItem): Promise<ApiResponse<WomenSetItem>> {
    await simulateNetworkDelay(200);
    const items = await this.getItems();
    const index = items.findIndex((i) => i.id === item.id);

    let updated: WomenSetItem[];
    if (index >= 0) {
      updated = [...items];
      updated[index] = item;
    } else {
      updated = [item, ...items];
    }

    setStorageItem(StorageKeys.ITEMS, updated);

    return {
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Toggles the availability state of a garment listing.
   */
  async toggleAvailability(itemId: string): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(150);
    const items = await this.getItems();
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      return {
        success: false,
        error: 'ไม่พบรายการชุดที่ระบุ',
        timestamp: new Date().toISOString(),
      };
    }

    item.isAvailable = !item.isAvailable;
    setStorageItem(StorageKeys.ITEMS, items);

    return {
      success: true,
      data: item.isAvailable,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Deletes a rental listing by ID.
   */
  async deleteItem(itemId: string): Promise<ApiResponse<void>> {
    await simulateNetworkDelay(180);
    const items = await this.getItems();
    const filtered = items.filter((i) => i.id !== itemId);
    setStorageItem(StorageKeys.ITEMS, filtered);

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
};
