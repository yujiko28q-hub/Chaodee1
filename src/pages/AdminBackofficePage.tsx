import React, { useState } from 'react';
import { WomenSetItem, SetBooking, OccasionCategory } from '../types/rental';
import { ItemVisual } from '../components/ItemVisual';
import { 
  PlusCircle, Sparkles, CheckCircle2, RotateCcw, 
  Scissors, Phone, Copy, Share2, ToggleLeft, ToggleRight, 
  Trash2, ShieldCheck, Clock, Eye, AlertCircle, ShoppingBag, 
  Truck, DollarSign, TrendingUp, UserCheck, Calendar, ArrowRight, 
  Edit3, LogOut, Settings, LayoutDashboard, Search, Filter, 
  Package, MapPin, CreditCard, ChevronRight, Check, X, Shirt,
  MessageCircle
} from 'lucide-react';

interface AdminBackofficeViewProps {
  adminName: string;
  myListings: WomenSetItem[];
  allBookings: SetBooking[];
  onOpenCreateModal: () => void;
  onEditListing: (item: WomenSetItem) => void;
  onToggleAvailability: (itemId: string) => void;
  onDeleteListing: (itemId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  onSwitchToStorefront: () => void;
  onLogoutAdmin: () => void;
  onOpenChatWithCustomer?: (item: WomenSetItem, booking: SetBooking) => void;
  showToast: (msg: string) => void;
}

export const AdminBackofficeView: React.FC<AdminBackofficeViewProps> = ({
  adminName,
  myListings,
  allBookings,
  onOpenCreateModal,
  onEditListing,
  onToggleAvailability,
  onDeleteListing,
  onUpdateBookingStatus,
  onSwitchToStorefront,
  onLogoutAdmin,
  onOpenChatWithCustomer,
  showToast
}) => {
  // Item pending deletion confirmation modal
  const [itemToDelete, setItemToDelete] = useState<WomenSetItem | null>(null);

  // Navigation tabs within Admin Backoffice
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'deposits' | 'customers' | 'settings'>('overview');
  
  // Filters & Searches
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'active' | 'returning' | 'completed'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Store status
  const [isStoreOnline, setIsStoreOnline] = useState(true);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('setista_admin_store_settings');
      return saved ? JSON.parse(saved) : {
        storeName: 'SETISTA Bangkok Flagship Studio',
        phone: '082-945-8998',
        lineId: '@setista.closet',
        returnAddress: 'สตูดิโอ SETISTA เลขที่ 88/12 ซอยทองหล่อ 13 แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110',
        bankAccount: 'ธนาคารกสิกรไทย 045-8-12345-6 (บจก. เซทิสต้า โคลเซ็ท)',
        promptPay: '0829458998',
        lateFeePerDay: 300,
        enableFreeBasting: true
      };
    } catch {
      return {
        storeName: 'SETISTA Bangkok Flagship Studio',
        phone: '082-945-8998',
        lineId: '@setista.closet',
        returnAddress: 'สตูดิโอ SETISTA เลขที่ 88/12 ซอยทองหล่อ 13 แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110',
        bankAccount: 'ธนาคารกสิกรไทย 045-8-12345-6 (บจก. เซทิสต้า โคลเซ็ท)',
        promptPay: '0829458998',
        lateFeePerDay: 300,
        enableFreeBasting: true
      };
    }
  });

  // Tracking numbers draft input
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('setista_admin_store_settings', JSON.stringify(storeSettings));
    showToast('บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว');
  };

  // Metrics
  const totalSets = myListings.length;
  const availableSets = myListings.filter(i => i.isAvailable).length;
  const pendingOrders = allBookings.filter(b => b.status === 'pending_owner_approval' || b.status === 'fitting_scheduled');
  const activeRentals = allBookings.filter(b => b.status === 'dispatched' || b.status === 'active_renting');
  const returningOrders = allBookings.filter(b => b.status === 'returning');
  const completedOrders = allBookings.filter(b => b.status === 'completed');
  const totalRentalRevenue = allBookings.reduce((sum, b) => sum + b.rentalFee, 0);
  const totalDepositHeld = allBookings.filter(b => b.status !== 'completed').reduce((sum, b) => sum + b.depositFee, 0);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('คัดลอกลิงก์หน้าร้านเรียบร้อยแล้ว ส่งให้ลูกค้าใน LINE / IG ได้ทันที!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getOrderStatusBadge = (status: SetBooking['status']) => {
    switch (status) {
      case 'pending_owner_approval':
        return {
          label: 'คำสั่งเช่าใหม่ (รออนุมัติ)',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          dot: 'bg-amber-500',
          step: 1
        };
      case 'fitting_scheduled':
        return {
          label: 'อนุมัติแล้ว (สอยทรง & เตรียมส่ง)',
          color: 'text-rose-800 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500',
          step: 2
        };
      case 'dispatched':
        return {
          label: 'จัดส่งแล้ว (ระหว่างนำส่ง)',
          color: 'text-sky-800 bg-sky-50 border-sky-200',
          dot: 'bg-sky-500',
          step: 2
        };
      case 'active_renting':
        return {
          label: 'ลูกค้าได้รับชุด (กำลังสวมใส่)',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500',
          step: 3
        };
      case 'returning':
        return {
          label: 'ส่งคืนแล้ว (รอตรวจสภาพ & คืนมัดจำ)',
          color: 'text-purple-800 bg-purple-50 border-purple-200',
          dot: 'bg-purple-500',
          step: 4
        };
      case 'completed':
        return {
          label: 'เสร็จสิ้น (คืนมัดจำแล้ว)',
          color: 'text-neutral-700 bg-stone-100 border-stone-200',
          dot: 'bg-stone-500',
          step: 5
        };
      default:
        return {
          label: 'ยกเลิก',
          color: 'text-rose-700 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500',
          step: 0
        };
    }
  };

  // Order Filtering
  const filteredOrders = allBookings.filter((b) => {
    if (orderFilter === 'pending') {
      if (b.status !== 'pending_owner_approval' && b.status !== 'fitting_scheduled') return false;
    } else if (orderFilter === 'active') {
      if (b.status !== 'dispatched' && b.status !== 'active_renting') return false;
    } else if (orderFilter === 'returning') {
      if (b.status !== 'returning') return false;
    } else if (orderFilter === 'completed') {
      if (b.status !== 'completed') return false;
    }

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchName = b.renterName.toLowerCase().includes(q);
      const matchPhone = b.renterPhone.includes(q);
      const matchItem = b.itemTitle.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchItem || matchId;
    }

    return true;
  });

  // Inventory Filtering
  const filteredListings = myListings.filter((item) => {
    if (inventoryCategoryFilter !== 'all' && item.category !== inventoryCategoryFilter) {
      return false;
    }
    if (inventorySearchQuery.trim()) {
      const q = inventorySearchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.colorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-neutral-900 flex flex-col font-sans selection:bg-rose-900 selection:text-rose-100 text-left">
      {/* ======================================================== */}
      {/* ADMIN TOP CONSOLE HEADER */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-neutral-950 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-900/60 border border-rose-500/40 text-rose-200 flex items-center justify-center font-serif text-lg font-bold">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  SETISTA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono uppercase tracking-wider border border-rose-400/30">
                  ระบบหลังบ้าน (ADMIN)
                </span>
              </div>
              <span className="text-[11px] text-stone-400 hidden sm:block">
                ระบบจัดการชุดเซ็ท ออเดอร์เช่า สอยทรง และการเงิน
              </span>
            </div>
          </div>

          {/* Quick Admin Profile & Store Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>แอดมิน: <strong className="text-white font-medium">{adminName}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSwitchToStorefront}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold transition-all border border-stone-700 cursor-pointer shadow-xs"
                title="ไปดูการแสดงผลของหน้าร้านที่ลูกค้าเห็น"
              >
                <Eye className="w-3.5 h-3.5 text-rose-300" />
                <span className="hidden sm:inline">ดูหน้าบ้านลูกค้า</span>
              </button>

              <button
                type="button"
                onClick={onLogoutAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-all border border-rose-800/50 cursor-pointer"
                title="ออกจากระบบแอดมินและกลับสู่หน้าร้าน"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ออกจากระบบหลังบ้าน</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Ribbon */}
        <div className="bg-stone-900/90 border-t border-stone-800 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-1.5 gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>ภาพรวมแดชบอร์ด</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>คำสั่งเช่าของลูกค้า</span>
                {pendingOrders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-400 text-neutral-950 text-[10px] font-mono font-bold">
                    {pendingOrders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>ตู้เสื้อผ้า & จัดการชุด ({myListings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('deposits')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'deposits'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>คืนเงินมัดจำ & ตรวจสภาพ</span>
                {returningOrders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-mono font-bold">
                    {returningOrders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'customers'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>ทะเบียนลูกค้า</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ตั้งค่าร้านค้า</span>
              </button>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-stone-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5 text-rose-700" />
                <span>+ ลงชุดใหม่</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN ADMIN WORKSPACE */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-neutral-950 via-stone-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>SETISTA BOUTIQUE BACK-OFFICE</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  สวัสดี {adminName}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-light">
                  ระบบหลังบ้านพร้อมสำหรับการดูแลลูกค้าและคำสั่งเช่าชุด มี {pendingOrders.length} คำสั่งเช่าที่ต้องตรวจสอบ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenCreateModal}
                  className="px-5 py-3 rounded-2xl bg-white text-neutral-950 font-bold text-xs hover:bg-stone-100 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-rose-700" />
                  <span>+ ลงเสื้อผ้า/ชุดใหม่</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-rose-300" />
                  <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ลิงก์หน้าร้าน'}</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>รายได้ค่าเช่ารวม</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl font-bold text-neutral-950 font-mono tabular-nums">
                    ฿{totalRentalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    จาก {allBookings.length} ออเดอร์เช่า
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>คำสั่งเช่ารออนุมัติ</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
                    {pendingOrders.length}
                  </span>
                  {pendingOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                      ต้องสอยทรง & ส่ง
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] text-rose-700 font-medium hover:underline mt-1 block"
                >
                  ดูรายการรออนุมัติ →
                </button>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>ชุดกำลังสวมใส่ในงาน</span>
                  <Shirt className="w-4 h-4 text-rose-600" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
                    {activeRentals.length}
                  </span>
                  <span className="text-xs text-stone-400">ชุด</span>
                </div>
                <span className="text-[11px] text-stone-400 block mt-1">
                  อยู่กับลูกค้าขณะนี้
                </span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>เงินมัดจำในระบบ</span>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl font-bold text-neutral-950 font-mono tabular-nums">
                    ฿{totalDepositHeld.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    คืนลูกค้าเมื่อส่งชุดกลับ
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Alerts */}
            {pendingOrders.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-amber-200/80 text-amber-950 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <strong className="font-bold text-sm block">
                      มี {pendingOrders.length} คำสั่งเช่าที่ลูกค้าเพิ่งจองเข้ามา!
                    </strong>
                    <span className="text-amber-800">
                      กรุณาตรวจสอบคิวสอยแก้ทรงและกดยืนยันเพื่อจัดส่งชุดให้ทันวันงานของลูกค้า
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderFilter('pending');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-800 transition-colors whitespace-nowrap cursor-pointer self-start sm:self-auto"
                >
                  จัดการออเดอร์ทันที →
                </button>
              </div>
            )}

            {/* Two Column Section: Recent Bookings & Wardrobe Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Bookings */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      คำสั่งเช่าล่าสุด
                    </h3>
                    <p className="text-xs text-stone-500">
                      รายการออเดอร์ล่าสุดที่ลูกค้าทำการจองผ่านหน้าบ้าน
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-rose-700 font-bold hover:underline"
                  >
                    ดูทั้งหมด ({allBookings.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {allBookings.slice(0, 4).map((booking) => {
                    const badge = getOrderStatusBadge(booking.status);
                    return (
                      <div
                        key={booking.id}
                        className="p-3.5 rounded-xl border border-stone-100 hover:border-stone-300 bg-stone-50/60 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={booking.imageUrl}
                            alt={booking.itemTitle}
                            className="w-12 h-14 rounded-lg object-cover bg-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">
                              {booking.itemTitle}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                              <span>ลูกค้า: <strong className="text-neutral-800">{booking.renterName}</strong></span>
                              <span>•</span>
                              <span>ไซส์ {booking.selectedSize}</span>
                              <span>•</span>
                              <span>{booking.startDate} ถึง {booking.endDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color} mb-1`}>
                            {badge.label}
                          </span>
                          <span className="block font-mono text-xs font-bold text-neutral-900">
                            ฿{booking.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Wardrobe Quick Status */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    สถานะตู้เสื้อผ้าของร้าน
                  </h3>
                  <p className="text-xs text-stone-500">
                    ชุดเซ็ททั้งหมดที่เปิดให้เช่าหน้าร้าน
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-600">ชุดทั้งหมดในระบบ</span>
                    <strong className="font-mono text-sm text-neutral-900">{totalSets} ชุด</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span>พร้อมให้ลูกค้าเช่าทันที</span>
                    <strong className="font-mono text-sm">{availableSets} ชุด</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span>ปิดรับจองชั่วคราว (ซัก/ซ่อม)</span>
                    <strong className="font-mono text-sm text-neutral-900">{totalSets - availableSets} ชุด</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="w-full py-2.5 rounded-xl bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    จัดการตู้เสื้อผ้า & สต็อกชุด →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDERS MANAGEMENT PIPELINE */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                  จัดการคำสั่งเช่าของลูกค้า (Rental Orders Pipeline)
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  ติดตามสถานะการสอยทรง จัดส่งพัสดุ วันใช้งาน และการโอนคืนเงินมัดจำ
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 text-xs overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'all' ? 'bg-neutral-950 text-white font-bold' : 'text-stone-600 hover:text-neutral-950'
                  }`}
                >
                  ทั้งหมด ({allBookings.length})
                </button>
                <button
                  onClick={() => setOrderFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'pending' ? 'bg-neutral-950 text-white font-bold' : 'text-stone-600 hover:text-neutral-950'
                  }`}
                >
                  รออนุมัติ ({pendingOrders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('active')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'active' ? 'bg-neutral-950 text-white font-bold' : 'text-stone-600 hover:text-neutral-950'
                  }`}
                >
                  กำลังใส่อยู่ ({activeRentals.length})
                </button>
                <button
                  onClick={() => setOrderFilter('returning')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'returning' ? 'bg-neutral-950 text-white font-bold' : 'text-stone-600 hover:text-neutral-950'
                  }`}
                >
                  รอตรวจรับคืน ({returningOrders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'completed' ? 'bg-neutral-950 text-white font-bold' : 'text-stone-600 hover:text-neutral-950'
                  }`}
                >
                  เสร็จสิ้น ({completedOrders.length})
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่อลูกค้า, เบอร์โทรศัพท์, หรือชื่อชุด..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:outline-rose-900"
              />
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-200">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-1" />
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  ไม่พบคำสั่งเช่าในหมวดนี้
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                  เมื่อลูกค้าเข้ามาเลือกเช่าชุดจากหน้าบ้าน คำสั่งซื้อจะเข้ามาที่นี่โดยอัตโนมัติ
                </p>
                <button
                  onClick={onSwitchToStorefront}
                  className="mt-4 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  สลับไปดูหน้าบ้านลูกค้า
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((booking) => {
                  const badge = getOrderStatusBadge(booking.status);

                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col gap-5 hover:border-stone-300 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row gap-5 items-start justify-between">
                        {/* Left: Thumbnail & Details */}
                      <div className="flex gap-4 w-full lg:w-auto">
                        <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-stone-200">
                          <img
                            src={booking.imageUrl}
                            alt={booking.itemTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-[11px] font-mono text-stone-400">#{booking.id}</span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-mono font-bold text-[11px]">
                              ไซส์ {booking.selectedSize}
                            </span>
                          </div>

                          <h4 className="font-serif text-base font-bold text-neutral-900 truncate">
                            {booking.itemTitle}
                          </h4>

                          {/* Customer Information */}
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600">
                            <div>
                              <span className="text-stone-400">ลูกค้า: </span>
                              <strong className="text-neutral-900">{booking.renterName}</strong>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-stone-400">เบอร์โทร: </span>
                              <a 
                                href={`tel:${booking.renterPhone}`}
                                className="font-mono text-rose-800 font-semibold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{booking.renterPhone}</span>
                              </a>
                            </div>

                            <div>
                              <span className="text-stone-400">ช่วงเวลาเช่า: </span>
                              <span className="font-medium text-neutral-800">{booking.startDate} ถึง {booking.endDate} ({booking.totalDays} วัน)</span>
                            </div>

                            <div>
                              <span className="text-stone-400">วิธีจัดส่ง: </span>
                              <span className="text-neutral-800">{booking.deliveryMethod}</span>
                            </div>
                          </div>

                          {/* Alteration Notes */}
                          {booking.alterationNotes && (
                            <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-1.5">
                              <Scissors className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>
                                <strong>โน้ตสอยเก็บทรงของลูกค้า:</strong> {booking.alterationNotes}
                              </span>
                            </div>
                          )}

                          {/* Prominent Customer Delivery Address Card */}
                          <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-neutral-800 flex items-center gap-1.5 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                                <span>ที่อยู่จัดส่งพัสดุ & สถานที่รับชุด:</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const textToCopy = `ชื่อผู้รับ: ${booking.renterName}\nเบอร์โทร: ${booking.renterPhone}\nที่อยู่: ${booking.deliveryAddress || 'รับชุดที่สตูดิโอ'}${booking.shippingNotes ? `\nหมายเหตุ: ${booking.shippingNotes}` : ''}`;
                                  navigator.clipboard.writeText(textToCopy);
                                  showToast('คัดลอกที่อยู่พิมพ์ใบปะหน้าพัสดุเรียบร้อย 📋');
                                }}
                                className="text-[10px] text-stone-600 hover:text-neutral-900 bg-white hover:bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Copy className="w-3 h-3 text-stone-500" />
                                <span>คัดลอกที่อยู่จัดส่ง</span>
                              </button>
                            </div>
                            <p className="text-neutral-900 leading-relaxed font-sans font-medium">
                              {booking.deliveryAddress || 'รับชุดที่สตูดิโอทองหล่อ'}
                            </p>
                            {booking.shippingNotes && (
                              <p className="text-[11px] text-stone-500 pt-0.5 flex items-center gap-1">
                                <span className="text-rose-800 font-semibold">หมายเหตุไรเดอร์:</span>
                                <span>{booking.shippingNotes}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment & Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-[11px] text-stone-400 block font-mono">ยอดรับชำระ (รวมมัดจำ):</span>
                          <span className="font-serif text-xl font-bold font-mono text-neutral-950 tabular-nums">
                            ฿{booking.totalAmount.toLocaleString()}
                          </span>
                          <div className="text-[10px] text-stone-500">
                            ค่าเช่า ฿{booking.rentalFee.toLocaleString()} + มัดจำ ฿{booking.depositFee.toLocaleString()}
                          </div>
                        </div>

                        {/* Step Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Chat with Customer about this contract */}
                          {onOpenChatWithCustomer && (
                            <button
                              type="button"
                              onClick={() => {
                                const foundItem = myListings.find((i) => i.id === booking.itemId) || {
                                  id: booking.itemId,
                                  title: booking.itemTitle,
                                  brand: booking.brand,
                                  deposit: booking.depositFee,
                                  pricePerDay: Math.round(booking.rentalFee / (booking.totalDays || 1)),
                                  imageUrl: booking.imageUrl
                                } as WomenSetItem;
                                onOpenChatWithCustomer(foundItem, booking);
                              }}
                              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-neutral-900 text-xs font-semibold border border-stone-300 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
                              title="เปิดแชทคุยสัญญากับลูกค้ารายนี้"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-rose-700" />
                              <span>💬 คุยสัญญากับลูกค้า</span>
                            </button>
                          )}
                          {booking.status === 'pending_owner_approval' && (
                            <button
                              onClick={() => {
                                onUpdateBookingStatus(booking.id, 'fitting_scheduled');
                                showToast(`อนุมัติคำสั่งเช่า #${booking.id} เรียบร้อยแล้ว`);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>✓ อนุมัติคำสั่งเช่า</span>
                            </button>
                          )}

                          {booking.status === 'fitting_scheduled' && (
                            <button
                              onClick={() => {
                                onUpdateBookingStatus(booking.id, 'dispatched');
                                showToast(`อัปเดตสถานะจัดส่งชุดให้ออเดอร์ #${booking.id} แล้ว`);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <Truck className="w-3.5 h-3.5 text-sky-400" />
                              <span>สอยทรงเสร็จ & ส่งชุดให้ลูกค้า</span>
                            </button>
                          )}

                          {booking.status === 'dispatched' && (
                            <button
                              onClick={() => {
                                onUpdateBookingStatus(booking.id, 'active_renting');
                                showToast(`อัปเดต: ลูกค้ารับชุด #${booking.id} เรียบร้อยแล้ว`);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>ลูกค้ารับชุดแล้ว (เริ่มนับวันงาน)</span>
                            </button>
                          )}

                          {(booking.status === 'active_renting' || booking.status === 'returning') && (
                            <button
                              onClick={() => {
                                onUpdateBookingStatus(booking.id, 'completed');
                                showToast(`ตรวจรับชุดและโอนคืนมัดจำ ฿${booking.depositFee.toLocaleString()} เรียบร้อยแล้ว`);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>ตรวจรับชุด & โอนคืนมัดจำ ฿{booking.depositFee.toLocaleString()}</span>
                            </button>
                          )}

                          {booking.status === 'completed' && (
                            <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>คืนมัดจำและปิดรายการแล้ว</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Microinteraction Interactive Lifecycle Progress Bar (ข้อความนี้ให้เห็นเฉพาะแอดมิน) */}
                    <div className="pt-3 border-t border-stone-100">
                      <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                        <div className={`p-1.5 rounded-lg transition-colors ${badge.step >= 1 ? 'bg-rose-50 text-rose-900 font-bold' : 'text-stone-400'}`}>
                          <span>1. ยืนยันออเดอร์</span>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-colors ${badge.step >= 2 ? 'bg-rose-50 text-rose-900 font-bold' : 'text-stone-400'}`}>
                          <span>2. สอยทรง & ส่งพัสดุ</span>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-colors ${badge.step >= 3 ? 'bg-rose-50 text-rose-900 font-bold' : 'text-stone-400'}`}>
                          <span>3. สวมใส่ในงาน</span>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-colors ${badge.step >= 4 ? 'bg-rose-50 text-rose-900 font-bold' : 'text-stone-400'}`}>
                          <span>4. ส่งคืนชุด</span>
                        </div>
                        <div className={`p-1.5 rounded-lg transition-colors ${badge.step >= 5 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-400'}`}>
                          <span>5. คืนมัดจำ 100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVENTORY & SETS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                  ตู้เสื้อผ้า & รายการชุดที่ลงหน้าร้าน ({myListings.length})
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  จัดการชุดที่เปิดให้ลูกค้าเช่า สามารถแก้ไขราคา อัปเดตรูป หรือสลับเปิด/ปิดสถานะได้ตลอดเวลา
                </p>
              </div>

              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-rose-300" />
                <span>+ ลงเสื้อผ้า/ชุดใหม่</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={inventorySearchQuery}
                  onChange={(e) => setInventorySearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อชุด, แบรนด์, สี..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:outline-rose-900"
                />
              </div>

              <select
                value={inventoryCategoryFilter}
                onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:outline-rose-900"
              >
                <option value="all">ทุกหมวดหมู่โอกาส</option>
                <option value="wedding">งานแต่ง & กาลาดินเนอร์</option>
                <option value="tweed">ผ้าทวีตคุณหนู</option>
                <option value="vacation">เที่ยวทะเล & รีสอร์ท</option>
                <option value="cafe">คาเฟ่ & บรันช์</option>
                <option value="suit">สูท & สมาร์ทบอส</option>
                <option value="thai_modern">ไทยโมเดิร์น</option>
              </select>
            </div>

            {/* Grid of Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex gap-4 items-start justify-between"
                >
                  <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-stone-200">
                    <ItemVisual
                      imageUrl={item.imageUrl}
                      title={item.title}
                      categoryNameTh={item.categoryNameTh}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isAvailable 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {item.isAvailable ? '✓ เปิดให้เช่าหน้าร้าน' : '⏸ พักรับจอง'}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">ID: {item.id}</span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">
                      {item.title}
                    </h4>

                    <div className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {item.brand} • {item.setTypeTh}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="font-bold text-neutral-950">
                        ฿{item.pricePerDay} <span className="font-normal text-stone-400">/วัน</span>
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-600">มัดจำ ฿{item.deposit.toLocaleString()}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-600">ไซส์ {item.availableSizes.join(', ')}</span>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleAvailability(item.id)}
                        className={`text-xs flex items-center gap-1 cursor-pointer font-medium ${
                          item.isAvailable ? 'text-amber-700 hover:text-amber-800' : 'text-emerald-700 hover:text-emerald-800'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                            <span>ปิดรับจอง</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-stone-400" />
                            <span>เปิดรับจอง</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditListing(item)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                          <span>แก้ไข</span>
                        </button>

                        <button
                          onClick={() => setItemToDelete(item)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="ลบชุดนี้ออกจากร้าน"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DEPOSITS & ESCROW REFUNDS */}
        {/* ======================================================== */}
        {activeTab === 'deposits' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                ระบบจัดการเงินมัดจำ & การตรวจสภาพชุด (Deposit Escrow)
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                เมื่อลูกค้าส่งชุดคืนและผ่านการตรวจสอบสภาพ สามารถกดโอนคืนมัดจำกลับสู่บัญชี/พร้อมเพย์ของลูกค้าได้ทันที
              </p>
            </div>

            {/* Escrow summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500">เงินมัดจำที่ถือครองขณะนี้</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 font-mono block mt-2">
                  ฿{totalDepositHeld.toLocaleString()}
                </span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500">ชุดที่ลูกค้านำส่งคืนแล้ว (รอตรวจรับ)</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 font-mono block mt-2">
                  {returningOrders.length} ออเดอร์
                </span>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-xs text-stone-500">เงินมัดจำที่โอนคืนแล้วเสร็จสิ้น</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 font-mono block mt-2">
                  {completedOrders.length} ออเดอร์
                </span>
              </div>
            </div>

            {/* Deposit Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-stone-200 font-serif font-bold text-sm text-neutral-900">
                รายการเงินมัดจำจำแนกตามออเดอร์
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {allBookings.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-neutral-900">{b.renterName}</strong>
                        <span className="text-stone-400 font-mono text-[11px]">({b.renterPhone})</span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                          #{b.id}
                        </span>
                      </div>
                      <span className="text-stone-500 block mt-0.5">
                        ชุด: {b.itemTitle} • ไซส์ {b.selectedSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-stone-400 text-[11px] block">เงินมัดจำ</span>
                        <span className="font-mono font-bold text-sm text-neutral-950">
                          ฿{b.depositFee.toLocaleString()}
                        </span>
                      </div>

                      {b.status === 'completed' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          ✓ โอนคืนแล้ว
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onUpdateBookingStatus(b.id, 'completed');
                            showToast(`ยืนยันโอนเงินมัดจำ ฿${b.depositFee.toLocaleString()} คืนให้คุณ ${b.renterName} เรียบร้อยแล้ว`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
                        >
                          ตรวจสภาพ & โอนคืน ฿{b.depositFee.toLocaleString()}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CUSTOMER CRM DATABASE */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                ทะเบียนลูกค้าที่เข้ามาเช่าชุด (Customer CRM)
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                รายชื่อ ประวัติการเช่า และช่องทางติดต่อลูกค้าของร้าน SETISTA
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">ชื่อลูกค้า</th>
                    <th className="p-3.5">เบอร์โทรศัพท์</th>
                    <th className="p-3.5">ชุดที่เช่าล่าสุด</th>
                    <th className="p-3.5">ไซส์</th>
                    <th className="p-3.5">ยอดรวม</th>
                    <th className="p-3.5">ติดต่อ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60">
                      <td className="p-3.5 font-bold text-neutral-900">{b.renterName}</td>
                      <td className="p-3.5 font-mono text-stone-600">{b.renterPhone}</td>
                      <td className="p-3.5 text-stone-800">{b.itemTitle}</td>
                      <td className="p-3.5 font-bold text-rose-800">{b.selectedSize}</td>
                      <td className="p-3.5 font-mono font-bold text-neutral-950">฿{b.totalAmount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <a
                          href={`tel:${b.renterPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-rose-700" />
                          <span>โทร</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: STORE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                ตั้งค่าข้อมูลร้านค้า & นโยบายหลังบ้าน
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                กำหนดที่อยู่ส่งคืนชุด เลขบัญชีรับโอน และนโยบายการสอยทรงฟรี
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                  ชื่อร้าน / สตูดิโอ
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                    เบอร์โทรศัพท์ร้าน
                  </label>
                  <input
                    type="text"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                    LINE Official ID
                  </label>
                  <input
                    type="text"
                    value={storeSettings.lineId}
                    onChange={(e) => setStoreSettings({ ...storeSettings, lineId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                  ที่อยู่สำหรับให้ลูกค้าจัดส่งชุดคืน (ระบุบน e-Contract)
                </label>
                <textarea
                  rows={2}
                  value={storeSettings.returnAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, returnAddress: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                    บัญชีธนาคารรับเงินมัดจำ
                  </label>
                  <input
                    type="text"
                    value={storeSettings.bankAccount}
                    onChange={(e) => setStoreSettings({ ...storeSettings, bankAccount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1 font-mono">
                    เบอร์พร้อมเพย์ PromptPay
                  </label>
                  <input
                    type="text"
                    value={storeSettings.promptPay}
                    onChange={(e) => setStoreSettings({ ...storeSettings, promptPay: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:outline-rose-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  บันทึกการตั้งค่าร้านค้า
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* In-App Delete Outfit Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in text-left">
          <div 
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                ยืนยันการลบชุดออกจากร้าน?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                คุณกำลังจะลบชุด <strong className="text-neutral-900 font-medium">"{itemToDelete.title}"</strong> ออกจากระบบ ชุดนี้จะถูกถอดออกจากตู้เสื้อผ้าและหน้าบ้านลูกค้าทันที
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                <img
                  src={itemToDelete.imageUrl}
                  alt={itemToDelete.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs min-w-0">
                <p className="font-bold text-neutral-900 truncate">{itemToDelete.title}</p>
                <p className="text-stone-400">{itemToDelete.brand}</p>
                <p className="text-rose-900 font-bold font-mono">฿{itemToDelete.pricePerDay}/วัน</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onDeleteListing(itemToDelete.id);
                  showToast(`ลบชุด "${itemToDelete.title}" ออกจากร้านเรียบร้อยแล้ว`);
                  setItemToDelete(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันลบชุดนี้ออกจากระบบ</span>
              </button>

              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
