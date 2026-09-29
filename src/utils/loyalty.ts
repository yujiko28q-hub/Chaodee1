import { LoyaltyTier, LoyaltyPointTransaction } from '../types/rental';

export interface TierConfig {
  tier: LoyaltyTier;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  nameTh: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  icon: string;
  perks: string[];
}

export const LOYALTY_TIERS: Record<LoyaltyTier, TierConfig> = {
  Silver: {
    tier: 'Silver',
    minPoints: 0,
    maxPoints: 499,
    multiplier: 1.0,
    nameTh: 'Silver Member',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-700',
    borderColor: 'border-stone-300',
    icon: '✨',
    perks: [
      'สะสมคะแนนอัตราปกติ (1 คะแนน ทุก ฿10 ที่ใช้จ่าย)',
      'บริการเนาสอยเก็บทรงฟรีทุกชุด',
      'ซักแห้งพรีเมียมฟรีไม่ต้องซักคืน'
    ]
  },
  Gold: {
    tier: 'Gold',
    minPoints: 500,
    maxPoints: 1499,
    multiplier: 1.2,
    nameTh: 'Gold Member',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    borderColor: 'border-amber-300',
    icon: '👑',
    perks: [
      'รับคะแนนสะสมคูณ 1.2 เท่า ทุกการเช่า',
      'เลือกพร็อพเครื่องประดับฟรี 1 ชิ้น ทุกการจอง',
      'บริการจัดเตรียมและตรวจสภาพชุดลำดับแรก (Priority Queue)',
      'บริการสอยเก็บทรงและซักแห้งพรีเมียมฟรี'
    ]
  },
  Platinum: {
    tier: 'Platinum',
    minPoints: 1500,
    maxPoints: Infinity,
    multiplier: 1.5,
    nameTh: 'Platinum VIP',
    badgeBg: 'bg-rose-900',
    badgeText: 'text-rose-100',
    borderColor: 'border-rose-400',
    icon: '💎',
    perks: [
      'รับคะแนนสะสมคูณสูงสุด 1.5 เท่า ทุกการเช่า',
      'ฟรีค่าจัดส่งด่วน GrabExpress ใน กทม. ทุกออเดอร์',
      'ฟรีเครื่องประดับเสริมทุกชิ้นในเซ็ท',
      'สิทธิ์จองชุดคอลเลกชันใหม่ก่อนใคร (Exclusive Early Access)',
      'เจ้าหน้าที่สไตลิสต์ส่วนตัวให้คำปรึกษาตลอด 24 ชม.'
    ]
  }
};

/**
 * Determine loyalty tier from lifetime or current points
 */
export function getLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 1500) return 'Platinum';
  if (points >= 500) return 'Gold';
  return 'Silver';
}

/**
 * Calculate progress toward next tier
 */
export function getTierProgress(currentPoints: number) {
  const currentTier = getLoyaltyTier(currentPoints);
  
  if (currentTier === 'Platinum') {
    return {
      currentTier,
      nextTier: null,
      neededForNext: 0,
      percent: 100,
      label: 'ระดับสูงสุด (Platinum VIP)'
    };
  }

  if (currentTier === 'Gold') {
    const range = 1500 - 500;
    const progress = Math.max(0, currentPoints - 500);
    const percent = Math.min(99, Math.round((progress / range) * 100));
    return {
      currentTier,
      nextTier: 'Platinum' as LoyaltyTier,
      neededForNext: Math.max(0, 1500 - currentPoints),
      percent,
      label: `อีก ${1500 - currentPoints} คะแนนเพื่อเลื่อนเป็น Platinum VIP`
    };
  }

  // Silver
  const range = 500;
  const percent = Math.min(99, Math.round((currentPoints / range) * 100));
  return {
    currentTier,
    nextTier: 'Gold' as LoyaltyTier,
    neededForNext: Math.max(0, 500 - currentPoints),
    percent,
    label: `อีก ${500 - currentPoints} คะแนนเพื่อเลื่อนเป็น Gold Member`
  };
}

/**
 * Calculate points earned from a rental amount
 * 1 point per 10 THB spent * tier multiplier
 */
export function calculatePointsEarned(rentalFee: number, tier: LoyaltyTier = 'Silver'): number {
  const basePoints = Math.floor(rentalFee / 10);
  const multiplier = LOYALTY_TIERS[tier]?.multiplier || 1.0;
  return Math.round(basePoints * multiplier);
}

/**
 * Initial mock history for customer accounts
 */
export const INITIAL_LOYALTY_HISTORY_CUST_1: LoyaltyPointTransaction[] = [
  {
    id: 'tx-001',
    date: '15 ก.ย. 2026',
    description: 'ยินดีต้อนรับสมาชิกใหม่ (Welcome Bonus)',
    points: 100,
    type: 'bonus',
    balanceAfter: 100
  },
  {
    id: 'tx-002',
    date: '20 ก.ย. 2026',
    description: 'เช่าชุด Aura Pearl Cream Tweed Vest (3 วัน)',
    points: 147,
    type: 'earned',
    bookingId: 'ORD-882190',
    balanceAfter: 247
  },
  {
    id: 'tx-003',
    date: '24 ก.ย. 2026',
    description: 'รีวิว 5 ดาวสำหรับชุด Aura Pearl Cream Tweed',
    points: 50,
    type: 'review_reward',
    balanceAfter: 297
  },
  {
    id: 'tx-004',
    date: '26 ก.ย. 2026',
    description: 'เช่าชุด Poem Silhouette Rose Dust Sculpted Blazer',
    points: 383,
    type: 'earned',
    bookingId: 'ORD-991204',
    balanceAfter: 680
  }
];

export const INITIAL_LOYALTY_HISTORY_CUST_2: LoyaltyPointTransaction[] = [
  {
    id: 'tx-101',
    date: '10 ส.ค. 2026',
    description: 'ยินดีต้อนรับสมาชิกใหม่ (Welcome Bonus)',
    points: 100,
    type: 'bonus',
    balanceAfter: 100
  },
  {
    id: 'tx-102',
    date: '18 ส.ค. 2026',
    description: 'เช่าชุด Zimmermann Resort Linen Floral Tie-Front',
    points: 140,
    type: 'earned',
    balanceAfter: 240
  }
];
