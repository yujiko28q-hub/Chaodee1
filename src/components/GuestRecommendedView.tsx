import React, { useState, useMemo } from 'react';
import { WomenSetItem, OccasionCategory } from '../types/rental';
import { ItemVisual } from './ItemVisual';
import { 
  Sparkles, Scissors, ShieldCheck, Truck, Star, ArrowRight, 
  Lock, CheckCircle2, Heart, Ruler, ChevronRight, UserCheck, Flame,
  Calendar, Check, Eye
} from 'lucide-react';

interface GuestRecommendedViewProps {
  recommendedItems: WomenSetItem[];
  onOpenAuth: () => void;
  onSelectItemPreview: (item: WomenSetItem) => void;
  onOpenSizeGuide?: () => void;
}

export const GuestRecommendedView: React.FC<GuestRecommendedViewProps> = ({
  recommendedItems,
  onOpenAuth,
  onSelectItemPreview,
  onOpenSizeGuide
}) => {
  // Microinteraction: Occasion Filter right in the Guest Showcase
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionCategory | 'all'>('all');
  
  // Microinteraction: Rental Duration Simulator (3 days vs 5 days vs 7 days)
  const [previewDuration, setPreviewDuration] = useState<3 | 5 | 7>(3);

  // Microinteraction: Liked items set (Heart animation)
  const [likedItemIds, setLikedItemIds] = useState<Set<string>>(new Set());

  const toggleLike = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setLikedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const filteredRecommended = useMemo(() => {
    if (selectedOccasion === 'all') return recommendedItems;
    return recommendedItems.filter((i) => i.category === selectedOccasion);
  }, [recommendedItems, selectedOccasion]);

  const occasions: { id: OccasionCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: '✨' },
    { id: 'wedding', label: 'งานแต่ง & กาล่า', icon: '💍' },
    { id: 'tweed', label: 'ทวีตคุณหนู', icon: '💎' },
    { id: 'suit', label: 'สูทสมาร์ท', icon: '💼' },
    { id: 'vacation', label: 'ทริปทะเล & รีสอร์ท', icon: '🌴' },
    { id: 'cafe', label: 'คาเฟ่ & บรันช์', icon: '☕' }
  ];

  return (
    <div className="space-y-16 pb-20 text-left">
      {/* 1. HERO RECOMMENDATION SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-stone-100 py-16 sm:py-24 border-b border-stone-800">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fbcfe8 1px, transparent 0)',
            backgroundSize: '36px 36px'
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-900/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 p-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span className="font-medium">SETISTA Curated Collection · ตู้เสื้อผ้าสำหรับผู้หญิงยุคใหม่</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.15]">
            บริการเช่าชุดเซ็ทผู้หญิงระดับพรีเมียม <br />
            <span className="text-rose-200 italic font-normal">สวยหรูในทุกโอกาสสำคัญ</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
            สัมผัสประสบการณ์เช่าชุดเซ็ทแบรนด์เนมและดีไซน์เนอร์ลุค พร้อมบริการสอยเก็บทรงฟรีด้วยมือ 
            ซักแห้งพรีเมียมพร้อมใส่ และจัดส่งตรงถึงหน้าบ้าน ไม่ต้องซักคืน
          </p>

          {/* Highlights Ribbon */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-stone-300 font-mono">
            <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 shadow-xs hover:border-rose-400 transition-colors">
              <Scissors className="w-3.5 h-3.5 text-rose-300" />
              <span>สอยเก็บทรงฟรีไม่ตัดผ้า</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 shadow-xs hover:border-emerald-400 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ซักแห้งเกรดโรงแรม 5 ดาว</span>
            </span>
            <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 shadow-xs hover:border-sky-400 transition-colors">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>จัดส่งด่วนทั่วประเทศ</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onOpenAuth}
              className="py-3.5 px-6 rounded-2xl bg-white text-neutral-950 hover:bg-stone-100 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
            >
              <UserCheck className="w-4 h-4 text-rose-700" />
              <span>เข้าสู่ระบบเพื่อเช่าชุด / สมัครสมาชิก</span>
              <ArrowRight className="w-4 h-4 text-rose-700 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#recommended-sets"
              className="py-3.5 px-6 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>ดูชุดเซ็ทแนะนำประจำสัปดาห์ ↓</span>
            </a>

            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="py-3.5 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-800/60 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>คำนวณไซส์ อก-เอว ฟรี</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CURATED & RECOMMENDED SETS GRID */}
      <section id="recommended-sets" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-mono uppercase font-bold tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>EDITOR'S RECOMMENDED PICKS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              ชุดเซ็ทแนะนำยอดนิยมประจำสัปดาห์
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
              คัดสรรชุดเซ็ทที่ได้รับความนิยมสูงสุด ตอบโจทย์ทั้งงานแต่ง ดินเนอร์ ทวีตคุณหนู และทริปพักผ่อน
            </p>
          </div>

          {/* Microinteraction: Duration Simulator Toggle */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 self-start sm:self-auto text-xs">
            <span className="text-[11px] text-stone-500 font-medium pl-2 hidden sm:inline">จำลองแพ็กเกจเช่า:</span>
            <div className="flex items-center gap-1">
              {([3, 5, 7] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setPreviewDuration(days)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    previewDuration === days
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-stone-600 hover:text-neutral-950 hover:bg-stone-200/60'
                  }`}
                >
                  {days} วัน {days >= 5 && <span className="text-[9px] text-rose-300 ml-0.5">ลดพิเศษ</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Microinteraction: Occasion Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
          {occasions.map((occ) => (
            <button
              key={occ.id}
              type="button"
              onClick={() => setSelectedOccasion(occ.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedOccasion === occ.id
                  ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span>{occ.icon}</span>
              <span>{occ.label}</span>
            </button>
          ))}
        </div>

        {/* Recommended Sets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecommended.slice(0, 8).map((item, index) => {
            const isLiked = likedItemIds.has(item.id);
            const discountPercent = previewDuration === 7 ? 0.20 : previewDuration === 5 ? 0.10 : 0;
            const calculatedTotal = Math.round(item.pricePerDay * previewDuration * (1 - discountPercent));

            return (
              <div
                key={item.id}
                onClick={() => onSelectItemPreview(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 relative"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <ItemVisual
                    imageUrl={item.imageUrl}
                    title={item.title}
                    categoryNameTh={item.categoryNameTh}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Microinteraction: Heart wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-80 shadow-xs z-20 cursor-pointer"
                    title={isLiked ? 'ถูกใจแล้ว' : 'บันทึกชุดที่ชอบ'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isLiked ? 'fill-rose-600 text-rose-600' : 'text-stone-600'
                      }`}
                    />
                  </button>

                  {/* Badge for Index */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md text-white text-[10px] font-mono tracking-wider font-semibold shadow-xs">
                      {index === 0 ? '🔥 แนะนำอันดับ 1' : index === 1 ? '✨ งานแต่ง Best Seller' : '⭐ ชุดแนะนำ'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold shadow-xs">
                      {item.categoryNameTh}
                    </span>
                  </div>

                  {/* Available Sizes Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-neutral-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl">
                    <span>ไซส์: {item.availableSizes.join(', ')}</span>
                    <span className="font-semibold text-rose-200">สอยทรงฟรี</span>
                  </div>
                </div>

                {/* Information Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                      <span className="font-mono uppercase tracking-wider text-[11px] text-neutral-600 font-semibold">
                        {item.brand}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-rose-900 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light leading-relaxed">
                      {item.setTypeTh} · {item.fabric}
                    </p>
                  </div>

                  {/* Price and Action */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-serif font-bold text-neutral-950">
                          ฿{calculatedTotal.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-stone-400 font-sans">
                          /{previewDuration} วัน
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        มัดจำ ฿{item.deposit.toLocaleString()} (ได้คืนเต็ม)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItemPreview(item);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>ดูรายละเอียด</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center p-8 bg-stone-50 rounded-3xl border border-stone-200">
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            ยังมีชุดเซ็ทอีกกว่า 20+ คอลเลกชันรอให้คุณเลือกเช่า
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            เข้าสู่ระบบเพื่อปลดล็อคการค้นหาตามสัดส่วน อก-เอว, ดูชุดตามโอกาส, เช่าชุด และติดตามตู้เสื้อผ้าของคุณ
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="mt-4 px-6 py-3 rounded-2xl bg-neutral-950 text-white hover:bg-neutral-800 font-bold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Lock className="w-3.5 h-3.5 text-rose-300" />
            <span>เข้าสู่ระบบเพื่อดูชุดทั้งหมดและจองเช่า</span>
          </button>
        </div>
      </section>

      {/* 3. HOW IT WORKS (ขั้นตอนการเช่าชุด) */}
      <section className="bg-stone-900 text-white py-16 sm:py-20 border-y border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono tracking-widest text-rose-300 uppercase font-bold">
              SIMPLE & LUXURY EXPERIENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-white">
              4 ขั้นตอนเช่าชุดง่ายๆ กับ SETISTA
            </h2>
            <p className="text-xs text-stone-400 mt-2 font-light">
              เปลี่ยนให้การแต่งตัวไปงานสำคัญเป็นเรื่องง่ายและคุ้มค่าที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3 text-left hover:border-rose-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-sm border border-rose-400/30">
                01
              </div>
              <h3 className="font-serif text-base font-bold text-white">เลือกชุดเซ็ทที่ถูกใจ</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                เลือกแบบชุด ไซส์ และวันที่ต้องการใช้งาน พร้อมดูตารางสัดส่วนอก-เอวได้อย่างละเอียด
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3 text-left hover:border-rose-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-sm border border-rose-400/30">
                02
              </div>
              <h3 className="font-serif text-base font-bold text-white">บริการสอยเก็บทรงฟรี</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                ระบุรอบเอวที่ต้องการ ช่างมืออาชีพจะสอยเนาชั่วคราวให้กระชับพอดีตัว โดยไม่ตัดเนื้อผ้าเดิม
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3 text-left hover:border-rose-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-sm border border-rose-400/30">
                03
              </div>
              <h3 className="font-serif text-base font-bold text-white">ส่งตรงถึงหน้าบ้าน</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                จัดส่งชุดล่วงหน้าก่อนวันงาน 1 วัน พร้อมถุงคลุมสูทและไม้แขวน เพื่อให้คุณลองสวมใส่ได้ทันที
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3 text-left hover:border-rose-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-sm border border-rose-400/30">
                04
              </div>
              <h3 className="font-serif text-base font-bold text-white">ใส่เสร็จคืนไม่ต้องซัก</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                ใส่เสร็จแพ็คคืนตามรอบ ทางร้านมีบริการสปาซักแห้งโอโซนให้ฟรี และโอนคืนเงินมัดจำทันที
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-rose-950 via-stone-900 to-neutral-950 text-white rounded-3xl p-8 sm:p-12 border border-rose-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono text-rose-300 tracking-wider uppercase font-bold">
              JOIN SETISTA BOUTIQUE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              พร้อมสัมผัสประสบการณ์เช่าชุดเซ็ทระดับพรีเมียม?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              เข้าสู่ระบบเพื่อเช่าชุด ตรวจสอบคิวว่าง และจัดการตู้เสื้อผ้าของคุณได้ทันที
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            className="py-3.5 px-6 rounded-2xl bg-white text-neutral-950 hover:bg-stone-100 font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <UserCheck className="w-4 h-4 text-rose-700" />
            <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
          </button>
        </div>
      </section>
    </div>
  );
};
