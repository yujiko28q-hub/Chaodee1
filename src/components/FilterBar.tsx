import React from 'react';
import { OccasionCategory, ApparelSize } from '../types/rental';
import { Sparkles, ArrowUpDown, Check } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: OccasionCategory;
  setSelectedCategory: (cat: OccasionCategory) => void;
  selectedSize: ApparelSize | 'all';
  setSelectedSize: (size: ApparelSize | 'all') => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (val: boolean) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  totalCount: number;
}

const OCCASIONS: { id: OccasionCategory; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด (All Sets)' },
  { id: 'wedding', label: 'งานแต่ง & ดินเนอร์' },
  { id: 'tweed', label: 'เซ็ททวีต & คุณหนู' },
  { id: 'vacation', label: 'เที่ยวทะเล & รีสอร์ท' },
  { id: 'cafe', label: 'คาเฟ่ & บรันช์' },
  { id: 'suit', label: 'สูท & สมาร์ทเกิร์ล' },
  { id: 'thai_modern', label: 'ชุดไทยโมเดิร์น' },
];

const SIZES: (ApparelSize | 'all')[] = ['all', 'XS', 'S', 'M', 'L', 'XL'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  sortBy,
  setSortBy,
  onlyAvailable,
  setOnlyAvailable,
  maxPrice,
  setMaxPrice,
  totalCount
}) => {
  return (
    <div className="bg-white border-b border-stone-200 py-4 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Occasion Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {OCCASIONS.map((occ) => {
            const isActive = selectedCategory === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => setSelectedCategory(occ.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-stone-100 text-neutral-600 hover:bg-stone-200 hover:text-neutral-900'
                }`}
              >
                {occ.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Line */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Size selection buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-500 font-medium text-[11px]">เลือกไซส์:</span>
            <div className="flex items-center gap-1">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-7 h-7 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700 select-none text-[11px]">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-stone-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
              />
              <span>เฉพาะชุดที่ว่างพร้อมส่ง</span>
            </label>
          </div>

          {/* Right: Price & Sort */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-stone-500 text-[11px]">
              พบ {totalCount} ชุดเซ็ท
            </span>

            {/* Price Cap */}
            <div className="flex items-center gap-1.5 text-neutral-600">
              <span className="text-[11px]">งบค่าเช่า:</span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 text-xs font-mono text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value={10000}>ทุกราคา</option>
                <option value={450}>≤ ฿450 / วัน</option>
                <option value={600}>≤ ฿600 / วัน</option>
                <option value={800}>≤ ฿800 / วัน</option>
                <option value={1000}>≤ ฿1,000 / วัน</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 text-neutral-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 text-xs text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="popular">ยอดเช่าสูงสุด</option>
                <option value="price-asc">ราคา: ต่ำไปสูง</option>
                <option value="price-desc">ราคา: สูงไปต่ำ</option>
                <option value="rating">คะแนนรีวิว 5 ดาว</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
