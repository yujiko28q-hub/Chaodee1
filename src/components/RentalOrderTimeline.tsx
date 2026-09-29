import React, { useState } from 'react';
import { SetBooking, WomenSetItem } from '../types/rental';
import { 
  Scissors, Truck, Sparkles, RotateCcw, ShieldCheck, 
  Check, Clock, Copy, MapPin, PackageCheck, AlertCircle,
  ArrowRight, Star, RefreshCw
} from 'lucide-react';

interface RentalOrderTimelineProps {
  booking: SetBooking;
  item: WomenSetItem;
  onUpdateStatus: (bookingId: string, newStatus: SetBooking['status']) => void;
  onOpenReturnDialog: (booking: SetBooking) => void;
  onOpenReviewModal?: (booking: SetBooking, item: WomenSetItem) => void;
}

interface TimelineStepInfo {
  statusKey: SetBooking['status'];
  altKeys?: SetBooking['status'][];
  stepIndex: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badgeText: string;
}

const TIMELINE_STEPS: TimelineStepInfo[] = [
  {
    statusKey: 'fitting_scheduled',
    altKeys: ['pending_owner_approval'],
    stepIndex: 0,
    label: 'จองแล้ว',
    sublabel: 'ตรวจสภาพ & สอยทรง',
    icon: Scissors,
    description: 'ยืนยันการจองเรียบร้อย ทางร้านกำลังตรวจเช็คสภาพชุด เนาสอยเก็บทรงตามขนาดที่ระบุ และแพ็กใส่ถุงคลุมสูทกันฝุ่น',
    badgeText: 'จัดเตรียมชุด & สอยเก็บทรง'
  },
  {
    statusKey: 'dispatched',
    stepIndex: 1,
    label: 'อยู่ระหว่างจัดส่ง',
    sublabel: 'ไรเดอร์ / ขนส่งด่วน',
    icon: Truck,
    description: 'ชุดออกจากสตูดิโอแล้ว อยู่ระหว่างเดินทางนำส่งถึงที่อยู่ของคุณล่วงหน้าก่อนวันงาน 1 วัน พร้อมเลข Tracking ตรวจสอบได้',
    badgeText: 'ชุดกำลังเดินทางนำส่ง'
  },
  {
    statusKey: 'active_renting',
    stepIndex: 2,
    label: 'เช่าอยู่',
    sublabel: 'สวมใส่ในงาน / ทริป',
    icon: Sparkles,
    description: 'ลูกค้าได้รับชุดแล้ว สวมใส่ไปงานได้อย่างมั่นใจ พร้อมประกันความเสียหายเล็กน้อย ไม่ต้องกังวลเรื่องการซักคืน',
    badgeText: 'กำลังสวมใส่ในงาน (วันเช่า)'
  },
  {
    statusKey: 'returning',
    stepIndex: 3,
    label: 'รอรับคืน',
    sublabel: 'ส่งคืน & สปาซักแห้ง',
    icon: RotateCcw,
    description: 'นัดหมายไรเดอร์เข้ารับชุดคืนเรียบร้อย หรือนำส่งเคาน์เตอร์ขนส่ง โดยผู้เช่าไม่ต้องซัก ทางร้านนำเข้าสปาซักแห้งพรีเมียม',
    badgeText: 'รอรับคืน & ส่งตรวจสภาพ'
  },
  {
    statusKey: 'completed',
    stepIndex: 4,
    label: 'เสร็จสิ้น',
    sublabel: 'ตรวจรับ & คืนมัดจำ',
    icon: ShieldCheck,
    description: 'ทางร้านตรวจรับสภาพชุดเรียบร้อย โอนคืนเงินประกันมัดจำเต็มจำนวนกลับเข้าบัญชี และเปิดให้รีวิวชุด',
    badgeText: 'คำสั่งเช่าสำเร็จ & คืนมัดจำแล้ว'
  }
];

