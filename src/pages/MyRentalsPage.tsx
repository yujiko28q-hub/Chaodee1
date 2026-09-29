import React, { useState } from 'react';
import { SetBooking, WomenSetItem, UserAccount } from '../types/rental';
import { ItemVisual } from './ItemVisual';
import { RentalOrderTimeline } from './RentalOrderTimeline';
import { 
  Clock, CheckCircle2, RotateCcw, Sparkles, 
  FileText, MessageCircle, Scissors, Truck, Heart,
  Copy, Check, ArrowRight, ShieldCheck, MapPin, X, Star,
  Award, ChevronRight, Gift, Flame
} from 'lucide-react';
import { LOYALTY_TIERS, getTierProgress, getLoyaltyTier, calculatePointsEarned } from '../utils/loyalty';

interface MyRentalsViewProps {
  bookings: SetBooking[];
  items: WomenSetItem[];
  onOpenContract: (item: WomenSetItem, days: number, startDate: string, endDate: string, size: any) => void;
  onOpenChat: (item: WomenSetItem) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  onExploreItems: () => void;
  onOpenReviewModal?: (booking: SetBooking, item: WomenSetItem) => void;
  currentUser?: UserAccount | null;
  onOpenLoyaltyModal?: () => void;
}

export const MyRentalsView: React.FC<MyRentalsViewProps> = ({
  bookings,
  items,
  onOpenContract,
  onOpenChat,
  onUpdateBookingStatus,
  onExploreItems,
  onOpenReviewModal,
  currentUser,
  onOpenLoyaltyModal
}) => {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'fitting_scheduled' | 'dispatched' | 'active_renting' | 'returning' | 'completed'
  >('all');
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);
  
  // Return courier scheduler dialog state
  const [returnDialogBooking, setReturnDialogBooking] = useState<SetBooking | null>(null);
  const [returnMethod, setReturnMethod] = useState<'grab' | 'flash' | 'studio'>('grab');

  // Filter computation
  const filtered = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'fitting_scheduled') {
      return b.status === 'fitting_scheduled' || b.status === 'pending_owner_approval';
    }
    return b.status === filterStatus;
  });

  // Dynamic counts for each timeline stage
  const counts = {
    all: bookings.length,
    fitting_scheduled: bookings.filter((b) => b.status === 'fitting_scheduled' || b.status === 'pending_owner_approval').length,
    dispatched: bookings.filter((b) => b.status === 'dispatched').length,
    active_renting: bookings.filter((b) => b.status === 'active_renting').length,
    returning: bookings.filter((b) => b.status === 'returning').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedBookingId(id);
    setTimeout(() => {
      setCopiedBookingId(null);
    }, 2500);
  };

  const getStatusBadge = (status: SetBooking['status']) => {
    switch (status) {
      case 'pending_owner_approval':
      case 'fitting_scheduled':
        return {
          label: 'จองแล้ว (จัดเตรียมชุด & สอยทรง)',
          color: 'text-rose-800 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500',
          step: 1
        };
      case 'dispatched':
        return {
          label: 'อยู่ระหว่างจัดส่ง (Grab / ขนส่งด่วน)',
          color: 'text-sky-800 bg-sky-50 border-sky-200',
          dot: 'bg-sky-500',
          step: 2
        };
      case 'active_renting':
        return {
          label: 'เช่าอยู่ (สวมใส่ในงาน / ทริป)',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500',
          step: 3
        };
      case 'returning':
        return {
          label: 'รอรับคืน (นัดหมายส่งคืน & เข้าสปา)',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
          dot: 'bg-amber-500',
          step: 4
        };
      case 'completed':
        return {
          label: 'เสร็จสิ้น (คืนเงินมัดจำแล้ว)',
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-left">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-rose-800">
            MY RENTED CLOSET & ORDER TIMELINE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">
            ตู้เสื้อผ้าชุดเซ็ทที่ฉันเช่า
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            ติดตามสถานะและไทม์ไลน์ออเดอร์: จองแล้ว → อยู่ระหว่างจัดส่ง → เช่าอยู่ → รอรับคืน → เสร็จสิ้น
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl text-xs font-medium border border-stone-200/80">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'all' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            ทั้งหมด ({counts.all})
          </button>
          <button
            onClick={() => setFilterStatus('fitting_scheduled')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'fitting_scheduled' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            จองแล้ว ({counts.fitting_scheduled})
          </button>
          <button
            onClick={() => setFilterStatus('dispatched')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'dispatched' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            อยู่ระหว่างจัดส่ง ({counts.dispatched})
          </button>
          <button
            onClick={() => setFilterStatus('active_renting')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'active_renting' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            เช่าอยู่ ({counts.active_renting})
          </button>
          <button
            onClick={() => setFilterStatus('returning')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'returning' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            รอรับคืน ({counts.returning})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'completed' 
                ? 'bg-neutral-950 text-white shadow-xs font-semibold' 
                : 'text-stone-600 hover:text-neutral-900'
            }`}
          >
            เสร็จสิ้น ({counts.completed})
          </button>
        </div>
      </div>

      {/* Loyalty Points Status Tracker in User Profile */}
      {currentUser && (() => {
        const pts = currentUser.loyaltyPoints ?? 0;
        const tier = currentUser.loyaltyTier || getLoyaltyTier(pts);
        const tierCfg = LOYALTY_TIERS[tier];
        const progress = getTierProgress(pts);

        return (
          <div className="mt-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-rose-950 text-white p-5 sm:p-6 shadow-md border border-stone-800 animate-fade-in relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top row: Profile & Tier info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 text-rose-200 flex items-center justify-center font-bold text-2xl font-serif shadow-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                      {currentUser.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border ${tierCfg.borderColor} ${tierCfg.badgeBg} ${tierCfg.badgeText} flex items-center gap-1 shadow-2xs`}>
                      <span>{tierCfg.icon}</span>
                      <span>{tierCfg.nameTh}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono border border-rose-400/30 font-semibold">
                      คูณคะแนน {tierCfg.multiplier}x
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-mono mt-1">
                    SETISTA Rewards Club • สมาชิกตั้งแต่ {currentUser.memberSince || '2024'}
                  </p>
                </div>
              </div>

              {/* Points Summary Pill */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-left shrink-0">
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">คะแนนสะสมคงเหลือ</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-serif font-bold font-mono text-amber-300">
                      {pts.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-300 font-mono">pts</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    = ส่วนลดเงินสด ฿{pts.toLocaleString()}
                  </span>
                </div>

                {onOpenLoyaltyModal && (
                  <button
                    type="button"
                    onClick={onOpenLoyaltyModal}
                    className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 self-stretch justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-rose-300" />
                    <span>ดูสมุดคะแนน & สิทธิ์</span>
                    <ChevronRight className="w-3.5 h-3.5 text-rose-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Middle Section: Status Tracker & Progress Line */}
            <div className="mt-5 pt-4 border-t border-white/10 relative z-10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-stone-200">
                    สถานะสะสมคะแนนเพื่อเลื่อนระดับ:
                  </span>
                  <span className="text-amber-300 font-serif font-bold">
                    {tierCfg.nameTh}
                  </span>
                </div>
                <span className="text-rose-200 font-mono text-xs font-medium">
                  {progress.label}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-400 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              {/* Milestones Checkpoints */}
              <div className="grid grid-cols-3 text-[11px] font-mono pt-1">
                <div className={`text-left ${tier === 'Silver' ? 'text-white font-bold' : 'text-stone-400'}`}>
                  <span className="block text-[10px] text-stone-500">เริ่มต้น</span>
                  <span>✨ Silver (0 pts)</span>
                </div>
                <div className={`text-center ${tier === 'Gold' ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
                  <span className="block text-[10px] text-stone-500">ระดับถัดไป</span>
                  <span>👑 Gold (500 pts)</span>
                </div>
                <div className={`text-right ${tier === 'Platinum' ? 'text-rose-300 font-bold' : 'text-stone-400'}`}>
                  <span className="block text-[10px] text-stone-500">ระดับ VIP สูงสุด</span>
                  <span>💎 Platinum (1,500 pts)</span>
                </div>
              </div>
            </div>

            {/* Quick Benefits Snippet */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-300">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>สะสม 1 แต้ม ทุก ฿10 ที่เช่า (คูณ {tierCfg.multiplier}x)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>แลกส่วนลดเงินสดได้ทันที (1 คะแนน = ฿1)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{tier === 'Platinum' ? 'ส่งฟรี GrabExpress ทุกชุด' : tier === 'Gold' ? 'เลือกพร็อพเครื่องประดับฟรี 1 ชิ้น' : 'ซักแห้งพรีเมียม & เนาสอยทรงฟรี'}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 mt-6 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            {bookings.length === 0 ? 'ยังไม่มีประวัติการเช่าชุด' : 'ไม่พบรายการเช่าในหมวดหมู่นี้'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
            {bookings.length === 0 
              ? 'คุณยังไม่มีรายการเช่าในขณะนี้ สามารถเริ่มต้นสำรวจชุดเซ็ทแบรนด์เนมและดีไซน์เนอร์ลุคได้ทันทีค่ะ' 
              : 'คุณสามารถเลือกดูทุกสถานะ หรือสำรวจคอลเลกชันชุดเซ็ทพรีเมียมทั้งหมดได้ทันที'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {bookings.length > 0 && (
              <button
                onClick={() => setFilterStatus('all')}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                ดูทั้งหมด ({bookings.length})
              </button>
            )}
            <button
              onClick={onExploreItems}
              className="px-5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer active:scale-98"
            >
              {bookings.length === 0 ? 'สำรวจชุดเซ็ททั้งหมด' : 'ค้นหาชุดเซ็ทที่ใช่'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {filtered.map((b) => {
            const item = items.find((i) => i.id === b.itemId) || items[0];
            const badge = getStatusBadge(b.status);

            return (
              <div 
                key={b.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col gap-5 hover:border-stone-300 transition-all"
              >
                {/* Top Row: Visual Thumbnail & Metadata & Quick Actions */}
                <div className="flex flex-col md:flex-row gap-5 items-start justify-between w-full">
                  {/* Left: Thumbnail & Essential Order Details */}
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden shrink-0 bg-stone-900 border border-stone-200 shadow-2xs">
                      <ItemVisual
                        imageUrl={b.imageUrl || item.imageUrl}
                        title={b.itemTitle}
                        brand={b.brand}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
                          <span>{badge.label}</span>
                        </span>
                        
                        {/* Order ID with Click-to-Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopyId(b.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-mono transition-colors cursor-pointer"
                          title="คลิกเพื่อคัดลอกรหัสออเดอร์"
                        >
                          {copiedBookingId === b.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">คัดลอกแล้ว!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-stone-400" />
                              <span>#{b.id}</span>
                            </>
                          )}
                        </button>

                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-mono font-bold text-[11px]">
                          ไซส์ {b.selectedSize}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">
                        {b.brand}
                      </span>
                      <h4 className="font-serif text-base font-bold text-neutral-900 truncate">
                        {b.itemTitle}
                      </h4>

                      <div className="mt-1 text-xs text-stone-500 space-y-0.5">
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>ช่วงเวลาเช่า: <strong className="text-neutral-800">{b.startDate} ถึง {b.endDate}</strong> ({b.totalDays} วัน)</span>
                        </p>
                        {b.eventOccasion && (
                          <p className="text-stone-600 text-[11px]">
                            ✨ โอกาสที่ใส่: {b.eventOccasion}
                          </p>
                        )}
                        {/* Loyalty Points Earned / Discount Used */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            <span>+{b.pointsEarned ?? calculatePointsEarned(b.rentalFee)} คะแนนสะสม</span>
                          </span>
                          {b.pointsDiscount && b.pointsDiscount > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-semibold">
                              <span>👑 ใช้ส่วนลดคะแนน -฿{b.pointsDiscount}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Total Price & High-Level Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-stone-400 block font-mono">ยอดสุทธิ (รวมมัดจำ):</span>
                      <span className="font-serif text-lg font-bold font-mono text-neutral-950 tabular-nums">
                        ฿{b.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-700 block">
                        มัดจำ ฿{b.depositFee.toLocaleString()} (ได้คืนเต็มหลังส่งคืน)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onOpenContract(item, b.totalDays, b.startDate, b.endDate, b.selectedSize)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>สัญญาเช่า</span>
                      </button>

                      <button
                        onClick={() => onOpenChat(item)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-neutral-950 cursor-pointer flex items-center gap-1.5 text-xs active:scale-95 transition-all"
                        title="คุยสัญญา & ปรึกษากับทางร้าน"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-rose-700" />
                        <span>คุยสัญญากับร้าน</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Embedded Order Lifecycle Timeline */}
                <RentalOrderTimeline
                  booking={b}
                  item={item}
                  onUpdateStatus={onUpdateBookingStatus}
                  onOpenReturnDialog={(booking) => setReturnDialogBooking(booking)}
                  onOpenReviewModal={onOpenReviewModal}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Microinteraction: Return Courier Booking Modal */}
      {returnDialogBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in text-left"
          onClick={() => setReturnDialogBooking(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    นัดหมายส่งคืนชุดเซ็ท
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    แพ็กใส่ถุงคลุมสูทคืน ไม่ต้องซัก ทางร้านมีสปาซักแห้งฟรี
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReturnDialogBooking(null)}
                className="p-1 rounded-full text-stone-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Courier Method Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 block">
                เลือกช่องทางการส่งชุดคืน
              </label>

              <button
                type="button"
                onClick={() => setReturnMethod('grab')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  returnMethod === 'grab'
                    ? 'border-neutral-950 bg-stone-50 font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    🛵
                  </div>
                  <div>
                    <p className="text-xs text-neutral-900 font-semibold">เรียก Grab Express / Lineman</p>
                    <p className="text-[10px] text-stone-500 font-normal">ไรเดอร์เข้ารับถึงหน้าบ้านตามเวลานัด</p>
                  </div>
                </div>
                {returnMethod === 'grab' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setReturnMethod('flash')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  returnMethod === 'flash'
                    ? 'border-neutral-950 bg-stone-50 font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    📦
                  </div>
                  <div>
                    <p className="text-xs text-neutral-900 font-semibold">นำส่ง Flash / Kerry Express</p>
                    <p className="text-[10px] text-stone-500 font-normal">สแกน QR Code ใบปะหน้าส่งคืนฟรี</p>
                  </div>
                </div>
                {returnMethod === 'flash' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setReturnMethod('studio')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  returnMethod === 'studio'
                    ? 'border-neutral-950 bg-stone-50 font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    🏠
                  </div>
                  <div>
                    <p className="text-xs text-neutral-900 font-semibold">คืนด้วยตนเองที่สตูดิโอทองหล่อ</p>
                    <p className="text-[10px] text-stone-500 font-normal">เปิดบริการทุกวัน 10:00 - 20:00 น.</p>
                  </div>
                </div>
                {returnMethod === 'studio' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <span className="text-[11px] text-stone-500">เงินประกันมัดจำที่จะได้รับคืน:</span>
              <p className="font-mono text-base font-bold text-neutral-950">
                ฿{returnDialogBooking.depositFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-700">
                ✓ โอนคืนเข้าพร้อมเพย์ทันทีภายใน 2-4 ชั่วโมง หลังชุดถึงสตูดิโอ
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateBookingStatus(returnDialogBooking.id, 'returning');
                  setReturnDialogBooking(null);
                }}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 text-rose-300" />
                <span>ยืนยันการนัดหมายส่งคืนชุด</span>
              </button>

              <button
                type="button"
                onClick={() => setReturnDialogBooking(null)}
                className="w-full py-2 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-neutral-950 font-medium text-xs transition-colors cursor-pointer"
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

