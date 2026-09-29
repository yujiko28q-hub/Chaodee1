import React from 'react';
import { WomenSetItem, OccasionCategory, ApparelSize } from '../types/rental';
import { HeroSection } from '../components/HeroSection';
import { FilterBar } from '../components/FilterBar';
import { RentalCard } from '../components/RentalCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { StepByStepGuide } from '../components/StepByStepGuide';

interface StorefrontPageProps {
  items: WomenSetItem[];
  isLoading?: boolean;
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
  isLoading = false,
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
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSearchQuery('');
    setOnlyAvailable(false);
    setMaxPrice(10000);
  };

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <SkeletonLoader variant="card" count={8} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="search"
            title="ไม่พบชุดเซ็ทตรงตามเงื่อนไขที่เลือก"
            description="ลองปรับเปลี่ยนช่วงราคา ขนาดไซส์ หรือล้างตัวกรองเพื่อค้นหาชุดสวยในคอลเลกชันอื่นๆ"
            actionLabel="ล้างตัวกรองทั้งหมด"
            onAction={handleResetFilters}
            secondaryActionLabel="เลือกโอกาสยอดนิยม"
            onSecondaryAction={() => setSelectedCategory('wedding')}
          />
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

      {/* Step-by-Step Guide on How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12">
        <StepByStepGuide
          onStartExplore={() => {
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        />
      </section>
    </div>
  );
};

