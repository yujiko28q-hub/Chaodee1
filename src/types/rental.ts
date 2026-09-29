export type OccasionCategory = 
  | 'all'
  | 'wedding'       // เซ็ทงานแต่ง & กาล่าดินเนอร์
  | 'tweed'         // เซ็ททวีต & สไตล์คุณหนู
  | 'vacation'      // เซ็ทเที่ยวทะเล & รีสอร์ท
  | 'cafe'          // เซ็ทคาเฟ่ & บรันช์เกาหลี
  | 'suit'          // เซ็ทสูท & สมาร์ทแคชชวล
  | 'thai_modern';  // เซ็ทไทยโมเดิร์น & งานมงคล

export type ApparelSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Free Size';

export interface SetMeasurements {
  bust: string;    // เช่น 32 - 34 นิ้ว
  waist: string;   // เช่น 24 - 26 นิ้ว
  hip: string;     // เช่น 35 - 37 นิ้ว
  topLength?: string;
  bottomLength?: string;
}

export interface WomenSetItem {
  id: string;
  title: string;
  brand: string;
  category: OccasionCategory;
  categoryNameTh: string;
  setTypeTh: string; // เช่น 'เสื้อเบลเซอร์ + กางเกงขายาวทรงกระบอก'
  colorName: string;
  colorHex: string;
  pricePerDay: number;
  deposit: number;
  marketValue: number;
  availableSizes: ApparelSize[];
  measurements: Record<string, SetMeasurements>;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerAvatar?: string;
  ownerStudio: string;
  isAvailable: boolean;
  minRentDays: number;
  condition: 'เหมือนใหม่ 99%' | 'สภาพดีเยี่ยม 95%' | 'เกรดพรีเมียม';
  description: string;
  includedItems: string[]; // เช่น ['เสื้อทวีตแขนกุดปักกระดุมมุก', 'กระโปรงเอวสูงเข้าเซ็ท', 'ไม้แขวนสูท & ถุงคลุมสูทผ้ากำมะหยี่']
  matchingAccessories: string[]; // พร็อพเสริม เช่น 'เข็มขัดโซ่ทองชาแนล', 'ต่างหูมุกบาร็อค'
  stylingTips: string;
  rules: string[];
  deliveryOptions: string[];
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  fabric: string; // เช่น 'Premium French Tweed', 'Silk Satin 100%'
  dryCleaningIncluded: boolean;
  alterationAvailable: boolean;
  ownerIsSelf?: boolean; // เสื้อที่เราลงเอง
  stockCount?: number;
}

export interface SetBooking {
  id: string;
  itemId: string;
  itemTitle: string;
  brand: string;
  imageUrl: string;
  selectedSize: ApparelSize;
  alterationNotes?: string;
  needAccessories: boolean;
  accessoryName?: string;
  startDate: string;
  endDate: string;
  rentalPackage: '3days' | '5days' | '7days' | 'custom';
  totalDays: number;
  rentalFee: number;
  depositFee: number;
  discount: number;
  accessoryFee: number;
  totalAmount: number;
  userId?: string;
  userEmail?: string;
  renterName: string;
  renterPhone: string;
  deliveryMethod: string;
  deliveryAddress: string;
  shippingNotes?: string;
  depositMethod: 'cash' | 'kyc';
  eventOccasion: string;
  status: 'pending_owner_approval' | 'fitting_scheduled' | 'dispatched' | 'active_renting' | 'returning' | 'completed' | 'cancelled';
  bookedAt: string;
  studioName: string;
  contractId: string;
  trackingNumber?: string;
  isReviewed?: boolean;
  reviewRating?: number;
  reviewComment?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
}

export interface SetReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  occasion: string;
  sizeWorn: string;
  comment: string;
  heightWeight: string;
  fitFeedback?: string;
  tags?: string[];
}

export type UserRole = 'admin' | 'customer';
export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyPointTransaction {
  id: string;
  date: string;
  description: string;
  points: number; // positive for earned/bonus, negative for redeemed
  type: 'earned' | 'redeemed' | 'bonus' | 'review_reward';
  bookingId?: string;
  balanceAfter: number;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  tier?: 'VIP Gold' | 'Silver' | 'Standard' | LoyaltyTier;
  loyaltyPoints?: number;
  loyaltyTier?: LoyaltyTier;
  lifetimePoints?: number;
  pointsHistory?: LoyaltyPointTransaction[];
  adminTitle?: string;
  memberSince?: string;
}
