import React, { useState } from 'react';
import { WomenSetItem, SetBooking } from '../types/rental';
import { ItemVisual } from '../components/ItemVisual';
import { 
  PlusCircle, Sparkles, CheckCircle2, RotateCcw, 
  Scissors, Phone, Copy, Share2, ToggleLeft, ToggleRight, 
  Trash2, ShieldCheck, Clock, Eye, AlertCircle, ShoppingBag, 
  Truck, DollarSign, TrendingUp, UserCheck, Calendar, ArrowRight, Edit3
} from 'lucide-react';

interface OwnerPortalViewProps {
  myListings: WomenSetItem[];
  allBookings: SetBooking[];
  onOpenCreateModal: () => void;
  onEditListing: (item: WomenSetItem) => void;
  onToggleAvailability: (itemId: string) => void;
  onDeleteListing: (itemId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  onSwitchToCustomerView: () => void;
  showToast: (msg: string) => void;
}

export const OwnerPortalView: React.FC<OwnerPortalViewProps> = ({
  myListings,
  allBookings,
  onOpenCreateModal,
  onEditListing,
  onToggleAvailability,
  onDeleteListing,
  onUpdateBookingStatus,
  onSwitchToCustomerView,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'revenue' | 'share'>('orders');
  const [copiedLink, setCopiedLink] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // Stats
  const totalSets = myListings.length;
  const availableSets = myListings.filter(i => i.isAvailable).length;
  const pendingOrders = allBookings.filter(b => b.status === 'pending_owner_approval' || b.status === 'fitting_scheduled');
  const totalRentalRevenue = allBookings.reduce((sum, b) => sum + b.rentalFee, 0);
  const totalDepositHeld = allBookings.filter(b => b.status !== 'completed').reduce((sum, b) => sum + b.depositFee, 0);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?view=customer`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('คัดลอกลิงก์หน้าร้านเรียบร้อยแล้ว ส่งให้ลูกค้าใน LINE / IG ได้ทันที!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getOrderStatusBadge = (status: SetBooking['status']) => {
    switch (status) {
      case 'pending_owner_approval':
        return {
          label: 'ลูกค้าจองใหม่ (รออนุมัติ)',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          dot: 'bg-amber-500'
        };
      case 'fitting_scheduled':
        return {
          label: 'อนุมัติแล้ว (เตรียมสอยทรง & ส่ง)',
          color: 'text-rose-800 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'dispatched':
        return {
          label: 'จัดส่งแล้ว / ลูกค้ารับของแล้ว',
          color: 'text-sky-800 bg-sky-50 border-sky-200',
          dot: 'bg-sky-500'
        };
      case 'active_renting':
        return {
          label: 'ลูกค้ากำลังสวมใส่ในงาน',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'returning':
        return {
          label: 'ส่งคืนแล้ว (รอตรวจรับ & คืนมัดจำ)',
          color: 'text-purple-800 bg-purple-50 border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'completed':
        return {
          label: 'เสร็จสิ้น (คืนมัดจำแล้ว)',
          color: 'text-neutral-700 bg-stone-100 border-stone-200',
          dot: 'bg-stone-500'
        };
      default:
        return {
          label: 'ยกเลิก',
          color: 'text-rose-700 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500'
        };
    }
  };

  const filteredOrders = allBookings.filter((b) => {
    if (orderFilter === 'pending') return b.status === 'pending_owner_approval' || b.status === 'fitting_scheduled';
    if (orderFilter === 'active') return b.status === 'dispatched' || b.status === 'active_renting';
    if (orderFilter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left">
      {/* Top Owner Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2 border border-rose-400/30">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>PORTAL: เจ้าของร้าน (SHOP OWNER)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            แผงควบคุมร้านเช่าเสื้อผ้าของคุณ
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-light">
            คุณสามารถลงเสื้อผ้าเอง จัดการออเดอร์ที่ลูกค้าเลือกเช่าเข้ามา สอยแก้ทรง และโอนคืนเงินมัดจำ
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-white text-neutral-950 font-bold text-xs hover:bg-stone-100 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-rose-700" />
            <span>+ ลงเสื้อ/ชุดใหม่</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-rose-300" />
            <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ลิงก์ให้ลูกค้า'}</span>
          </button>

          <button
            onClick={onSwitchToCustomerView}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span>สลับไปมุมมองลูกค้าหน้าร้าน</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">ชุดที่คุณลงไว้</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
              {totalSets}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              (พร้อมเช่า {availableSets})
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">ออเดอร์เช่าของลูกค้า</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
              {allBookings.length}
            </span>
            {pendingOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                ใหม่ {pendingOrders.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">รายได้ค่าเช่ารวม</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-neutral-950 font-mono tabular-nums">
              ฿{totalRentalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">เงินมัดจำในระบบ</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-neutral-950 font-mono tabular-nums">
              ฿{totalDepositHeld.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-4 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>คำสั่งเช่าของลูกค้า ({allBookings.length})</span>
          {pendingOrders.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ตู้เสื้อผ้า / จัดการชุดที่ลง ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'revenue'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>สรุปบัญชี & การคืนมัดจำ</span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'share'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>ลิงก์หน้าร้านสำหรับลูกค้า</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Sub-filter for orders */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              รายการคำสั่งเช่าที่ลูกค้าเลือกเช่าชุดเข้ามา
            </h2>

            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'all' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                ทั้งหมด ({allBookings.length})
              </button>
              <button
                onClick={() => setOrderFilter('pending')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'pending' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                รอจัดเตรียม ({pendingOrders.length})
              </button>
              <button
                onClick={() => setOrderFilter('active')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'active' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                กำลังใส่อยู่
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  orderFilter === 'completed' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                คืนแล้ว
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 shadow-2xs">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-1" />
              <h3 className="font-serif text-base font-bold text-neutral-900">
                ไม่พบคำสั่งเช่าในหมวดนี้
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                เมื่อลูกค้าเข้ามากดเลือกเช่าชุดจากหน้าร้าน ออเดอร์จะปรากฏที่นี่ทันที
              </p>
              <button
                onClick={onSwitchToCustomerView}
                className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                ไปทดลองสั่งเช่าในมุมมองลูกค้า
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((booking) => {
                const badge = getOrderStatusBadge(booking.status);

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col lg:flex-row gap-5 items-start justify-between"
                  >
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
                              <strong>ลูกค้าขอสอยเก็บทรง:</strong> {booking.alterationNotes}
                            </span>
                          </div>
                        )}

                        {booking.accessoryName && (
                          <div className="mt-1 text-xs text-rose-800 font-medium">
                            ✨ พร็อพเสริม: {booking.accessoryName}
                          </div>
                        )}
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

                      {/* Step Action Buttons for Shop Owner */}
                      <div className="flex flex-wrap items-center gap-2">
                        {booking.status === 'pending_owner_approval' && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'fitting_scheduled')}
                            className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>✓ อนุมัติการเช่า & รับออเดอร์</span>
                          </button>
                        )}

                        {booking.status === 'fitting_scheduled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'dispatched')}
                            className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5 text-sky-400" />
                            <span>สอยทรงเสร็จ & ส่งชุดให้ลูกค้า</span>
                          </button>
                        )}

                        {booking.status === 'dispatched' && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'active_renting')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ลูกค้ารับชุดแล้ว (เริ่มนับวันงาน)</span>
                          </button>
                        )}

                        {(booking.status === 'active_renting' || booking.status === 'returning') && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                            className="px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>ได้รับชุดคืน & โอนคืนมัดจำ ฿{booking.depositFee.toLocaleString()}</span>
                          </button>
                        )}

                        {booking.status === 'completed' && (
                          <span className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>คืนมัดจำและปิดรายการแล้ว</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                ตู้เสื้อผ้า & ชุดเซ็ทที่คุณลงไว้ ({myListings.length})
              </h2>
              <p className="text-xs text-stone-500 font-light">
                ชุดทั้งหมดนี้จะแสดงบนหน้าร้านให้ลูกค้าเลือกเช่า คุณสามารถเปิด/ปิดสถานะ หรือลงชุดใหม่ได้ตลอดเวลา
              </p>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-rose-300" />
              <span>+ ลงเสื้อ/ชุดใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex gap-4 items-center justify-between"
              >
                <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-stone-200">
                  <ItemVisual
                    imageUrl={item.imageUrl}
                    title={item.title}
                    brand={item.brand}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-0.5">
                    <span className="font-semibold text-rose-800">{item.brand}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-700 font-bold">฿{item.pricePerDay}/วัน</span>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-neutral-900 truncate">
                    {item.title}
                  </h3>

                  <div className="mt-1 text-xs text-stone-500">
                    <span>ไซส์: {item.availableSizes.join(', ')} · มัดจำ: ฿{item.deposit.toLocaleString()}</span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-neutral-950 cursor-pointer"
                    >
                      {item.isAvailable ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-800 font-semibold">เปิดให้ลูกค้าเช่าอยู่</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-stone-400" />
                          <span className="text-stone-500">ปิดการจองชั่วคราว</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => onEditListing(item)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="แก้ไขรายละเอียดชุด"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                        <span>แก้ไข</span>
                      </button>

                      <button
                        onClick={() => onDeleteListing(item.id)}
                        className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer p-1"
                        title="ลบชุดนี้ออกจากร้าน"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only sm:not-sr-only">ลบ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REVENUE & REFUND ACCOUNTING */}
      {activeTab === 'revenue' && (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-stone-200">
          <h2 className="font-serif text-lg font-bold text-neutral-900">
            สรุปบัญชีรายรับ & การคืนเงินประกันมัดจำ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500">รายได้ค่าเช่าสุทธิ</span>
              <p className="font-serif text-2xl font-bold text-neutral-950 mt-1 font-mono">
                ฿{totalRentalRevenue.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-700">คำนวณจาก {allBookings.length} รายการเช่า</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500">เงินมัดจำที่ถือไว้ชั่วคราว (Escrow)</span>
              <p className="font-serif text-2xl font-bold text-neutral-950 mt-1 font-mono">
                ฿{totalDepositHeld.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">โอนคืนลูกค้าเมื่อได้รับชุดตรวจรับ</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500">อัตราการคืนชุดสมบูรณ์</span>
              <p className="font-serif text-2xl font-bold text-neutral-950 mt-1 font-mono">
                100%
              </p>
              <span className="text-[10px] text-rose-700">ไม่มีประวัติความเสียหาย</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h3 className="font-bold text-sm text-neutral-900 mb-3">บันทึกการทำธุรกรรมล่าสุด</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="py-2">รหัสออเดอร์</th>
                    <th className="py-2">ลูกค้า</th>
                    <th className="py-2">ชุดเซ็ท</th>
                    <th className="py-2">ค่าเช่า</th>
                    <th className="py-2">เงินมัดจำ</th>
                    <th className="py-2">สถานะมัดจำ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2.5 font-mono text-stone-500">#{b.id}</td>
                      <td className="py-2.5 font-medium text-neutral-900">{b.renterName}</td>
                      <td className="py-2.5 truncate max-w-[180px]">{b.itemTitle}</td>
                      <td className="py-2.5 font-mono">฿{b.rentalFee.toLocaleString()}</td>
                      <td className="py-2.5 font-mono">฿{b.depositFee.toLocaleString()}</td>
                      <td className="py-2.5">
                        {b.status === 'completed' ? (
                          <span className="text-emerald-700 font-medium">✓ คืนมัดจำแล้ว</span>
                        ) : (
                          <span className="text-amber-700 font-medium">● ถือไว้ชั่วคราว</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SHARE STOREFRONT LINK */}
      {activeTab === 'share' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
            <Share2 className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900">
              แชร์ลิงก์หน้าร้านของคุณให้ลูกค้า
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto font-light">
              ส่งลิงก์นี้ให้ลูกค้าใน LINE, Instagram, Facebook เพื่อให้ลูกค้าเข้ามาเลือกดูชุดที่คุณลงไว้และกดเช่าได้ทันที
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs">
            <span className="font-mono text-stone-700 truncate">
              {window.location.origin}/?view=customer
            </span>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-neutral-950 text-white rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
            </button>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onSwitchToCustomerView}
              className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>ทดลองเปิดดูหน้าร้านในมุมมองลูกค้า</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
