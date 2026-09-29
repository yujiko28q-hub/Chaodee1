import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, 
  RotateCcw, X, Sparkles, Eye, ShieldCheck 
} from 'lucide-react';

export interface ImageGalleryProps {
  images?: string[];
  primaryImage?: string;
  title: string;
  brand?: string;
  category?: string;
  conditionNote?: string;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images: propImages,
  primaryImage,
  title,
  brand,
  category,
  conditionNote = 'ผ่านการอบโอโซน & ตรวจสอบตะเข็บ 100%',
  className = '',
}) => {
  // If only 1 image provided, generate 3 high-quality preview angles based on that image / fashion views
  const effectiveImages = React.useMemo(() => {
    if (propImages && propImages.length > 0) return propImages;
    if (primaryImage) {
      return [
        primaryImage,
        // Close-up detail view URL or stylized variations
        `${primaryImage}${primaryImage.includes('?') ? '&' : '?'}view=detail`,
        `${primaryImage}${primaryImage.includes('?') ? '&' : '?'}view=fabric`,
      ];
    }
    return [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    ];
  }, [propImages, primaryImage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Swipe gesture state for touch screens
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, effectiveImages.length]);

  const zoomIn = () => setZoomLevel((z) => Math.min(3, Number((z + 0.5).toFixed(1))));
  const zoomOut = () => setZoomLevel((z) => Math.max(1, Number((z - 0.5).toFixed(1))));
  const resetZoom = () => setZoomLevel(1);

  const angleLabels = ['มุมมองหลัก', 'รายละเอียดเนื้อผ้า & ตะเข็บ', 'ทรงทั้งชุด & ป้ายแบรนด์'];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image Stage */}
      <div
        className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs select-none touch-pan-y group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={effectiveImages[currentIndex]}
          alt={`${title} - ภาพที่ ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
        />

        {/* Ambient bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Brand & Angle Indicator */}
        <div className="absolute bottom-3 left-4 right-14 text-white flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
            {brand && (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-semibold">{brand}</span>
                <span className="text-white/60">·</span>
              </>
            )}
            <span className="text-stone-200 text-[11px]">
              {angleLabels[currentIndex] || `มุมมองที่ ${currentIndex + 1}`}
            </span>
          </div>
        </div>

        {/* Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => {
            resetZoom();
            setIsLightboxOpen(true);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 backdrop-blur-md shadow-md border border-white/60 transition-all cursor-pointer active:scale-95 group-hover:opacity-100 opacity-90"
          title="แตะเพื่อซูมดูเนื้อผ้าและรายละเอียดชุด"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Inspection Guarantee Pin */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 border border-white/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{conditionNote}</span>
        </div>

        {/* Navigation Arrows (Visible on desktop hover or tap) */}
        {effectiveImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md backdrop-blur-md transition-opacity cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md backdrop-blur-md transition-opacity cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Mobile Swipe Dot Indicators */}
        {effectiveImages.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
            {effectiveImages.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white w-3' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {effectiveImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {effectiveImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[3/4] w-14 sm:w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                idx === currentIndex
                  ? 'border-neutral-900 ring-2 ring-neutral-900/20 shadow-xs'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`มุมมอง ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/60 text-white text-[9px] font-mono leading-none">
                {idx + 1}
              </span>
            </button>
          ))}
          <div className="text-[11px] text-stone-400 pl-2 font-light hidden sm:block">
            แตะหรือปัดเพื่อดูมุมมองต่างๆ
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-fade-in"
        >
          {/* Top Bar: Title & Zoom Controls & Close */}
          <div className="flex items-center justify-between gap-4 text-white z-20">
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-stone-100 flex items-center gap-2">
                <span>{title}</span>
                {brand && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-stone-300 font-sans">
                    {brand}
                  </span>
                )}
              </h4>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                {angleLabels[currentIndex] || `มุมมองที่ ${currentIndex + 1}`} (ซูม: {Math.round(zoomLevel * 100)}%)
              </p>
            </div>

            {/* Lightbox Controls */}
            <div className="flex items-center gap-2 bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
                title="ย่อขนาด"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
                title="รีเซ็ตการซูม"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-30 cursor-pointer transition-colors"
                title="ซูมขยายเพื่อดูเนื้อผ้า"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-stone-700 mx-1" />
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white cursor-pointer transition-colors"
                title="ปิด (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Zoomable Canvas */}
          <div className="relative flex-1 flex items-center justify-center overflow-auto my-4 cursor-grab select-none">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="max-w-2xl max-h-[75vh] flex items-center justify-center origin-center"
            >
              <img
                src={effectiveImages[currentIndex]}
                alt={title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-stone-800"
              />
            </div>

            {/* Next / Prev Buttons in Lightbox */}
            {effectiveImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700 shadow-xl cursor-pointer transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700 shadow-xl cursor-pointer transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 z-20 overflow-x-auto py-2">
            {effectiveImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  resetZoom();
                }}
                className={`relative aspect-[3/4] w-12 sm:w-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'border-white ring-2 ring-white/30 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
