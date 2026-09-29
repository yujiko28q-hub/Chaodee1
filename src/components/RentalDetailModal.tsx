import React, { useState, useMemo } from 'react';
import { WomenSetItem, SetBooking, SetReview, ApparelSize, UserAccount } from '../types/rental';
import { ItemVisual } from './ItemVisual';
import { ImageGallery } from './ImageGallery';
import { StatusBadge } from './StatusBadge';
import { VerifiedBadge } from './VerifiedBadge';
import { SmartSizeRecommenderModal } from './SmartSizeRecommenderModal';
import { calculatePointsEarned, LOYALTY_TIERS, getLoyaltyTier } from '../utils/loyalty';
import { 
  X, Check, Sparkles, Scissors, Calendar, ShieldCheck, 
  Ruler, HelpCircle, Truck, FileText, CheckCircle2, 
  MessageCircle, Star, Heart, Receipt, MapPin, Building, Home, Briefcase,
  ThumbsUp, Award, Gift, ArrowRight
} from 'lucide-react';

interface RentalDetailModalProps {
  item: WomenSetItem | null;
  onClose: () => void;
  onConfirmBooking: (booking: SetBooking) => void;
  onOpenChat: (item: WomenSetItem) => void;
  onOpenContract: (item: WomenSetItem, days: number, startDate: string, endDate: string, size: ApparelSize) => void;
  onOpenSizeGuide: () => void;
  reviews?: SetReview[];
  completedBookingForReview?: SetBooking;
  onOpenReviewModal?: (booking: SetBooking, item: WomenSetItem) => void;
  currentUser?: UserAccount | null;
  onOpenLoyaltyModal?: () => void;
  onOpenAuth?: () => void;
}

