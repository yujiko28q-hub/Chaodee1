import React, { useState } from 'react';
import { SetBooking, WomenSetItem, UserAccount } from '../types/rental';
import { ItemVisual } from './ItemVisual';
import { 
  X, Star, Sparkles, Check, Heart, ShieldCheck, 
  Scissors, MessageSquare, ThumbsUp, Send
} from 'lucide-react';

interface ReviewModalProps {
  booking: SetBooking;
  item: WomenSetItem;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    bookingId: string;
    itemId: string;
    rating: number;
    comment: string;
    fitFeedback: string;
    heightWeight: string;
    tags: string[];
    occasion: string;
  }) => void;
  currentUser?: UserAccount | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  item,
  onClose,
  onSubmitReview,
  currentUser
}) => {
  const [rating, setRating] = useState<number>(booking.reviewRating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(
    booking.reviewComment || 
    'ชุดสวยมากตรงปกที่สุดค่ะ! เนื้อผ้ามีน้ำหนักทิ้งตัวหรูหรามาก ทางร้านสอยเก็บทรงได้พอดีเป๊ะ ใส่ไปงานแล้วคนชมทั้งงานเลยค่ะ ไม่ต้องซักคืนสะดวกสบายมาก ประทับใจ 10/10'
  );
  const [fitFeedback, setFitFeedback] = useState<string>('พอดีตัวเป๊ะ (True to size)');
  const [heightWeight, setHeightWeight] = useState<string>('สูง 164 ซม. / หนัก 48 กก.');
  const [occasion, setOccasion] = useState<string>(booking.eventOccasion || 'ไปงานแต่งงาน / งานเลี้ยงฉลอง');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'ชุดตรงปกมาก', 'ผ้านุ่มพรีเมียม', 'สอยทรงพอดีเป๊ะ', 'เพื่อนชมทั้งงาน'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'ชุดตรงปกมาก',
    'ผ้านุ่มพรีเมียม',
    'สอยทรงพอดีเป๊ะ',
    'เพื่อนชมทั้งงาน',
    'ส่งเร็วทันใจ',
    'แพ็กดีมีถุงสูท',
    'ไม่ต้องซักคืน สบายมาก',
    'มัดจำคืนไวมาก'
  ];

  const fitOptions = [
    'พอดีตัวเป๊ะ (True to size)',
    'หลวมเล็กน้อย (ควรสอยเก็บ)',
    'คับ/แน่นเล็กน้อย'
  ];

  const ratingLabels: Record<number, string> = {
    1: '1 ดาว - ต้องปรับปรุง',
    2: '2 ดาว - พอใช้ได้',
    3: '3 ดาว - ปานกลางตามมาตรฐาน',
    4: '4 ดาว - ดีมาก ประทับใจ',
    5: '5 ดาว - ยอดเยี่ยม สวยหรูตรงปกที่สุด!'
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        bookingId: booking.id,
        itemId: item.id,
        rating,
        comment,
        fitFeedback,
        heightWeight,
        tags: selectedTags,
        occasion
      });
      setIsSubmitting(false);
    }, 400);
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 text-left animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-neutral-900 leading-tight">
                ให้คะแนนและรีวิวชุดเซ็ท
              </h3>
              <p className="text-[11px] text-stone-500">
                แชร์ประสบการณ์หลังสวมใส่จริง เพื่อช่วยให้ผู้เช่าท่านอื่นเลือกชุดได้ง่ายขึ้น
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Garment Preview Card */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3.5">
            <div className="w-14 h-18 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
              <ItemVisual
                imageUrl={booking.imageUrl || item.imageUrl}
                title={booking.itemTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 text-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">
                {booking.brand}
              </span>
              <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">
                {booking.itemTitle}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-stone-500 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold font-mono text-[10px]">
                  ไซส์ที่เช่า: {booking.selectedSize}
                </span>
                <span>•</span>
                <span>เช่า {booking.totalDays} วัน</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">คำสั่งเช่าสำเร็จแล้ว</span>
              </div>
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="text-center p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <span className="text-xs font-semibold text-neutral-800 block">
              ระดับความประทับใจโดยรวมต่อชุดนี้ *
            </span>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= activeRating;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(starVal)}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                    title={`${starVal} ดาว`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled 
                          ? 'fill-amber-400 text-amber-500 drop-shadow-xs' 
                          : 'text-stone-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-bold text-amber-900 block font-sans">
              {ratingLabels[activeRating] || 'แตะเลือกดาวเพื่อประเมิน'}
            </span>
          </div>

          {/* Fit Feedback Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 block">
              ความพอดีของขนาดและทรงชุด (Fit Assessment) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {fitOptions.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitFeedback(fit)}
                  className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                    fitFeedback === fit
                      ? 'bg-neutral-950 text-white border-neutral-950 font-bold shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Context & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-neutral-800 block mb-1">
                ส่วนสูงและน้ำหนักของคุณ (เพื่อช่วยเทียบไซส์)
              </label>
              <input
                type="text"
                value={heightWeight}
                onChange={(e) => setHeightWeight(e.target.value)}
                placeholder="เช่น สูง 162 ซม. / หนัก 47 กก."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-rose-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-800 block mb-1">
                โอกาสที่ใส่ไปงาน
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="เช่น ไปงานแต่งงานโรงแรมหรู, ถ่ายรูปคาเฟ่"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-rose-900"
              />
            </div>
          </div>

          {/* Quick Impression Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 block">
              จุดเด่นที่ประทับใจ (เลือกได้หลายข้อ)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-rose-900 text-white border-rose-900 font-medium shadow-2xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-rose-200" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Comment Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 block">
              ความคิดเห็นและคำแนะนำสำหรับผู้เช่าท่านอื่น *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="เล่าความรู้สึกเมื่อสวมใส่ คุณภาพผ้า การสอยทรง และความสะดวกในการรับ-ส่งคืน..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-neutral-900 focus:outline-rose-900 leading-relaxed placeholder:text-stone-400"
            />
          </div>

          {/* Verified Reviewer Trust Badge */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>รีวิวนี้จะถูกติดป้าย "✓ ผู้เช่าจริงผ่านระบบ":</strong> รีวิวของคุณจะปรากฏในหน้ารายละเอียดชุดทันที เพื่อเป็นข้อมูลอ้างอิงคุณภาพให้กับสมาชิกลูกค้า SETISTA ท่านอื่น
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-rose-300" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'ส่งรีวิวชุด'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
