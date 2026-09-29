import { useState, useMemo } from 'react';
import { useRentalContext } from '../context/RentalContext';
import { WomenSetItem, OccasionCategory, ApparelSize } from '../types/rental';

export interface RentalFilterOptions {
  searchQuery?: string;
  category?: OccasionCategory;
  size?: ApparelSize | 'all';
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  onlyAvailable?: boolean;
  maxPrice?: number;
}

export function useRentals(initialFilters?: RentalFilterOptions) {
  const { items, reviewsMap, saveItem, toggleItemAvailability, deleteItem } = useRentalContext();

  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<OccasionCategory>(initialFilters?.category || 'all');
  const [selectedSize, setSelectedSize] = useState<ApparelSize | 'all'>(initialFilters?.size || 'all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>(initialFilters?.sortBy || 'popular');
  const [onlyAvailable, setOnlyAvailable] = useState(initialFilters?.onlyAvailable || false);
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || 10000);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesCategory = item.categoryNameTh.toLowerCase().includes(q);
        const matchesDescription = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDescription) {
          return false;
        }
      }

      // Occasion Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Size
      if (selectedSize !== 'all' && !item.availableSizes.includes(selectedSize)) {
        return false;
      }

      // Availability
      if (onlyAvailable && !item.isAvailable) {
        return false;
      }

      // Price
      if (item.pricePerDay > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return b.reviewCount - a.reviewCount;
    });
  }, [items, searchQuery, selectedCategory, selectedSize, onlyAvailable, maxPrice, sortBy]);

  return {
    items,
    filteredItems,
    reviewsMap,
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
    saveItem,
    toggleItemAvailability,
    deleteItem,
  };
}
