import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { OccasionCategory } from '../types/rental';

interface FooterProps {
  onSelectCategory: (cat: OccasionCategory) => void;
  onNavigateTab: (tab: any) => void;
  onOpenSizeGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onNavigateTab, 
  onOpenSizeGuide
}) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800 pt-14 pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <span className="w-8 h-8 rounded-full bg-rose-900/60 border border-rose-400/30 text-rose-200 flex items-center justify-center font-bold text-sm">
                S
              </span>
              <span>SETISTA Bangkok</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              ร้านเช่าชุดเซ็ทผู้หญิงระดับพรีเมียมอันดับหนึ่ง คัดสรรชุดเซ็ทสองชิ้นดีไซน์ระดับลักชัวรี พร้อมบริการสอยเก็บทรงฟรีและซักแห้งให้ ไม่ต้องซักคืน
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-rose-300 pt-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>สตูดิโอทองหล่อ ซอย 13 & เกษรวิลเลจ ชิดลม</span>
            </div>
          </div>

          {/* Occasion Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              เลือกชุดตามโอกาส
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => { onSelectCategory('wedding'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  ชุดเซ็ทไปงานแต่ง & กาลาดินเนอร์
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('tweed'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  เซ็ทผ้าทวีตหรูหรา สไตล์คุณหนู
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('vacation'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  ชุดเซ็ทเที่ยวทะเล & รีสอร์ทหรู
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('cafe'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  เซ็ทคาเฟ่ & บรันช์ สไตล์เกาหลี
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('suit'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  สูทผู้หญิง & ลุคสมาร์ทบอสสาว
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('thai_modern'); onNavigateTab('browse'); }}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  ชุดเซ็ทไทยโมเดิร์น ผ้าไหมประยุกต์
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              บริการ & การดูแล
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-rose-200 transition-colors cursor-pointer text-rose-300"
                >
                  ★ ตารางเทียบไซส์ & วัดสัดส่วน
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('my-rentals')}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  ติดตามสถานะชุดที่เช่า
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('consign-closet')}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  ฝากชุดเซ็ทปล่อยเช่า (ส่วนแบ่ง 70%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('care-policy')}
                  className="hover:text-rose-200 transition-colors cursor-pointer"
                >
                  นโยบายซักแห้งฟรี & ประกันคราบ
                </button>
              </li>
            </ul>
          </div>

          {/* Boutique Promises */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              SETISTA Standard
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-light mb-3">
              ทุกชุดผ่านการฆ่าเชื้อด้วยโอโซนและไอน้ำบริสุทธิ์ ตรวจสภาพตะเข็บ ซิป และกระดุมก่อนส่งมอบถึงมือคุณ
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-stone-300 font-mono">
              <span className="px-2 py-1 rounded bg-stone-900 border border-stone-800">No Wash Return</span>
              <span className="px-2 py-1 rounded bg-stone-900 border border-stone-800">Free Basting</span>
              <span className="px-2 py-1 rounded bg-stone-900 border border-stone-800">PromptPay Escrow</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 SETISTA (ChaoDee Fashion Group). สงวนลิขสิทธิ์ทั้งหมด.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-stone-300 transition-colors">นโยบายความเป็นส่วนตัว</span>
            <span className="hover:text-stone-300 transition-colors">เงื่อนไขสัญญาเช่าชุด</span>
            <span className="hover:text-stone-300 transition-colors">นัดหมาย Fitting หน้าร้าน</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
