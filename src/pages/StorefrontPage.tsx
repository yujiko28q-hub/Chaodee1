import React from 'react';
import { WomenSetItem, OccasionCategory, ApparelSize } from '../types/rental';
import { HeroSection } from '../components/HeroSection';
import { FilterBar } from '../components/FilterBar';
import { RentalCard } from '../components/RentalCard';

interface StorefrontPageProps {
  items: WomenSetItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: OccasionCategory;
  setSelectedCategory: (cat: OccasionCategory) => void;
  selectedSize: ApparelSize | 'all';
  setSelectedSize: (size: ApparelSize | 'all') => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (avail: boolean | ((prev: boolean) => boolean)) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  onOpenSizeGuide: () => void;
  onSelectItem: (item: WomenSetItem) => void;
  onOpenChat: (item: WomenSetItem) => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = ({
  items,
  searchQuery,
  setSearchQuery,
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
  onOpenSizeGuide,
  onSelectItem,
  onOpenChat,
}) => {
  return (
    <div className="space-y-6">
      {/* Fashion Editorial Hero */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        onOpenSizeGuide={onOpenSizeGuide}
        onSearchSubmit={() => {}}
      />

      {/* Filter & Occasion Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        totalCount={items.length}
      />

      {/* Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-stone-200 shadow-2xs">
            <span className="text-4xl block mb-3">👗</span>
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              ไม่พบชุดเซ็ทตรงตามเงื่อนไขที่เลือก
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
              ลองล้างตัวกรองหรือเลือกโอกาสอื่น เพื่อค้นหาชุดเซ็ทที่คุณถูกใจ
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSize('all');
                setSearchQuery('');
                setOnlyAvailable(false);
                setMaxPrice(10000);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <RentalCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
