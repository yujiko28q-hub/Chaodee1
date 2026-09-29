import React from 'react';
import { Search, Sparkles, Scissors, Clock, ShieldCheck, HeartHandshake, Ruler, Store, LayoutDashboard, ArrowRight } from 'lucide-react';
import { OccasionCategory, ApparelSize } from '../types/rental';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: OccasionCategory;
  setSelectedCategory: (cat: OccasionCategory) => void;
  selectedSize: ApparelSize | 'all';
  setSelectedSize: (size: ApparelSize | 'all') => void;
  onOpenSizeGuide: () => void;
  onSearchSubmit: () => void;
  onSwitchToOwner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  onOpenSizeGuide,
  onSearchSubmit,
  onSwitchToOwner
}) => {
  const quickOccasions: { id: OccasionCategory; label: string }[] = [
    { id: 'wedding', label: '💍 ไปงานแต่ง & ดินเนอร์' },
    { id: 'tweed', label: '✨ เซ็ททวีตคุณหนู' },
    { id: 'vacation', label: '🌴 เที่ยวทะเล & รีสอร์ท' },
    { id: 'cafe', label: '☕ คาเฟ่ & บรันช์เกาหลี' },
    { id: 'suit', label: '💼 สูททำงาน & สัมภาษณ์' },
    { id: 'thai_modern', label: '🌸 ชุดไทยโมเดิร์น' },
  ];

  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 py-14 sm:py-20 border-b border-stone-800 text-left">
      {/* Editorial Luxury Ambient Overlay */}
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
        {/* Boutique Highlights Ribbon */}
        <div className="mb-6 inline-flex flex-wrap items-center gap-3 p-2.5 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-rose-100">
          <span className="flex items-center gap-1.5 font-medium">
            <Scissors className="w-3.5 h-3.5 text-amber-300" />
            <span>บริการสอยเก็บทรงฟรี</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>ซักแห้งเกรดโรงแรม 5 ดาว</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-rose-300" />
            <span>จัดส่งด่วนแมสเซนเจอร์ 2 ชม.</span>
          </span>
        </div>

        <div className="max-w-3xl">
          {/* Subtle luxury kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs tracking-wider uppercase font-mono mb-4 backdrop-blur-xs border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>The Curated Women's Co-ord & Set Closet</span>
          </div>

          {/* Headline with serif distinction */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            เช่าชุดเซ็ทสวยเป๊ะ <br className="hidden sm:inline" />
            <span className="italic font-normal text-rose-200">ไม่ต้องซื้อซ้ำ</span> เปลี่ยนลุคปังได้ทุกอีเวนต์
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl">
            คลังชุดเซ็ทสองชิ้น เสื้อครอป+กระโปรง เบลเซอร์ทวีตหรู ชุดไปงานแต่ง และเซ็ทรีสอร์ทแบรนด์ดัง 
            พร้อมบริการ <strong className="text-white font-medium">สอยเก็บทรงฟรี</strong> และ <strong className="text-white font-medium">ซักแห้งพรีเมียมให้ฟรี</strong> ใส่เสร็จส่งคืนได้ทันที
          </p>
        </div>

        {/* Interactive Search & Filter Console */}
        <div className="mt-8 max-w-4xl bg-white rounded-2xl p-3 sm:p-4 shadow-2xl text-neutral-900">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Input */}
            <div className="sm:col-span-5 flex items-center px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder="ค้นหาชุดเซ็ท เช่น ทวีต, Poem, ลินิน, ไปงานแต่ง..."
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            {/* Occasion Dropdown */}
            <div className="sm:col-span-3 flex items-center px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as OccasionCategory)}
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-700 focus:outline-none cursor-pointer"
              >
                <option value="all">ทุกโอกาส & สไตล์</option>
                <option value="wedding">💍 งานแต่ง & ดินเนอร์</option>
                <option value="tweed">✨ ทวีต & คุณหนู</option>
                <option value="vacation">🌴 ทะเล & รีสอร์ท</option>
                <option value="cafe">☕ คาเฟ่ & บรันช์</option>
                <option value="suit">💼 สูททำงาน & สัมภาษณ์</option>
                <option value="thai_modern">🌸 ชุดไทยโมเดิร์น</option>
              </select>
            </div>

            {/* Size Dropdown with Quick Link to Guide */}
            <div className="sm:col-span-2 flex items-center px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as any)}
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-700 focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">ทุกไซส์</option>
                <option value="XS">ไซส์ XS</option>
                <option value="S">ไซส์ S</option>
                <option value="M">ไซส์ M</option>
                <option value="L">ไซส์ L</option>
                <option value="XL">ไซส์ XL</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={onSearchSubmit}
                className="w-full h-full min-h-[42px] px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>ค้นหาชุด</span>
              </button>
            </div>
          </div>

          {/* Occasion Fast Pills */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-500 font-medium text-[11px]">เลือกตามโอกาส:</span>
              {quickOccasions.map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedCategory(occ.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedCategory === occ.id
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-stone-100 text-neutral-700 hover:bg-stone-200'
                  }`}
                >
                  {occ.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>ยังไม่แน่ใจไซส์? คลิกเทียบขนาด</span>
            </button>
          </div>
        </div>

        {/* 4 Fashion Rental Guarantees */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-stone-800/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-rose-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">ซักแห้งพรีเมียมให้ฟรี</h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                ใส่เสร็จส่งคืนได้ทันที ทางร้านดูแลทำความสะอาดระดับสปา
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">สอยเนาเก็บทรงฟรี</h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                ปรับเอวเข้า 0.5 - 1.5 นิ้วให้พอดีตัวเป๊ะก่อนจัดส่ง
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">ส่งถึงมือก่อนวันงาน 1 วัน</h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                มีเวลาลองชุดและจัดเตรียมเครื่องประดับ ไม่ต้องลุ้นวันงาน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-sky-300">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">ประกันรอยเปื้อนทั่วไป</h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                คราบเครื่องสำอางหรือละอองน้ำดื่ม ทางร้านดูแลให้หมดห่วง
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
