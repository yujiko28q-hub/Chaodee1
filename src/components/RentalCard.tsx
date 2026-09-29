import React from 'react';
import { WomenSetItem } from '../types/rental';
import { ItemVisual } from './ItemVisual';
import { StatusBadge } from './StatusBadge';
import { VerifiedBadge } from './VerifiedBadge';
import { Star, MessageCircle, ArrowRight, Scissors } from 'lucide-react';

interface RentalCardProps {
  item: WomenSetItem;
  onSelect: (item: WomenSetItem) => void;
  onOpenChat: (item: WomenSetItem) => void;
}

export const RentalCard: React.FC<RentalCardProps> = ({
  item,
  onSelect,
  onOpenChat
}) => {
  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left">
      {/* Editorial Fashion Image Area (Aspect 3:4 or 4:5 for fashion looks) */}
      <div 
        onClick={() => onSelect(item)}
        className="relative aspect-3/4 w-full overflow-hidden bg-stone-900 cursor-pointer"
      >
        <ItemVisual
          imageUrl={item.imageUrl}
          imageAlt={item.imageAlt}
          title={item.title}
          brand={item.brand}
          categoryNameTh={item.categoryNameTh}
          badge={item.setTypeTh}
          className="w-full h-full"
        />

        {/* Free Dry Clean Badge Top Right */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-rose-200 border border-white/20">
          ฟรีซักแห้ง
        </div>

        {/* Status Badge Top Left overlay */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={item.isAvailable ? 'available' : 'rented'} size="sm" />
        </div>

        {/* Color Swatch & Alteration Flag Bottom Left */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[10px] text-neutral-800 font-medium">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-black/20"
            style={{ backgroundColor: item.colorHex }}
          />
          <span className="truncate max-w-[90px]">{item.colorName.split('&')[0]}</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-rose-800 tracking-wide uppercase text-[10px]">
                {item.brand}
              </span>
              <VerifiedBadge size="sm" showText={false} />
            </div>
            <div className="flex items-center text-amber-600 font-medium">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
              <span className="font-mono tabular-nums">{item.rating.toFixed(2)}</span>
              <span className="text-stone-400 ml-0.5">({item.reviewCount})</span>
            </div>
          </div>

          {/* Set Title */}
          <h3 
            onClick={() => onSelect(item)}
            className="font-serif text-base font-bold text-neutral-900 line-clamp-2 hover:text-rose-800 cursor-pointer leading-snug group-hover:text-rose-900 transition-colors"
          >
            {item.title}
          </h3>

          {/* Set Pieces Structure */}
          <p className="mt-1 text-xs text-stone-600 line-clamp-1">
            ✨ {item.setTypeTh}
          </p>

          {/* Available Sizes Badges */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-stone-400 uppercase font-mono">Sizes:</span>
            {item.availableSizes.map((sz) => (
              <span 
                key={sz} 
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 font-mono"
              >
                {sz}
              </span>
            ))}
            {item.alterationAvailable && (
              <span className="ml-auto text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                <Scissors className="w-2.5 h-2.5" /> สอยเก็บทรงฟรี
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price & Rent CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-stone-500 block uppercase font-mono">ราคาเช่าเริ่มต้น</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-neutral-950 font-mono tabular-nums">
                ฿{item.pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ วัน</span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              มัดจำ ฿{item.deposit.toLocaleString()} (ได้คืนเต็ม)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(item);
              }}
              title="ปรึกษาเรื่องไซส์กับ Stylist"
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-neutral-950 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelect(item)}
              className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>เช่าชุดนี้</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