export const RentalOrderTimeline: React.FC<RentalOrderTimelineProps> = ({
  booking,
  item,
  onUpdateStatus,
  onOpenReturnDialog,
  onOpenReviewModal
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [showStatusSimulator, setShowStatusSimulator] = useState(false);

  // Map booking status to timeline index (0 to 4)
  const getActiveStepIndex = (status: SetBooking['status']): number => {
    switch (status) {
      case 'pending_owner_approval':
      case 'fitting_scheduled':
        return 0;
      case 'dispatched':
        return 1;
      case 'active_renting':
        return 2;
      case 'returning':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveStepIndex(booking.status);
  const currentStep = TIMELINE_STEPS[activeIndex] || TIMELINE_STEPS[0];

  const handleCopyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Progress line percentage calculation
  const progressPercent = (activeIndex / (TIMELINE_STEPS.length - 1)) * 100;

  return (
    <div className="w-full bg-stone-50/80 rounded-2xl border border-stone-200/90 p-4 sm:p-5 space-y-4 text-left shadow-2xs">
      {/* Timeline Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-200/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-900 text-white flex items-center justify-center text-xs font-bold">
            ⚡
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>ไทม์ไลน์สถานะการเช่า (Order Timeline)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/60 font-semibold">
                ขั้นตอนที่ {activeIndex + 1} จาก 5
              </span>
            </h4>
          </div>
        </div>

        {/* Quick Simulator Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowStatusSimulator(!showStatusSimulator)}
            className="text-[11px] text-stone-500 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer transition-colors active:scale-95"
            title="ทดสอบสลับสถานะคำสั่งเช่า"
          >
            <RefreshCw className={`w-3 h-3 text-stone-400 ${showStatusSimulator ? 'rotate-180 text-rose-800' : ''} transition-transform`} />
            <span>{showStatusSimulator ? 'ซ่อนตัวจำลองสถานะ' : 'จำลองสลับสถานะ'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Quick Switch Pills (Collapsible) */}
      {showStatusSimulator && (
        <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-wrap items-center gap-1.5 text-xs animate-fade-in">
          <span className="text-[11px] font-bold text-amber-900 shrink-0">⚡ สลับสถานะเพื่อทดสอบ:</span>
          {TIMELINE_STEPS.map((s) => (
            <button
              key={s.statusKey}
              type="button"
              onClick={() => onUpdateStatus(booking.id, s.statusKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                activeIndex === s.stepIndex
                  ? 'bg-neutral-950 text-white font-bold shadow-2xs'
                  : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Visual Stepper Track */}
      <div className="relative pt-2 pb-2">
        {/* Background Track Line */}
        <div className="absolute top-7 left-4 right-4 sm:left-6 sm:right-6 h-1 bg-stone-200 rounded-full -translate-y-1/2 z-0 hidden sm:block">
          {/* Active Highlight Line */}
          <div 
            className="h-full bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5 Milestone Step Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2 relative z-10">
          {TIMELINE_STEPS.map((step) => {
            const isCompleted = step.stepIndex < activeIndex;
            const isCurrent = step.stepIndex === activeIndex;
            const isUpcoming = step.stepIndex > activeIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.stepIndex}
                className={`flex flex-col items-center text-center p-2.5 sm:p-1.5 rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-rose-50/70 border border-rose-200/80 sm:bg-transparent sm:border-none shadow-2xs sm:shadow-none' 
                    : ''
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-100'
                      : isCurrent
                      ? 'bg-rose-900 text-white shadow-md ring-4 ring-rose-200 scale-105'
                      : 'bg-white border border-stone-300 text-stone-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </div>

                {/* Node Label & Sublabel */}
                <div className="mt-2 text-center w-full">
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className={`text-xs block font-serif ${
                        isCurrent
                          ? 'font-bold text-rose-900'
                          : isCompleted
                          ? 'font-semibold text-neutral-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping inline-block" />
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 block leading-tight mt-0.5 truncate">
                    {step.sublabel}
                  </span>

                  {/* Current Active Indicator Pill */}
                  {isCurrent && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-rose-900 text-white text-[9px] font-semibold tracking-wider uppercase font-mono shadow-2xs">
                      ปัจจุบัน
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold font-mono">
                      ✓ ผ่านแล้ว
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail & Action Callout Box */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        {/* Stage Status Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center shrink-0">
              <currentStep.icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">
                ขั้นตอนปัจจุบัน
              </span>
              <h5 className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>{currentStep.label}: {currentStep.badgeText}</span>
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>จองเมื่อ: {booking.bookedAt}</span>
          </div>
        </div>

        {/* Detailed Context Cards for the Active Step */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Column 1: Order Logistics & Schedule */}
          <div className="space-y-1.5 p-3 rounded-xl bg-stone-50/70 border border-stone-100">
            <span className="text-[11px] font-semibold text-neutral-800 block">
              📅 กำหนดการและช่วงเวลาเช่า:
            </span>
            <p className="text-stone-600">
              สวมใส่ช่วง: <strong className="text-neutral-900">{booking.startDate} ถึง {booking.endDate}</strong> ({booking.totalDays} วัน)
            </p>
            <p className="text-stone-600">
              ช่องทางจัดส่ง: <span className="font-medium text-neutral-800">{booking.deliveryMethod}</span>
            </p>
            {booking.deliveryAddress && (
              <p className="text-stone-600 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-rose-800 shrink-0 mt-0.5" />
                <span className="truncate">{booking.deliveryAddress}</span>
              </p>
            )}
          </div>

          {/* Column 2: Specific Stage Status Details */}
          <div className="space-y-1.5 p-3 rounded-xl bg-stone-50/70 border border-stone-100">
            <span className="text-[11px] font-semibold text-neutral-800 block">
              👗 รายละเอียดการเตรียมชุด:
            </span>
            
            {/* Fitting & Alterations */}
            {booking.alterationNotes ? (
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Scissors className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>สอยเก็บทรง: {booking.alterationNotes}</span>
              </p>
            ) : (
              <p className="text-stone-500">
                ไซส์ {booking.selectedSize} (ทรงมาตรฐานพร้อมใส่)
              </p>
            )}

            {/* Tracking Number (if dispatched or returning) */}
            {booking.trackingNumber ? (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-stone-500">เลขพัสดุ / แทร็กกิ้ง:</span>
                <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {booking.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(booking.trackingNumber!)}
                  className="p-1 text-stone-500 hover:text-neutral-900 hover:bg-stone-200 rounded transition-colors cursor-pointer"
                  title="คัดลอกเลขแทร็กกิ้ง"
                >
                  {copiedTracking ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ) : null}

            {/* Shipping Notes */}
            {booking.shippingNotes && (
              <p className="text-sky-800 font-medium text-[11px] flex items-center gap-1">
                <Truck className="w-3 h-3 text-sky-600 shrink-0" />
                <span>{booking.shippingNotes}</span>
              </p>
            )}

            {/* Deposit Guarantee */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-emerald-700 text-[11px]">
                🛡️ มัดจำ ฿{booking.depositFee.toLocaleString()} (ได้คืนเต็มหลังส่งคืนชุด)
              </span>
              {booking.pointsEarned ? (
                <span className="text-rose-900 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                  ✨ ได้รับ +{booking.pointsEarned} คะแนน
                </span>
              ) : null}
              {booking.pointsDiscount && booking.pointsDiscount > 0 ? (
                <span className="text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                  👑 ใช้ส่วนลดคะแนน -฿{booking.pointsDiscount}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Informative Guidance Banner based on Step */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-neutral-900 block">
              {activeIndex === 0 && 'คำแนะนำในขั้นตอนนี้ (จองแล้ว & เตรียมชุด):'}
              {activeIndex === 1 && 'คำแนะนำในขั้นตอนนี้ (อยู่ระหว่างจัดส่ง):'}
              {activeIndex === 2 && 'คำแนะนำในขั้นตอนนี้ (กำลังสวมใส่ในงาน):'}
              {activeIndex === 3 && 'คำแนะนำในขั้นตอนนี้ (รอรับคืน & ส่งสปา):'}
              {activeIndex === 4 && 'คำแนะนำในขั้นตอนนี้ (เสร็จสิ้นการเช่า):'}
            </span>
            <p className="font-light text-stone-600">
              {activeIndex === 0 && (
                <>ชุดจะถูกจัดส่งล่วงหน้า 1 วันก่อนวันเริ่มเช่า ({booking.startDate}) ทาง GrabExpress หรือขนส่งด่วน เพื่อให้คุณได้ลองสวมและเตรียมตัวอย่างสบายใจค่ะ</>
              )}
              {activeIndex === 1 && (
                <>ชุดกำลังเดินทางนำส่งถึงที่อยู่ของคุณ เมื่อได้รับชุดและลองสวมเรียบร้อยแล้ว กรุณากดปุ่ม <strong>"ได้รับชุดและลองสวมแล้ว"</strong> ด้านล่างเพื่อเริ่มช่วงเวลาเช่า</>
              )}
              {activeIndex === 2 && (
                <>สวมใส่เฉิดฉายในงานได้อย่างมั่นใจ ไร้กังวลเรื่องการซัก ทางร้านมีบริการสปาซักแห้งพรีเมียมรองรับฟรี และเมื่อพร้อมส่งคืนสามารถกด <strong>"แจ้งส่งคืนชุด"</strong> ได้เลยค่ะ</>
              )}
              {activeIndex === 3 && (
                <>ได้รับข้อมูลการส่งคืนเรียบร้อย ชุดกำลังนำส่งสตูดิโอทองหล่อ เมื่อตรวจรับชุดเรียบร้อย ทางร้านจะโอนคืนเงินมัดจำ ฿{booking.depositFee.toLocaleString()} เข้าบัญชีภายใน 2-4 ชั่วโมง</>
              )}
              {activeIndex === 4 && (
                <>ออเดอร์นี้เสร็จสมบูรณ์ โอนเงินประกันมัดจำคืนเรียบร้อยแล้วค่ะ ขอบคุณที่ไว้วางใจ SETISTA คุณสามารถกดปุ่ม <strong>"ให้คะแนนและรีวิวชุด"</strong> เพื่อแบ่งปันความประทับใจได้นะคะ ⭐</>
              )}
            </p>
          </div>
        </div>

        {/* Step Progression Action Buttons */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
          <div className="text-[11px] text-stone-500">
            {activeIndex < 4 ? (
              <span>กดปุ่มทางขวาเพื่ออัปเดตสถานะของออเดอร์นี้</span>
            ) : (
              <span className="text-emerald-700 font-medium">✓ ออเดอร์นี้เสร็จสิ้นสมบูรณ์แล้ว</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Advance from Step 0 -> Step 1 (Dispatched) */}
            {activeIndex === 0 && (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(booking.id, 'dispatched')}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Truck className="w-3.5 h-3.5 text-sky-200" />
                  <span>ร้านแจ้งจัดส่งแล้ว (อยู่ระหว่างจัดส่ง)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateStatus(booking.id, 'active_renting')}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ได้รับชุดแล้ว (เริ่มการเช่า)</span>
                </button>
              </>
            )}

            {/* Advance from Step 1 -> Step 2 (Active Renting) */}
            {activeIndex === 1 && (
              <button
                type="button"
                onClick={() => onUpdateStatus(booking.id, 'active_renting')}
                className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>ได้รับชุดและลองสวมแล้ว (เริ่มนับวันเช่า)</span>
              </button>
            )}

            {/* Advance from Step 2 -> Step 3 (Returning via Modal) */}
            {activeIndex === 2 && (
              <button
                type="button"
                onClick={() => onOpenReturnDialog(booking)}
                className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
                <span>แจ้งนัดส่งคืนชุด (ไม่ต้องซักคืน)</span>
              </button>
            )}

            {/* Advance from Step 3 -> Step 4 (Completed) */}
            {activeIndex === 3 && (
              <button
                type="button"
                onClick={() => onUpdateStatus(booking.id, 'completed')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4 text-emerald-200 stroke-[2.5]" />
                <span>ร้านตรวจรับสภาพชุด & โอนคืนเงินมัดจำ</span>
              </button>
            )}

            {/* In Step 4: Write Review or View Review */}
            {activeIndex === 4 && onOpenReviewModal && (
              <button
                type="button"
                onClick={() => onOpenReviewModal(booking, item)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all ${
                  booking.isReviewed
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${booking.isReviewed ? 'fill-amber-500 text-amber-500' : 'fill-white text-white'}`} />
                <span>{booking.isReviewed ? `⭐ รีวิวแล้ว (${booking.reviewRating || 5} ดาว)` : '⭐ ให้คะแนน & เขียนรีวิวชุด'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
