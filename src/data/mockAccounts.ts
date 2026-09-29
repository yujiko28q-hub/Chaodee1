import { UserAccount } from '../types/rental';
import { INITIAL_LOYALTY_HISTORY_CUST_1, INITIAL_LOYALTY_HISTORY_CUST_2 } from '../utils/loyalty';

export interface DemoCredentialAccount extends UserAccount {
  passwordOrPin: string;
  descriptionTh: string;
}

export const DEMO_ACCOUNTS: DemoCredentialAccount[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@setista.com',
    name: 'คุณนภัสสร ลิขิตตระกูล',
    role: 'admin',
    adminTitle: 'ผู้จัดการร้านแฟชั่น & ผู้ดูแลระบบหลัก (Admin)',
    phone: '082-945-8998',
    passwordOrPin: '1234',
    memberSince: 'ม.ค. 2024',
    descriptionTh: 'สิทธิ์ระดับแอดมินสูงสุด: สามารถลงเสื้อผ้าใหม่, แก้ไขราคา/มัดจำ/ไซส์, อนุมัติออเดอร์, และจัดการหลังบ้านได้ทั้งหมด'
  },
  {
    id: 'usr-admin-02',
    email: 'staff@setista.com',
    name: 'คุณกรรณิการ์ (แอดมินฝ่ายสต็อก & การจัดส่ง)',
    role: 'admin',
    adminTitle: 'เจ้าหน้าที่ฝ่ายจัดการสต็อกและคิวสอยแก้ทรง',
    phone: '089-876-5432',
    passwordOrPin: '1234',
    memberSince: 'มี.ค. 2024',
    descriptionTh: 'สิทธิ์ระดับแอดมิน: จัดการคลังเสื้อผ้าและติดตามพัสดุส่งคืน'
  },
  {
    id: 'usr-cust-01',
    email: 'customer@setista.com',
    name: 'คุณพิมพ์ลดา พัฒนกิจ',
    role: 'customer',
    tier: 'VIP Gold',
    loyaltyTier: 'Gold',
    loyaltyPoints: 680,
    lifetimePoints: 1250,
    pointsHistory: INITIAL_LOYALTY_HISTORY_CUST_1,
    phone: '089-112-3456',
    passwordOrPin: '1234',
    memberSince: 'พ.ค. 2024',
    descriptionTh: 'บัญชีลูกค้าทั่วไป: มีคะแนนสะสม 680 คะแนน (ระดับ Gold Member) สิทธิประโยชน์คูณ 1.2x'
  },
  {
    id: 'usr-cust-02',
    email: 'praewa@gmail.com',
    name: 'คุณแพรวา มณีโชติ',
    role: 'customer',
    tier: 'Silver',
    loyaltyTier: 'Silver',
    loyaltyPoints: 240,
    lifetimePoints: 340,
    pointsHistory: INITIAL_LOYALTY_HISTORY_CUST_2,
    phone: '081-445-6789',
    passwordOrPin: '1234',
    memberSince: 'ส.ค. 2024',
    descriptionTh: 'บัญชีลูกค้าทั่วไป: มีคะแนนสะสม 240 คะแนน (ระดับ Silver Member)'
  }
];

export const getRegisteredAccounts = (): DemoCredentialAccount[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('setista_registered_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRegisteredAccount = (account: DemoCredentialAccount) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRegisteredAccounts();
    const updated = [account, ...existing.filter(a => a.email.toLowerCase() !== account.email.toLowerCase())];
    localStorage.setItem('setista_registered_accounts', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered account', e);
  }
};

export const getAccountByEmail = (email: string): DemoCredentialAccount | undefined => {
  const clean = email.trim().toLowerCase();
  const custom = getRegisteredAccounts().find(a => a.email.toLowerCase() === clean);
  if (custom) return custom;
  return DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === clean);
};

export const verifyAccountCredentials = (
  emailOrUsername: string,
  secret: string
): { success: boolean; account?: DemoCredentialAccount; error?: string } => {
  const cleanInput = emailOrUsername.trim().toLowerCase();
  
  // Check dynamically registered accounts first, then fallback to DEMO_ACCOUNTS
  const allAccounts = [...getRegisteredAccounts(), ...DEMO_ACCOUNTS];

  // Find matching account by email or part of name
  const account = allAccounts.find(
    a => a.email.toLowerCase() === cleanInput || 
         a.name.toLowerCase().includes(cleanInput) ||
         (cleanInput === 'admin' && a.role === 'admin') ||
         (cleanInput === 'customer' && a.role === 'customer')
  );

  if (!account) {
    return {
      success: false,
      error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ (กรุณาตรวจสอบอีเมล หรือเลือกแท็บสมัครสมาชิกใหม่)'
    };
  }

  // Validate PIN / Password (accept account PIN or 1234 or admin1234)
  if (
    secret.trim() === account.passwordOrPin || 
    secret.trim() === '1234' || 
    secret.trim() === 'admin1234' || 
    secret.trim() === 'cust1234'
  ) {
    return { success: true, account };
  }

  return {
    success: false,
    error: 'รหัสผ่านหรือ PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
  };
};