export const RentalDetailModal: React.FC<RentalDetailModalProps> = ({
  item,
  onClose,
  onConfirmBooking,
  onOpenChat,
  onOpenContract,
  onOpenSizeGuide,
  reviews = [],
  completedBookingForReview,
  onOpenReviewModal,
  currentUser,
  onOpenLoyaltyModal,
  onOpenAuth
}) => {
  if (!item) return null;

  // Initial defaults
  const today = new Date().toISOString().split('T')[0];
  const defaultStartDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [selectedSize, setSelectedSize] = useState<ApparelSize>(item.availableSizes[0] || 'S');
  const [rentalPackage, setRentalPackage] = useState<'3days' | '5days' | '7days' | 'custom'>('3days');
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [needAlteration, setNeedAlteration] = useState<boolean>(false);
  const [alterationNotes, setAlterationNotes] = useState<string>('สอยเก็บเอวเข้า 0.5 นิ้ว (สอยชั่วคราวไม่ตัดผ้า)');
  const [selectedAccessoryIndex, setSelectedAccessoryIndex] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(item.deliveryOptions[0] || 'ลองชุด & รับที่สตูดิโอทองหล่อ');
  const [depositMethod, setDepositMethod] = useState<'cash' | 'kyc'>('cash');
  const [renterName, setRenterName] = useState<string>(currentUser?.name || 'คุณพิมพ์ลดา พัฒนกิจ');
  const [renterPhone, setRenterPhone] = useState<string>(currentUser?.phone || '089-112-3456');

  // Synchronize renter contact info when currentUser changes
  React.useEffect(() => {
    if (currentUser?.name) setRenterName(currentUser.name);
    if (currentUser?.phone) setRenterPhone(currentUser.phone);
  }, [currentUser]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('คอนโด The Monument ทองหล่อ เลขที่ 88/12 แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110');
  const [shippingNotes, setShippingNotes] = useState<string>('ฝากนิติบุคคลคอนโด ชั้น 1 (โทรแจ้งเมื่อถึง)');
  const [eventOccasion, setEventOccasion] = useState<string>('ไปงานแต่งงาน / งานเลี้ยงฉลอง');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookedReceipt, setBookedReceipt] = useState<SetBooking | null>(null);
  const [showSmartRecommender, setShowSmartRecommender] = useState<boolean>(false);
  const [smartSizeBadge, setSmartSizeBadge] = useState<string | null>(null);

  // Address Presets for effortless filling
  const addressPresets = [
    {
      title: '🏢 คอนโด ทองหล่อ',
      addr: 'คอนโด The Monument ทองหล่อ เลขที่ 88/12 แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110',
      note: 'ฝากนิติบุคคลคอนโด ชั้น 1 (โทรแจ้งเมื่อถึง)'
    },
    {
      title: '🏡 บ้านพัก เอกมัย',
      addr: 'บ้านเลขที่ 45 ซอยสุขุมวิท 63 (เอกมัย 12) แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110',
      note: 'ส่งถึงหน้าประตูบ้าน มีคนอยู่ตลอด'
    },
    {
      title: '💼 ออฟฟิศ สีลม',
      addr: 'อาคาร Silom Complex ชั้น 18 ถนนสีลม แขวงสีลม เขตบางรัก กทม. 10500',
      note: 'ส่งเวลาทำการ 09:00 - 17:00 น. โทรติดต่อก่อนส่ง'
    }
  ];

  // Basting presets
  const bastingPresets = [
    'สอยเก็บเอวเข้า 0.5 นิ้ว (สอยชั่วคราวไม่ตัดผ้า)',
    'สอยเก็บเอวเข้า 1.0 นิ้ว (สอยชั่วคราวไม่ตัดผ้า)',
    'สอยเก็บเอวเข้า 1.5 นิ้ว (สอยชั่วคราวไม่ตัดผ้า)',
    'สอยเก็บกระชับช่วงสะโพกและเอวเข้าเล็กน้อย'
  ];

  // Occasions list
  const occasionList = [
    '💍 ไปงานแต่งงาน / งานเลี้ยงฉลอง',
    '🥂 ดินเนอร์หรู Rooftop / ปาร์ตี้',
    '💼 ประชุมสัมมนา / งานแถลงข่าว',
    '🌴 ทริปท่องเที่ยว / คาเฟ่สุดสัปดาห์'
  ];

  // Sync dates when package changes
  const handlePackageChange = (pkg: '3days' | '5days' | '7days') => {
    setRentalPackage(pkg);
    const start = new Date(startDate || today);
    const days = pkg === '3days' ? 3 : pkg === '5days' ? 5 : 7;
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Calculation
  const rentalDays = useMemo(() => {
    if (rentalPackage === '3days') return 3;
    if (rentalPackage === '5days') return 5;
    if (rentalPackage === '7days') return 7;
    if (!startDate || !endDate) return 3;
    const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, item.minRentDays);
  }, [rentalPackage, startDate, endDate, item.minRentDays]);

  const baseRentalFee = item.pricePerDay * rentalDays;
  const discountRate = rentalDays >= 7 ? 0.20 : rentalDays >= 5 ? 0.10 : 0;
  const discountAmount = Math.round(baseRentalFee * discountRate);
  const finalRentalFee = baseRentalFee - discountAmount;

  // Loyalty points redemption logic
  const availablePoints = currentUser?.loyaltyPoints ?? 0;
  const currentTier = currentUser?.loyaltyTier || getLoyaltyTier(availablePoints);
  const prospectivePoints = calculatePointsEarned(finalRentalFee, currentTier);
  const maxUsablePoints = Math.min(availablePoints, finalRentalFee);

  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  const pointsDiscount = usePoints ? Math.min(pointsToRedeem, maxUsablePoints) : 0;

  // Accessory fee
  const accessoryFee = selectedAccessoryIndex !== null ? 80 : 0;
  const deliveryFee = deliveryMethod.includes('Grab') ? 150 : deliveryMethod.includes('EMS') ? 80 : 0;
  const effectiveDeposit = depositMethod === 'kyc' ? 0 : item.deposit;
  const grandTotal = Math.max(0, finalRentalFee - pointsDiscount) + effectiveDeposit + deliveryFee + accessoryFee;

  const currentMeasurements = item.measurements[selectedSize] || item.measurements['S'] || {
    bust: '32-34 นิ้ว',
    waist: '25-26 นิ้ว',
    hip: '35-37 นิ้ว'
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    const newBooking: SetBooking = {
      id: `SET-${Date.now().toString().slice(-8)}`,
      itemId: item.id,
      itemTitle: item.title,
      brand: item.brand,
      imageUrl: item.imageUrl,
      selectedSize,
      alterationNotes: needAlteration ? alterationNotes : undefined,
      needAccessories: selectedAccessoryIndex !== null,
      accessoryName: selectedAccessoryIndex !== null ? item.matchingAccessories[selectedAccessoryIndex] : undefined,
      startDate,
      endDate,
      rentalPackage,
      totalDays: rentalDays,
      rentalFee: finalRentalFee,
      depositFee: effectiveDeposit,
      discount: discountAmount + pointsDiscount,
      accessoryFee,
      totalAmount: grandTotal,
      renterName,
      renterPhone,
      deliveryMethod,
      deliveryAddress,
      shippingNotes: shippingNotes.trim() ? shippingNotes : undefined,
      depositMethod,
      eventOccasion,
      status: 'pending_owner_approval',
      bookedAt: new Date().toISOString(),
      studioName: item.ownerStudio,
      contractId: `CTR-${Date.now().toString().slice(-6)}`,
      pointsEarned: prospectivePoints,
      pointsRedeemed: pointsDiscount,
      pointsDiscount: pointsDiscount,
    };

    setBookedReceipt(newBooking);
    setIsSuccess(true);
    onConfirmBooking(newBooking);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 max-sm:p-0 max-sm:items-end animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl max-sm:rounded-b-none max-sm:rounded-t-3xl shadow-2xl overflow-hidden my-auto max-sm:my-0 max-h-[92vh] max-sm:max-h-[94vh] flex flex-col text-left animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull / Drag Handle for Bottom Sheet */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-stone-50/90 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-rose-800 uppercase tracking-widest">
              {item.brand}
            </span>
            <VerifiedBadge size="sm" showText={false} />
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">{item.categoryNameTh}</span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={item.isAvailable ? 'available' : 'rented'} size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {isSuccess && bookedReceipt ? (
            /* Booking Success Receipt View */
            <div className="py-8 max-w-lg mx-auto text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h2 className="font-serif text-2xl font-bold text-neutral-900">
                ยืนยันการจองเช่าชุดสำเร็จ!
              </h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                สไตลิสต์ประจำสตูดิโอกำลังจัดเตรียมชุดและดำเนินการตรวจสอบสภาพ พร้อมดูแลการสอยเก็บทรงตามที่คุณระบุ
              </p>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2.5 text-left">
                <div className="flex justify-between pb-2 border-b border-stone-200 font-semibold text-neutral-800">
                  <span>หมายเลขการจอง:</span>
                  <span className="font-mono text-neutral-900">{bookedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">ชุดเซ็ท:</span>
                  <span className="font-medium text-neutral-900 truncate max-w-[240px]">{bookedReceipt.itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">ไซส์ที่เลือก:</span>
                  <span className="font-bold text-rose-700 font-mono">ไซส์ {bookedReceipt.selectedSize}</span>
                </div>
                {bookedReceipt.alterationNotes && (
                  <div className="flex justify-between text-emerald-700">
                    <span>บริการสอยเก็บทรงฟรี:</span>
                    <span className="font-medium">{bookedReceipt.alterationNotes}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">ระยะเวลาเช่า:</span>
                  <span className="font-medium text-neutral-900">{bookedReceipt.totalDays} วัน ({bookedReceipt.startDate} ถึง {bookedReceipt.endDate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">ที่อยู่จัดส่ง:</span>
                  <span className="font-medium text-neutral-900 truncate max-w-[240px]">{bookedReceipt.deliveryAddress}</span>
                </div>

                {bookedReceipt.pointsDiscount && bookedReceipt.pointsDiscount > 0 ? (
                  <div className="flex justify-between items-center text-amber-900 font-semibold bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                    <span className="flex items-center gap-1.5">
                      <span>👑 ใช้ส่วนลดคะแนนสะสม:</span>
                    </span>
                    <span className="font-mono text-xs font-bold">-฿{bookedReceipt.pointsDiscount.toLocaleString()} ({bookedReceipt.pointsRedeemed} pts)</span>
                  </div>
                ) : null}

                {bookedReceipt.pointsEarned ? (
                  <div className="flex justify-between items-center text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>คะแนนสะสมที่ได้รับจากออเดอร์นี้:</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-900">+{bookedReceipt.pointsEarned.toLocaleString()} คะแนน</span>
                  </div>
                ) : null}

                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-neutral-950">
                  <span>ยอดชำระสุทธิ (รวมมัดจำ):</span>
                  <span className="font-mono text-base text-rose-950">฿{bookedReceipt.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {onOpenLoyaltyModal && (
                <div className="p-3 bg-gradient-to-r from-stone-900 via-stone-900 to-rose-950 rounded-2xl text-white text-xs flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👑</span>
                    <div className="text-left">
                      <span className="font-serif font-bold text-white block">SETISTA Rewards Club</span>
                      <span className="text-[10px] text-rose-200 font-mono">
                        อัปเดตคะแนนและสถานะสมาชิกเรียบร้อยแล้ว
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenLoyaltyModal}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>ดูสมุดคะแนน</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-[11px] text-rose-900 text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>การันตีความสบายใจ:</strong> รวมบริการซักแห้งพรีเมียมให้ฟรี ใส่เสร็จแพ็กใส่ถุงสูทส่งคืนได้เลย ไม่ต้องซักเอง และรับเงินมัดจำคืนเข้าบัญชีภายใน 24 ชม.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenContract(item, rentalDays, startDate, endDate, selectedSize)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>ดูสัญญาเช่าอิเล็กทรอนิกส์</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer active:scale-98"
                >
                  เสร็จสิ้น / ไปดูตู้เสื้อผ้าของฉัน
                </button>
              </div>
            </div>
          ) : (
            /* PDP 2-Column Fashion Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Garment Visual & Detailed Specs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Lookbook Hero Visual with Interactive Image Gallery & Lightbox */}
                <ImageGallery
                  primaryImage={item.imageUrl}
                  title={item.title}
                  brand={item.brand}
                  category={item.categoryNameTh}
                  conditionNote={item.condition}
                />

                {/* Set Title & Vibe */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-rose-800">{item.brand}</span>
                    <span>·</span>
                    <span>{item.condition}</span>
                    <span>·</span>
                    <span className="flex items-center text-amber-600 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      {item.rating.toFixed(2)} ({item.reviewCount} รีวิว)
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-neutral-950 leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Garment Fabric & Care Badges */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">เนื้อผ้า (Fabric)</span>
                    <span className="font-medium text-neutral-900">{item.fabric}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">บริการซักรีด</span>
                    <span className="font-medium text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ซักแห้งฟรี ไม่ต้องซักคืน
                    </span>
                  </div>
                </div>

                {/* Interactive Size Measurements Table for this piece */}
                <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-900">
                      สัดส่วนเฉพาะของ ไซส์ {selectedSize}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="text-xs text-rose-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>เทียบตารางไซส์</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-2xs">
                      <span className="text-[10px] text-stone-500 block">รอบอก (Bust)</span>
                      <span className="font-bold text-neutral-900 font-mono text-sm">{currentMeasurements.bust}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-2xs">
                      <span className="text-[10px] text-stone-500 block">รอบเอว (Waist)</span>
                      <span className="font-bold text-neutral-900 font-mono text-sm">{currentMeasurements.waist}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-2xs">
                      <span className="text-[10px] text-stone-500 block">สะโพก (Hip)</span>
                      <span className="font-bold text-neutral-900 font-mono text-sm">{currentMeasurements.hip}</span>
                    </div>
                  </div>
                </div>

                {/* In the Box / Set Package */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    อุปกรณ์และชิ้นส่วนในเซ็ต ({item.includedItems.length} รายการ)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {item.includedItems.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold font-mono">0{i + 1}.</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Styling Tips from Boutique Stylist */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs">
                  <h5 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Styling Tips โดยสไตลิสต์ประจำร้าน:</span>
                  </h5>
                  <p className="text-amber-800/90 leading-relaxed font-light">
                    {item.stylingTips}
                  </p>
                </div>

                {/* Verified Customer Reviews Section */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                        <span>คะแนนและรีวิวจากผู้เช่าจริง</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
                          {reviews.length} รีวิว
                        </span>
                      </h4>
                      <p className="text-xs text-stone-500 font-light mt-0.5">
                        ความคิดเห็นจริงจากลูกค้าที่เช่าและสวมใส่ในงาน
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start sm:self-auto">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {reviews.length > 0
                          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                          : item.rating.toFixed(1)}
                      </span>
                      <span className="text-stone-400 text-xs">/ 5.0</span>
                    </div>
                  </div>

                  {/* Quick Review Prompt for Renter Who Completed This Outfit */}
                  {completedBookingForReview && onOpenReviewModal && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                      <div className="flex items-center gap-2 text-amber-950 font-medium">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                        <span>
                          {completedBookingForReview.isReviewed
                            ? `คุณเคยให้คะแนนชุดนี้แล้ว (${completedBookingForReview.reviewRating || 5} ดาว)`
                            : 'คุณเคยเช่าชุดนี้เรียบร้อยแล้ว แบ่งปันความประทับใจของคุณได้นะคะ'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenReviewModal(completedBookingForReview, item);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs active:scale-95 transition-all self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        <span>{completedBookingForReview.isReviewed ? 'ดู / แก้ไขรีวิวของคุณ' : 'เขียนรีวิวและให้คะแนนชุดนี้'}</span>
                      </button>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500 space-y-1">
                      <div className="w-10 h-10 rounded-full bg-stone-200/60 text-stone-400 flex items-center justify-center mx-auto mb-2">
                        <Star className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <p className="font-semibold text-neutral-800">ยังไม่มีรีวิวสำหรับชุดนี้</p>
                      <p className="text-[11px] font-light max-w-sm mx-auto">
                        เมื่อคุณเช่าชุดนี้และสถานะออเดอร์เปลี่ยนเป็น 'completed' คุณสามารถให้คะแนนและเขียนรีวิวเพื่อแบ่งปันความประทับใจได้ที่ตู้เสื้อผ้าของฉันค่ะ
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-left"
                        >
                          {/* Reviewer Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-rose-100 border border-stone-200 shrink-0 flex items-center justify-center font-bold text-rose-900 text-xs shadow-2xs">
                                {rev.userAvatar ? (
                                  <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                                ) : (
                                  rev.userName.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-neutral-900 truncate">
                                    {rev.userName}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-0.5 shadow-3xs">
                                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                    <span>เช่าจริงผ่านระบบ</span>
                                  </span>
                                </div>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {rev.date}
                                </span>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Fit & Occasion Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            {rev.sizeWorn && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-neutral-700 font-mono font-medium">
                                {rev.sizeWorn}
                              </span>
                            )}
                            {rev.fitFeedback && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-900 font-medium">
                                👗 {rev.fitFeedback}
                              </span>
                            )}
                            {rev.heightWeight && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                                📏 {rev.heightWeight}
                              </span>
                            )}
                            {rev.occasion && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                                ✨ {rev.occasion}
                              </span>
                            )}
                          </div>

                          {/* Comment */}
                          <p className="text-stone-700 leading-relaxed font-light">
                            {rev.comment}
                          </p>

                          {/* Impression tags */}
                          {rev.tags && rev.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {rev.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Booking Form */}
              <div className="lg:col-span-5">
                <form 
                  onSubmit={handleBookingSubmit}
                  className="sticky top-4 p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-4 shadow-sm"
                >
                  {/* Pricing Header */}
                  <div className="flex items-baseline justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-mono block">ค่าเช่าเริ่มต้น</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-bold text-neutral-950 font-mono tabular-nums">
                          ฿{item.pricePerDay.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-500">/ วัน</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-mono">เงินประกันมัดจำ</span>
                      <span className="text-xs font-mono font-medium text-stone-700">
                        ฿{item.deposit.toLocaleString()} (ได้คืนเต็ม)
                      </span>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        เลือกไซส์ที่ต้องการ *
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowSmartRecommender(true)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200/90 text-[11px] font-semibold transition-all cursor-pointer active:scale-95 shadow-3xs"
                          title="คำนวณไซส์ที่เหมาะกับคุณจากส่วนสูงและน้ำหนัก"
                        >
                          <Sparkles className="w-3 h-3 text-rose-600 fill-rose-200 shrink-0" />
                          <span>Smart Size Recommender</span>
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSizeGuide}
                          className="text-[11px] text-stone-500 hover:text-stone-800 hover:underline cursor-pointer"
                        >
                          ตารางไซส์
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {item.availableSizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer relative ${
                            selectedSize === sz
                              ? 'bg-neutral-950 text-white shadow-xs'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{sz}</span>
                          {smartSizeBadge === sz && (
                            <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-sans font-bold shadow-2xs">
                              แนะนำ
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {smartSizeBadge && (
                      <div className="mt-2 p-2.5 rounded-xl bg-rose-50/90 border border-rose-200/80 flex items-center justify-between text-[11px] text-rose-950 animate-fade-in shadow-3xs">
                        <span className="flex items-center gap-1.5 truncate">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>AI แนะนำ: ไซส์ <strong>{smartSizeBadge}</strong> เหมาะกับสัดส่วนของคุณ</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSmartRecommender(true)}
                          className="text-[10px] text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer shrink-0 ml-2"
                        >
                          คำนวณใหม่
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rental Package Selector */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 mb-1.5 block">
                      เลือกระยะเวลาแพ็กเกจเช่า
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handlePackageChange('3days')}
                        className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                          rentalPackage === '3days'
                            ? 'border-neutral-950 bg-white text-neutral-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-white/60 text-stone-600'
                        }`}
                      >
                        <div>3 วัน (วันงาน)</div>
                        <div className="text-[10px] text-stone-400 font-normal">ยอดนิยม</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePackageChange('5days')}
                        className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                          rentalPackage === '5days'
                            ? 'border-neutral-950 bg-white text-neutral-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-white/60 text-stone-600'
                        }`}
                      >
                        <div>5 วัน (ทริป)</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">ลด 10%</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePackageChange('7days')}
                        className={`p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                          rentalPackage === '7days'
                            ? 'border-neutral-950 bg-white text-neutral-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-white/60 text-stone-600'
                        }`}
                      >
                        <div>7 วัน (ลุยยาว)</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">ลด 20%</div>
                      </button>
                    </div>
                  </div>

                  {/* Dates input */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-1">วันที่เริ่มรับชุด</label>
                      <input
                        type="date"
                        min={today}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-1">วันที่ส่งคืนชุด</label>
                      <input
                        type="date"
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Complimentary Basting / Alteration */}
                  {item.alterationAvailable && (
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={needAlteration}
                          onChange={(e) => setNeedAlteration(e.target.checked)}
                          className="w-4 h-4 rounded border-stone-300 text-neutral-950"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-neutral-900 flex items-center gap-1">
                            <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                            <span>บริการสอยเก็บทรงฟรี (ไม่ตัดผ้า)</span>
                          </span>
                        </div>
                      </label>
                      {needAlteration && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {bastingPresets.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setAlterationNotes(preset)}
                                className={`text-[10px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                                  alterationNotes === preset
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                }`}
                              >
                                {idx === 0 ? '-0.5" เอว' : idx === 1 ? '-1.0" เอว' : idx === 2 ? '-1.5" เอว' : 'กระชับสะโพก'}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={alterationNotes}
                            onChange={(e) => setAlterationNotes(e.target.value)}
                            placeholder="ระบุ เช่น เก็บเอวเข้า 1 นิ้ว, หรือแจ้งรอบเอวจริง"
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Matching Accessories Add-on */}
                  {item.matchingAccessories && item.matchingAccessories.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-neutral-800 mb-1.5 block">
                        เพิ่มเครื่องประดับเข้าเซ็ท (+฿80)
                      </label>
                      <div className="space-y-1.5 text-xs">
                        {item.matchingAccessories.map((acc, idx) => (
                          <label
                            key={idx}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer ${
                              selectedAccessoryIndex === idx
                                ? 'bg-white border-neutral-900 font-medium'
                                : 'bg-white/60 border-stone-200 text-stone-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="accessory"
                                checked={selectedAccessoryIndex === idx}
                                onChange={() => setSelectedAccessoryIndex(selectedAccessoryIndex === idx ? null : idx)}
                                className="w-3.5 h-3.5 text-neutral-900"
                              />
                              <span>{acc}</span>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500">+฿80</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Selection */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 mb-1 block">
                      รูปแบบการรับชุด
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-neutral-900 focus:outline-none"
                    >
                      {item.deliveryOptions.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Deposit Options: Cash vs Zero-Deposit KYC */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-800 mb-1 block">
                      รูปแบบเงินมัดจำ
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDepositMethod('cash')}
                        className={`p-2 rounded-xl border text-left cursor-pointer ${
                          depositMethod === 'cash'
                            ? 'border-neutral-950 bg-white font-bold'
                            : 'border-stone-200 bg-white/60 text-stone-500'
                        }`}
                      >
                        <div className="font-mono text-xs">มัดจำเงินสด</div>
                        <div className="text-[10px] text-stone-500">คืนทันทีหลังตรวจรับ</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDepositMethod('kyc')}
                        className={`p-2 rounded-xl border text-left cursor-pointer ${
                          depositMethod === 'kyc'
                            ? 'border-neutral-950 bg-white font-bold'
                            : 'border-stone-200 bg-white/60 text-stone-500'
                        }`}
                      >
                        <div className="text-xs flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>มัดจำ ฿0 (KYC)</span>
                        </div>
                        <div className="text-[10px] text-stone-500">ใช้บัตรประชาชนยืนยัน</div>
                      </button>
                    </div>
                  </div>

                  {/* Renter Contact Info */}
                  <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-stone-600 block">ชื่อ-นามสกุล ผู้เช่า</label>
                        <input
                          type="text"
                          value={renterName}
                          onChange={(e) => setRenterName(e.target.value)}
                          required
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-600 block">เบอร์โทรศัพท์ติดต่อ</label>
                        <input
                          type="tel"
                          value={renterPhone}
                          onChange={(e) => setRenterPhone(e.target.value)}
                          required
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-mono"
                        />
                      </div>
                    </div>

                    {/* Delivery Address Input & Quick Presets */}
                    <div className="pt-1.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-700" />
                          <span>ที่อยู่สำหรับจัดส่งชุด / สถานที่รับพัสดุ</span>
                        </label>
                      </div>

                      {/* Quick Presets Microinteraction */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        <span className="text-[10px] text-stone-400 shrink-0 font-medium">เติมด่วน:</span>
                        {addressPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setDeliveryAddress(preset.addr);
                              setShippingNotes(preset.note);
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                              deliveryAddress === preset.addr
                                ? 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        placeholder="ระบุ: บ้านเลขที่, อาคาร/หมู่บ้าน, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-rose-900 placeholder:text-stone-400 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-500 block mb-0.5">
                        หมายเหตุการจัดส่งถึงไรเดอร์ / ขนส่ง (ไม่บังคับ)
                      </label>
                      <input
                        type="text"
                        value={shippingNotes}
                        onChange={(e) => setShippingNotes(e.target.value)}
                        placeholder="เช่น ฝากนิติบุคคลคอนโด A, โทรแจ้งก่อนส่ง 15 นาที, วางหน้าห้อง 402"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {/* Loyalty Points Redemption Block */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-amber-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                          👑
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-xs text-neutral-900">
                              คะแนนสะสม SETISTA Rewards
                            </span>
                            {currentUser && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300/80">
                                {currentTier} ({LOYALTY_TIERS[currentTier]?.multiplier}x)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-900 font-mono block mt-0.5">
                            {currentUser 
                              ? `คุณมี ${availablePoints.toLocaleString()} คะแนน (แลกส่วนลดเงินสดได้ ฿${maxUsablePoints.toLocaleString()})`
                              : 'เข้าสู่ระบบเพื่อสะสมแต้มและใช้คะแนนลด 1 คะแนน = ฿1'}
                          </span>
                        </div>
                      </div>

                      {currentUser ? (
                        availablePoints > 0 ? (
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={usePoints}
                              onChange={(e) => {
                                setUsePoints(e.target.checked);
                                if (e.target.checked && pointsToRedeem === 0) {
                                  setPointsToRedeem(maxUsablePoints);
                                }
                              }}
                              className="w-4 h-4 rounded text-rose-900 focus:ring-rose-800 cursor-pointer accent-rose-900"
                            />
                            <span className="text-xs font-bold text-rose-950">ใช้คะแนนลด</span>
                          </label>
                        ) : (
                          onOpenLoyaltyModal && (
                            <button
                              type="button"
                              onClick={onOpenLoyaltyModal}
                              className="text-[10px] text-rose-800 hover:text-rose-950 underline font-semibold cursor-pointer"
                            >
                              ดูระดับสมาชิก
                            </button>
                          )
                        )
                      ) : (
                        onOpenAuth && (
                          <button
                            type="button"
                            onClick={onOpenAuth}
                            className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            เข้าสู่ระบบเพื่อใช้แต้ม
                          </button>
                        )
                      )}
                    </div>

                    {usePoints && availablePoints > 0 && (
                      <div className="pt-2 border-t border-amber-200/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-600 text-[11px]">ระบุคะแนนที่ต้องการใช้:</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={maxUsablePoints}
                              value={pointsToRedeem}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(maxUsablePoints, Number(e.target.value) || 0));
                                setPointsToRedeem(val);
                              }}
                              className="w-20 px-2 py-1 bg-white rounded-lg border border-amber-300 font-mono font-bold text-xs text-right text-rose-950 focus:outline-none"
                            />
                            <span className="text-[11px] font-mono text-stone-500">pts</span>
                          </div>
                        </div>

                        {/* Quick point buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {[50, 100, 200, 500].filter(p => p <= maxUsablePoints).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPointsToRedeem(p)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${
                                pointsToRedeem === p
                                  ? 'bg-amber-900 text-white font-bold'
                                  : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-100/50'
                              }`}
                            >
                              ใช้ {p} pts (-฿{p})
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setPointsToRedeem(maxUsablePoints)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${
                              pointsToRedeem === maxUsablePoints
                                ? 'bg-amber-900 text-white font-bold'
                                : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-100/50'
                            }`}
                          >
                            ใช้สูงสุด ({maxUsablePoints} pts)
                          </button>
                        </div>

                        <div className="text-[10px] text-emerald-800 flex items-center justify-between font-medium">
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>ประหยัดเงินสดทันที ฿{pointsDiscount.toLocaleString()} (1 คะแนน = ฿1)</span>
                          </span>
                          {onOpenLoyaltyModal && (
                            <button
                              type="button"
                              onClick={onOpenLoyaltyModal}
                              className="text-stone-500 hover:text-neutral-900 underline text-[10px]"
                            >
                              ตรวจสมุดคะแนน
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Points earning projection ribbon */}
                    <div className="pt-1.5 flex items-center justify-between text-[10px] text-stone-600 border-t border-amber-200/50">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>คะแนนที่จะได้รับจากการเช่าออเดอร์นี้:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-rose-950 bg-white px-2 py-0.5 rounded border border-amber-200">
                          +{prospectivePoints} คะแนน
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          (คูณ {LOYALTY_TIERS[currentTier]?.multiplier || 1}x)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>ค่าเช่า ({rentalDays} วัน × ฿{item.pricePerDay.toLocaleString()}):</span>
                      <span className="font-mono text-neutral-900">฿{baseRentalFee.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>ส่วนลดแพ็กเกจ ({rentalDays >= 7 ? '20%' : '10%'}):</span>
                        <span className="font-mono">-฿{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {pointsDiscount > 0 && (
                      <div className="flex justify-between text-amber-900 font-semibold bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60">
                        <span className="flex items-center gap-1">
                          <span>👑 ส่วนลดคะแนนสะสม ({pointsDiscount} pts):</span>
                        </span>
                        <span className="font-mono">-฿{pointsDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    {selectedAccessoryIndex !== null && (
                      <div className="flex justify-between">
                        <span>เครื่องประดับเสริม:</span>
                        <span className="font-mono">+฿{accessoryFee}</span>
                      </div>
                    )}

                    {deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>ค่าจัดส่ง:</span>
                        <span className="font-mono">+฿{deliveryFee}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>เงินมัดจำ (ได้รับคืนเต็มจำนวน):</span>
                      <span className="font-mono">
                        {depositMethod === 'kyc' ? '฿0 (KYC)' : `฿${effectiveDeposit.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-neutral-950">
                      <span>ยอดชำระสุทธิ:</span>
                      <span className="text-xl font-mono text-rose-950">฿{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 text-[11px] text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-stone-300 text-neutral-950"
                      />
                      <span>
                        ข้าพเจ้าเข้าใจและยอมรับ{' '}
                        <button
                          type="button"
                          onClick={() => onOpenContract(item, rentalDays, startDate, endDate, selectedSize)}
                          className="text-neutral-950 underline font-semibold hover:text-rose-800"
                        >
                          เงื่อนไขสัญญาเช่าชุดและการดูแล
                        </button>
                      </span>
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={!agreeTerms}
                    className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Receipt className="w-4 h-4 text-rose-300" />
                    <span>ยืนยันการจองเช่าชุด (฿{grandTotal.toLocaleString()})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat(item)}
                    className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:text-neutral-950 hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2 active:scale-98"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-rose-700" />
                    <span>💬 คุยสัญญากับทางร้าน / เจรจาเงื่อนไขก่อนเช่า</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Size Recommender Modal */}
      {showSmartRecommender && (
        <SmartSizeRecommenderModal
          isOpen={showSmartRecommender}
          item={item}
          initialSize={selectedSize}
          onClose={() => setShowSmartRecommender(false)}
          onApplyRecommendedSize={(size, alterationSuggestion) => {
            setSelectedSize(size);
            setSmartSizeBadge(size);
            if (alterationSuggestion) {
              setNeedAlteration(true);
              setAlterationNotes(alterationSuggestion);
            }
          }}
        />
      )}
    </div>
  );
};
