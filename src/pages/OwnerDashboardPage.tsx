import React, { useState } from 'react';
import { WomenSetItem, SetBooking } from '../types/rental';
import { ItemVisual } from '../components/ItemVisual';
import { 
  PlusCircle, Sparkles, CheckCircle2, RotateCcw, 
  Scissors, Phone, Copy, Share2, ToggleLeft, ToggleRight, 
  Trash2, ShieldCheck, Clock, Eye, AlertCircle, ShoppingBag, Truck
} from 'lucide-react';

interface OwnerDashboardViewProps {
  myListings: WomenSetItem[];
  allBookings: SetBooking[];
  onOpenCreateModal: () => void;
  onToggleAvailability: (itemId: string) => void;
  onDeleteListing: (itemId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  onSwitchToStorefront: () => void;
  showToast: (msg: string) => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  myListings,
  allBookings,
  onOpenCreateModal,
  onToggleAvailability,
  onDeleteListing,
  onUpdateBookingStatus,
  onSwitchToStorefront,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [copiedLink, setCopiedLink] = useState(false);

  // Statistics
  const totalSets = myListings.length;
  const availableSets = myListings.filter(i => i.isAvailable).length;
  const pendingOrdersCount = allBookings.filter(b => b.status === 'pending_owner_approval' || b.status === 'fitting_scheduled').length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + b.rentalFee, 0);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?shop=my-closet`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    showToast('คัดลอกลิงก์ร้านค้าเรียบร้อย สามารถส่งให้ลูกค้าใน LINE / IG ได้ทันที!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getOrderStatusBadge = (status: SetBooking['status']) => {
    switch (status) {
      case 'pending_owner_approval':
        return {
          label: 'ลูกค้าจองใหม่ (รอร้านอนุมัติ)',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          dot: 'bg-amber-500'
        };
      case 'fitting_scheduled':
        return {
          label: 'อนุมัติแล้ว (สอยทรง & เตรียมส่ง)',
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
          label: 'ลูกค้ากำลังใส่ไปงาน / ทริป',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'returning':
        return {
          label: 'ส่งคืนแล้ว (รอตรวจชุด & คืนมัดจำ)',
          color: 'text-purple-800 bg-purple-50 border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'completed':
        return {
          label: 'คืนมัดจำแล้ว (เสร็จสิ้น)',
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left">
      {/* Top Banner with Storefront URL Share */}
      <div className="bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-mono uppercase tracking-wider mb-2 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>OWNER STOREFRONT MANAGER</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            ระบบจัดการร้านเช่าชุดของคุณ
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-light">
            คุณสามารถลงเสื้อผ้าเอง จัดการคำสั่งเช่าของลูกค้า สอยเก็บทรง และติดตามการคืนเงินมัดจำได้ครบจบที่นี่
          </p>
        </div>

        {/* Action Buttons: Add Item & Share Storefront */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-white text-neutral-950 font-bold text-xs hover:bg-stone-100 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-rose-700" />
            <span>+ ลงเสื้อ/ชุดใหม่</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-rose-300" />
            <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ลิงก์ให้ลูกค้า'}</span>
          </button>

          <button
            onClick={onSwitchToStorefront}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>ดูหน้าร้านลูกค้า</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">ชุดที่คุณลงไว้ทั้งหมด</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
              {totalSets}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              (พร้อมเช่า {availableSets} ชุด)
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">ออเดอร์ที่ลูกค้าเช่าเข้ามา</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-neutral-950 tabular-nums">
              {allBookings.length}
            </span>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                รอจัดการ {pendingOrdersCount}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">ยอดรายได้ค่าเช่ารวม</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-neutral-950 font-mono tabular-nums">
              ฿{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 block">บริการดูแลลูกค้า</span>
          <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>สอยเก็บทรงฟรี & ซักแห้งให้</span>
          </div>
        </div>
      </div>

      {/* Main Tabs: Orders vs Inventory */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>คำสั่งเช่าของลูกค้า ({allBookings.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ตู้เสื้อผ้า / จัดการชุดที่ลง ({myListings.length})</span>
        </button>
      </div>

      {/* Tab 1: Incoming Customer Rental Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              รายการคำสั่งเช่าที่ลูกค้าเลือกเช่าชุดเข้ามา
            </h3>
            <span className="text-xs text-stone-500">
              คลิกอัปเดตขั้นตอนเพื่อแจ้งให้ลูกค้าทราบ
            </span>
          </div>

          {allBookings.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 shadow-2xs">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-1" />
              <h4 className="font-serif text-base font-bold text-neutral-900">
                ยังไม่มีคำสั่งเช่าเข้ามาในขณะนี้
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                ลงเสื้อผ้าของคุณให้สวยงาม แล้วแชร์ลิงก์หน้าร้านให้ลูกค้าเลือกเช่าได้เลย
              </p>
              <button
                onClick={onOpenCreateModal}
                className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                + ลงเสื้อผ้าชุดใหม่
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {allBookings.map((booking) => {
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
                            <span className="text-stone-400">การจัดส่ง: </span>
                            <span className="text-neutral-800">{booking.deliveryMethod}</span>
                          </div>
                        </div>

                        {/* Alteration Notes */}
                        {booking.alterationNotes && (
                          <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-1.5">
                            <Scissors className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              <strong>ลูกค้าขอสอยเก็บทรง:</strong> {booking.alterationNotes}
                            </span>
                          </div>
                        )}

                        {booking.accessoryName && (
                          <div className="mt-1 text-xs text-rose-800">
                            ✨ เพิ่มเครื่องประดับ: {booking.accessoryName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Payment & Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 gap-3">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] text-stone-400 block font-mono">ยอดชำระของลูกค้า (รวมมัดจำ):</span>
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
                            className="px-3.5 py-1.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>✓ อนุมัติ & รับออเดอร์เช่า</span>
                          </button>
                        )}

                        {booking.status === 'fitting_scheduled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'dispatched')}
                            className="px-3.5 py-1.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5 text-sky-400" />
                            <span>สอยทรงเรียบร้อย & ส่งชุดให้ลูกค้า</span>
                          </button>
                        )}

                        {booking.status === 'dispatched' && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'active_renting')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ลูกค้ารับชุดแล้ว (เริ่มนับวันเช่า)</span>
                          </button>
                        )}

                        {(booking.status === 'active_renting' || booking.status === 'returning') && (
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>ได้รับชุดคืน & โอนคืนมัดจำ ฿{booking.depositFee.toLocaleString()}</span>
                          </button>
                        )}

                        {booking.status === 'completed' && (
                          <span className="px-3 py-1 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ออเดอร์นี้เสร็จสมบูรณ์แล้ว</span>
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

      {/* Tab 2: Manage My Wardrobe & Clothes Inventory */}
      {activeTab === 'inventory' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              ชุดเสื้อผ้าที่คุณลงไว้ ({myListings.length})
            </h3>
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-1.5 bg-neutral-950 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
              <span>+ ลงชุดใหม่</span>
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

                  <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">
                    {item.title}
                  </h4>

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

                    <button
                      onClick={() => onDeleteListing(item.id)}
                      className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบชุดนี้</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
