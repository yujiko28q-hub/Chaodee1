import React, { useState, useMemo } from 'react';
import { 
  X, Check, HelpCircle, Sparkles, Ruler, Scissors, 
  ArrowRight, Globe, Info, Compass, ChevronRight, Eye,
  RotateCcw, Sliders, ExternalLink
} from 'lucide-react';
import { ApparelSize } from '../types/rental';

interface SizeGuideModalProps {
  onClose: () => void;
  onSelectRecommendedSize?: (size: ApparelSize) => void;
}

type TabType = 'intl_conversion' | 'visual_guide' | 'smart_recommender';
type UnitType = 'inches' | 'cm';

interface IntlSizeRow {
  size: ApparelSize;
  us: string;
  ukAu: string;
  eu: string;
  fr: string;
  it: string;
  jpKr: string;
  bustInches: string;
  bustCm: string;
  waistInches: string;
  waistCm: string;
  hipInches: string;
  hipCm: string;
  typicalWeight: string;
  thaiDescription: string;
}

const INTL_SIZES_DATA: IntlSizeRow[] = [
  {
    size: 'XS',
    us: '0 - 2',
    ukAu: '4 - 6',
    eu: '32 - 34',
    fr: '34',
    it: '38',
    jpKr: '5 (XS)',
    bustInches: '30 - 32"',
    bustCm: '76 - 81 ซม.',
    waistInches: '23 - 24"',
    waistCm: '58 - 62 ซม.',
    hipInches: '33 - 35"',
    hipCm: '84 - 89 ซม.',
    typicalWeight: '40 - 46 กก.',
    thaiDescription: 'หุ่นเพรียวบาง คอสตูมไซส์เล็ก'
  },
  {
    size: 'S',
    us: '4',
    ukAu: '8',
    eu: '36',
    fr: '36',
    it: '40',
    jpKr: '7 (S)',
    bustInches: '32 - 34"',
    bustCm: '81 - 86 ซม.',
    waistInches: '25 - 26"',
    waistCm: '63 - 67 ซม.',
    hipInches: '35 - 37"',
    hipCm: '89 - 94 ซม.',
    typicalWeight: '47 - 53 กก.',
    thaiDescription: 'สัดส่วนมาตรฐานเอเชียยอดนิยม'
  },
  {
    size: 'M',
    us: '6',
    ukAu: '10',
    eu: '38',
    fr: '38',
    it: '42',
    jpKr: '9 (M)',
    bustInches: '34 - 36"',
    bustCm: '86 - 91 ซม.',
    waistInches: '27 - 28"',
    waistCm: '68 - 72 ซม.',
    hipInches: '37 - 39"',
    hipCm: '94 - 99 ซม.',
    typicalWeight: '54 - 61 กก.',
    thaiDescription: 'ใส่สบาย ไม่รั้งสะโพกและอก'
  },
  {
    size: 'L',
    us: '8 - 10',
    ukAu: '12 - 14',
    eu: '40 - 42',
    fr: '40',
    it: '44',
    jpKr: '11 (L)',
    bustInches: '36 - 38"',
    bustCm: '91 - 97 ซม.',
    waistInches: '29 - 30"',
    waistCm: '73 - 77 ซม.',
    hipInches: '39 - 41"',
    hipCm: '99 - 104 ซม.',
    typicalWeight: '62 - 69 กก.',
    thaiDescription: 'ทรงปล่อย สบายตัว เสริมสง่าราศี'
  },
  {
    size: 'XL',
    us: '12',
    ukAu: '16',
    eu: '44',
    fr: '42',
    it: '46',
    jpKr: '13 (XL)',
    bustInches: '38 - 40"',
    bustCm: '97 - 102 ซม.',
    waistInches: '31 - 33"',
    waistCm: '78 - 84 ซม.',
    hipInches: '41 - 43"',
    hipCm: '104 - 110 ซม.',
    typicalWeight: '70+ กก.',
    thaiDescription: 'พลัสไซส์ สวยมั่นใจ คัตติ้งพรีเมียม'
  }
];

const BRAND_SPOTLIGHTS = [
  {
    category: 'french',
    title: 'French Couture & Contemporary',
    brands: 'Chanel, Sandro, Maje, Dior, Jacquemus',
    system: 'FR (French Size 34, 36, 38...)',
    fitNote: 'คัตติ้งฝรั่งเศสเน้นช่วงไหล่สลิมและเอวคอดแบบ Parisian Chic หากสัดส่วนก้ำกึ่ง แนะนำปัดขึ้น 1 ไซส์ หรือเลือกบริการเนาเอวเข้าฟรี',
    reference: 'FR 36 = ไซส์ S (อก 32-34" / เอว 25-26")'
  },
  {
    category: 'italian',
    title: 'Italian Luxury & Tailoring',
    brands: 'Max Mara, Gucci, Prada, Fendi, Valentino',
    system: 'IT (Italian Size 38, 40, 42...)',
    fitNote: 'คัตติ้งสูทและเบลเซอร์อิตาลีมีโครงสร้างช่วงอกและสะโพกที่สง่างาม โค้งรับสรีระได้สัดส่วนทรงพลัง',
    reference: 'IT 40 = ไซส์ S (อก 32-34" / เอว 25-26")'
  },
  {
    category: 'resort',
    title: 'Resort & Vacation Luxury',
    brands: 'Zimmermann, Reformation, Cult Gaia',
    system: 'AU / US (AU 8 = US 4 = ไซส์ S)',
    fitNote: 'เดรสลินินและผ้าไหมชีฟองมักมีดีเทลสม็อกหลังหรือสายผูกปรับได้ จึงมีความยืดหยุ่นสูงรอบอกและเอว',
    reference: 'Zimmermann Size 0-1 = ไซส์ S (เอว 25-27")'
  },
  {
    category: 'uk',
    title: 'British Occasionwear & Evening',
    brands: 'Self-Portrait, Needle & Thread, ASOS Edition',
    system: 'UK (UK 6, 8, 10...)',
    fitNote: 'เดรสลูกไม้คอร์เซ็ตและทวีตมักเป็นผ้าไม่ยืด (Non-stretch) จึงแนะนำให้ยึดขนาดรอบอกและเอวจริงเป็นหลัก',
    reference: 'UK 8 = ไซส์ S (อก 33" / เอว 25.5")'
  }
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  onClose,
  onSelectRecommendedSize
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<TabType>('intl_conversion');
  const [unit, setUnit] = useState<UnitType>('inches');
  const [activeMeasurementPoint, setActiveMeasurementPoint] = useState<'bust' | 'waist' | 'hip' | 'length'>('bust');

  // Height and Weight state for Smart Fit Calculator
  const [height, setHeight] = useState<number>(162);
  const [weight, setWeight] = useState<number>(50);
  const [fitPref, setFitPref] = useState<'fitted' | 'regular' | 'relaxed'>('regular');

  // Tape measurements state
  const [tapeBust, setTapeBust] = useState<number>(33);
  const [tapeWaist, setTapeWaist] = useState<number>(25);
  const [tapeHip, setTapeHip] = useState<number>(36);

  // Height & Weight calculation
  const hwEstimate = useMemo(() => {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const estBust = Math.round((32.5 + (bmi - 20) * 0.95 + (weight - 50) * 0.15) * 10) / 10;
    const estWaist = Math.round((25.0 + (bmi - 20) * 1.15 + (weight - 50) * 0.18) * 10) / 10;
    const estHip = Math.round((35.5 + (bmi - 20) * 1.25 + (weight - 50) * 0.22) * 10) / 10;

    let recSize: ApparelSize = 'S';
    let advice = '';

    if (weight <= 45 && height <= 160) {
      recSize = 'XS';
      advice = 'สัดส่วนเพรียวบาง ไซส์ XS สวมใส่พอดีช่วงอกและเอวสวยที่สุด';
    } else if (weight <= 53) {
      if (fitPref === 'fitted' && weight <= 48) {
        recSize = 'XS';
        advice = 'สไตล์เข้ารูป ไซส์ XS ช่วยเน้นสัดส่วนเอวคอดสวยสะกดตา';
      } else {
        recSize = 'S';
        advice = 'สัดส่วนมาตรฐาน ไซส์ S ใส่พอดีตัวเป๊ะ หรือเลือกใช้บริการเนาเก็บเอวเข้าได้ฟรี';
      }
    } else if (weight <= 61) {
      if (fitPref === 'relaxed') {
        recSize = 'L';
        advice = 'ทรงหลวมสบาย ไซส์ L ให้พื้นที่ขยับตัวและรับประทานอาหารสบายใจ';
      } else {
        recSize = 'M';
        advice = 'ไซส์ M ใส่สบาย ไม่รั้งสะโพกและหน้าอก แนะนำสำหรับงานที่ต้องเคลื่อนไหวหรือนั่งนาน';
      }
    } else if (weight <= 70) {
      recSize = 'L';
      advice = 'ไซส์ L มีพื้นที่ช่วงอกและสะโพกสวยงาม ทรงทิ้งตัวสง่า ไม่รัดรูป';
    } else {
      recSize = 'XL';
      advice = 'ไซส์ XL คัตติ้งพลัสไซส์ สวยมั่นใจ ทรงปล่อยเสริมบุคลิกภาพสง่างาม';
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      estBust,
      estWaist,
      estHip,
      recSize,
      advice
    };
  }, [height, weight, fitPref]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 max-sm:p-0 max-sm:items-end animate-fade-in text-left font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl max-sm:rounded-b-none max-sm:rounded-t-3xl shadow-2xl overflow-hidden my-auto max-sm:my-0 max-h-[92vh] max-sm:max-h-[94vh] flex flex-col text-left animate-scale-in border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull / Drag Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-stone-50/90 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 bg-stone-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-900 text-white flex items-center justify-center shadow-xs">
              <Ruler className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  คู่มือไซส์สากล & ไดอะแกรมวิธีวัดตัว
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-200">
                  Global Size Guide
                </span>
              </div>
              <p className="text-xs text-stone-500">
                ตารางเทียบขนาดแบรนด์เนมสากล (US / UK / EU / FR / IT) พร้อมภาพไดอะแกรมวิธีวัดตัวที่ถูกต้อง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-neutral-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-5 sm:px-6 pt-3 pb-2 border-b border-stone-200 bg-white gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('intl_conversion')}
            className={`py-2 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'intl_conversion'
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'bg-stone-100 text-stone-600 hover:text-neutral-900 hover:bg-stone-200/80'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-rose-300" />
            <span>ตารางเทียบแบรนด์สากล (US/UK/EU/FR/IT)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visual_guide')}
            className={`py-2 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'visual_guide'
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'bg-stone-100 text-stone-600 hover:text-neutral-900 hover:bg-stone-200/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-rose-300" />
            <span>ไดอะแกรมภาพวิธีวัดตัว (Measurement Diagram)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('smart_recommender')}
            className={`py-2 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'smart_recommender'
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'bg-stone-100 text-stone-600 hover:text-neutral-900 hover:bg-stone-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>คำนวณไซส์จากส่วนสูง/น้ำหนัก</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6 text-xs text-neutral-800">
          
          {/* TAB 1: INTERNATIONAL BRAND SIZE CONVERSION */}
          {activeTab === 'intl_conversion' && (
            <div className="space-y-5 animate-fade-in">
              {/* Controls: Unit Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-700 text-xs">
                  <Globe className="w-4 h-4 text-rose-800 shrink-0" />
                  <span>ระบบไซส์เทียบตามมาตรฐานสากล (US / UK / EU / FR / IT / JP)</span>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center gap-1 self-start sm:self-auto bg-stone-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUnit('inches')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                      unit === 'inches'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-stone-600 hover:text-neutral-900'
                    }`}
                  >
                    นิ้ว (Inches)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('cm')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                      unit === 'cm'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-stone-600 hover:text-neutral-900'
                    }`}
                  >
                    ซม. (cm)
                  </button>
                </div>
              </div>

              {/* Main Visual Conversion Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span>ตารางเทียบไซส์เสื้อผ้าสตรีสากล (Women's International Sizing Chart)</span>
                  </h4>
                  <span className="text-[10px] text-stone-500 font-mono">
                    หน่วย: {unit === 'inches' ? 'นิ้ว (Inches)' : 'เซนติเมตร (cm)'}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100/90 border-b border-stone-200 text-stone-800 font-semibold text-[11px]">
                        <th className="py-3 px-3.5 bg-stone-200/70">ไซส์สากล</th>
                        <th className="py-3 px-2.5">สหรัฐฯ (US)</th>
                        <th className="py-3 px-2.5">อังกฤษ (UK/AU)</th>
                        <th className="py-3 px-2.5">ยุโรป (EU)</th>
                        <th className="py-3 px-2.5 text-rose-900 font-bold bg-rose-50/70">ฝรั่งเศส (FR)</th>
                        <th className="py-3 px-2.5 text-stone-900 font-bold bg-amber-50/60">อิตาลี (IT)</th>
                        <th className="py-3 px-2.5">ญี่ปุ่น (JP)</th>
                        <th className="py-3 px-3">รอบอก</th>
                        <th className="py-3 px-3">รอบเอว</th>
                        <th className="py-3 px-3">สะโพก</th>
                        <th className="py-3 px-3 text-right">เลือกไซส์</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {INTL_SIZES_DATA.map((row) => {
                        const isRecommended = row.size === hwEstimate.recSize;

                        return (
                          <tr 
                            key={row.size}
                            className={`transition-colors ${
                              isRecommended 
                                ? 'bg-rose-50/80 font-medium' 
                                : 'hover:bg-stone-50/70'
                            }`}
                          >
                            <td className="py-3 px-3.5 font-bold font-mono text-neutral-950 bg-stone-100/40">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{row.size}</span>
                                {isRecommended && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-rose-900 text-white text-[8px] font-sans font-bold">
                                    แนะนำ
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2.5 font-mono text-stone-600">{row.us}</td>
                            <td className="py-3 px-2.5 font-mono text-stone-600">{row.ukAu}</td>
                            <td className="py-3 px-2.5 font-mono text-stone-600">{row.eu}</td>
                            <td className="py-3 px-2.5 font-mono font-bold text-rose-950 bg-rose-50/40">{row.fr}</td>
                            <td className="py-3 px-2.5 font-mono font-bold text-stone-950 bg-amber-50/30">{row.it}</td>
                            <td className="py-3 px-2.5 font-mono text-stone-600">{row.jpKr}</td>
                            <td className="py-3 px-3 font-mono text-neutral-800">
                              {unit === 'inches' ? row.bustInches : row.bustCm}
                            </td>
                            <td className="py-3 px-3 font-mono text-neutral-800">
                              {unit === 'inches' ? row.waistInches : row.waistCm}
                            </td>
                            <td className="py-3 px-3 font-mono text-neutral-800">
                              {unit === 'inches' ? row.hipInches : row.hipCm}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {onSelectRecommendedSize && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectRecommendedSize(row.size);
                                    onClose();
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-semibold hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer"
                                >
                                  เลือก {row.size}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Brand Specific Spotlights & Tips */}
              <div className="space-y-2.5">
                <h4 className="font-serif text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-rose-800" />
                  <span>เอกลักษณ์การตัดเย็บของแบรนด์ระดับโลก (Brand Sizing Insights)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BRAND_SPOTLIGHTS.map((b, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">
                            {b.system}
                          </span>
                          <h5 className="font-bold text-neutral-900 text-xs mt-0.5">
                            {b.title}
                          </h5>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-[10px] font-mono text-stone-600">
                          {b.reference}
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-stone-500">
                        ตัวอย่างแบรนด์: {b.brands}
                      </p>

                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        {b.fitNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Tailoring Guarantee Ribbon */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>บริการเนาสอยเก็บทรงฟรี:</strong> ไม่มั่นใจระหว่าง 2 ไซส์? แนะนำเลือกไซส์ที่พอดีช่วงอก/สะโพก แล้วแจ้งให้ทางร้านเนาเก็บเอวเข้าได้ฟรีโดยไม่ตัดเนื้อผ้า
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL MEASUREMENT GUIDE & MANNEQUIN DIAGRAM */}
          {activeTab === 'visual_guide' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-rose-950 font-bold">
                  <Eye className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>ไดอะแกรมภาพวิธีวัดตัว (Interactive Visual Measurement Guide)</span>
                </div>
                <span className="text-[11px] text-stone-500">
                  แตะที่จุดบนหุ่นหรือการ์ดเพื่อดูตำแหน่งสายวัดอย่างละเอียด
                </span>
              </div>

              {/* Main Interactive Mannequin Diagram + Guide Cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Visual Dressmaker Mannequin SVG Illustration */}
                <div className="md:col-span-5 bg-gradient-to-b from-stone-50 to-stone-100 rounded-3xl border border-stone-200 p-4 flex flex-col items-center justify-center relative shadow-inner overflow-hidden min-h-[380px]">
                  
                  {/* Subtle Background Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-72 h-72 rounded-full border border-stone-400" />
                    <div className="w-48 h-48 rounded-full border border-stone-400 absolute" />
                  </div>

                  {/* SVG Female Silhouette with Measuring Lines */}
                  <svg 
                    viewBox="0 0 280 400" 
                    className="w-full h-80 max-w-[240px] drop-shadow-sm select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FAF7F2" />
                        <stop offset="50%" stopColor="#EFECE6" />
                        <stop offset="100%" stopColor="#E3DFD7" />
                      </linearGradient>
                      <linearGradient id="tapeBust" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#BE123C" />
                        <stop offset="100%" stopColor="#E11D48" />
                      </linearGradient>
                      <linearGradient id="tapeGold" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>

                    {/* Mannequin Stand Pole & Base */}
                    <rect x="138" y="290" width="4" height="95" fill="#A8A29E" rx="2" />
                    <path d="M110 385 L170 385 A4 4 0 0 1 174 389 L174 392 L106 392 L106 389 A4 4 0 0 1 110 385 Z" fill="#78716C" />

                    {/* Mannequin Neck Top Finial */}
                    <ellipse cx="140" cy="40" rx="9" ry="12" fill="#78716C" />
                    <rect x="135" y="48" width="10" height="14" fill="#881337" rx="2" />

                    {/* Female Couture Torso Silhouette Path */}
                    <path 
                      d="M125 62 
                         C110 66, 92 78, 86 96 
                         C82 108, 80 120, 84 135 
                         C88 152, 94 165, 102 185
                         C108 200, 110 208, 110 215 
                         C110 225, 104 235, 96 250 
                         C88 265, 84 280, 86 295
                         L194 295
                         C196 280, 192 265, 184 250
                         C176 235, 170 225, 170 215
                         C170 208, 172 200, 178 185
                         C186 165, 192 152, 196 135
                         C200 120, 198 108, 194 96
                         C188 78, 170 66, 155 62
                         Z" 
                      fill="url(#bodyGrad)" 
                      stroke="#D6D3D1" 
                      strokeWidth="1.5" 
                    />

                    {/* Princess seam lines on mannequin */}
                    <path d="M120 70 C114 110, 114 170, 126 215 C132 245, 132 270, 130 295" stroke="#E7E5E4" strokeWidth="1.5" strokeDasharray="3,2" fill="none" />
                    <path d="M160 70 C166 110, 166 170, 154 215 C148 245, 148 270, 150 295" stroke="#E7E5E4" strokeWidth="1.5" strokeDasharray="3,2" fill="none" />

                    {/* ================= MEASUREMENT TAPES ================= */}
                    
                    {/* 1. BUST TAPE (Y = 132) */}
                    <g 
                      className="cursor-pointer transition-transform" 
                      onClick={() => setActiveMeasurementPoint('bust')}
                    >
                      {/* Highlight glow if active */}
                      {activeMeasurementPoint === 'bust' && (
                        <rect x="74" y="126" width="132" height="14" rx="7" fill="#F43F5E" opacity="0.2" />
                      )}
                      {/* Tape band */}
                      <path d="M80 132 Q140 142 200 132" stroke="#BE123C" strokeWidth="6" strokeLinecap="round" fill="none" />
                      {/* Inch tick marks on tape */}
                      <path d="M88 132 L88 136 M98 133 L98 137 M108 134 L108 138 M118 135 L118 139 M128 136 L128 140 M138 136 L138 140 M148 136 L148 140 M158 135 L158 139 M168 134 L168 138 M178 133 L178 137 M188 132 L188 136" stroke="#FFFFFF" strokeWidth="1" />
                      {/* Marker badge */}
                      <circle cx="218" cy="132" r="11" fill="#881337" />
                      <text x="218" y="136" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                      <line x1="200" y1="132" x2="207" y2="132" stroke="#881337" strokeWidth="1.5" strokeDasharray="2,2" />
                    </g>

                    {/* 2. WAIST TAPE (Y = 212) */}
                    <g 
                      className="cursor-pointer transition-transform" 
                      onClick={() => setActiveMeasurementPoint('waist')}
                    >
                      {/* Highlight glow if active */}
                      {activeMeasurementPoint === 'waist' && (
                        <rect x="100" y="206" width="80" height="14" rx="7" fill="#D97706" opacity="0.25" />
                      )}
                      {/* Tape band */}
                      <path d="M106 212 Q140 220 174 212" stroke="#B45309" strokeWidth="6" strokeLinecap="round" fill="none" />
                      {/* Inch tick marks */}
                      <path d="M114 213 L114 217 M124 214 L124 218 M134 215 L134 219 M144 215 L144 219 M154 214 L154 218 M164 213 L164 217" stroke="#FFFFFF" strokeWidth="1" />
                      {/* Marker badge */}
                      <circle cx="62" cy="212" r="11" fill="#92400E" />
                      <text x="62" y="216" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                      <line x1="73" y1="212" x2="106" y2="212" stroke="#92400E" strokeWidth="1.5" strokeDasharray="2,2" />
                    </g>

                    {/* 3. HIP TAPE (Y = 280) */}
                    <g 
                      className="cursor-pointer transition-transform" 
                      onClick={() => setActiveMeasurementPoint('hip')}
                    >
                      {/* Highlight glow if active */}
                      {activeMeasurementPoint === 'hip' && (
                        <rect x="76" y="274" width="128" height="14" rx="7" fill="#047857" opacity="0.2" />
                      )}
                      {/* Tape band */}
                      <path d="M82 280 Q140 290 198 280" stroke="#047857" strokeWidth="6" strokeLinecap="round" fill="none" />
                      {/* Inch tick marks */}
                      <path d="M90 281 L90 285 M102 282 L102 286 M114 283 L114 287 M126 284 L126 288 M138 285 L138 289 M150 284 L150 288 M162 283 L162 287 M174 282 L174 286 M186 281 L186 285" stroke="#FFFFFF" strokeWidth="1" />
                      {/* Marker badge */}
                      <circle cx="218" cy="280" r="11" fill="#065F46" />
                      <text x="218" y="284" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>
                      <line x1="198" y1="280" x2="207" y2="280" stroke="#065F46" strokeWidth="1.5" strokeDasharray="2,2" />
                    </g>

                    {/* 4. TOTAL LENGTH LINE (Left vertical tape) */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setActiveMeasurementPoint('length')}
                    >
                      <line x1="42" y1="65" x2="42" y2="295" stroke="#6B7280" strokeWidth="2" strokeDasharray="4,3" />
                      <circle cx="42" cy="65" r="3" fill="#6B7280" />
                      <circle cx="42" cy="295" r="3" fill="#6B7280" />
                      <circle cx="42" cy="130" r="10" fill="#4B5563" />
                      <text x="42" y="134" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">4</text>
                    </g>
                  </svg>

                  {/* Caption underneath mannequin */}
                  <span className="text-[10px] text-stone-500 font-mono mt-1 text-center">
                    Couture Dressmaker Mannequin • จุดวัด 4 ตำแหน่งหลัก
                  </span>
                </div>

                {/* Step-by-Step Measurement Cards */}
                <div className="md:col-span-7 space-y-2.5">
                  
                  {/* Point 1: Bust */}
                  <div 
                    onClick={() => setActiveMeasurementPoint('bust')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeMeasurementPoint === 'bust'
                        ? 'bg-rose-50/90 border-rose-300 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-rose-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h5 className="font-bold text-neutral-900 text-xs">
                        รอบอก (Bust): จุดกึ่งกลางยอดอก
                      </h5>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-8 leading-relaxed font-light">
                      สวมใส่ชุดชั้นในทรงปกติที่ตั้งใจจะใส่ในวันงาน ทาบสายวัดรอบตัวโดยผ่านจุดกึ่งกลางยอดอกที่นูนที่สุด วางสายวัดให้ขนานกับพื้น ไม่ดึงรัดตึงและไม่อ้าหลวม
                    </p>
                    <div className="mt-1 pl-8 flex gap-2 text-[10px] font-mono text-rose-800">
                      <span>✓ วัดขณะหายใจออกปกติ</span>
                      <span>✓ ไม่กดสายวัดจมลงในเนื้อ</span>
                    </div>
                  </div>

                  {/* Point 2: Waist */}
                  <div 
                    onClick={() => setActiveMeasurementPoint('waist')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeMeasurementPoint === 'waist'
                        ? 'bg-amber-50/90 border-amber-300 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h5 className="font-bold text-neutral-900 text-xs">
                        รอบเอว (Natural Waist): ส่วนที่คอดที่สุดเหนือสะดือ
                      </h5>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-8 leading-relaxed font-light">
                      หาจุดคอดที่สุดของลำตัว (อยู่เหนือระดับสะดือประมาณ 1 นิ้ว) ทาบสายวัดแนบลำตัว ยืนตรงผ่อนคลาย ไม่แขม่วพุง เพื่อให้ชุดใส่สบายตลอดทั้งวันงาน
                    </p>
                    <div className="mt-1 pl-8 flex gap-2 text-[10px] font-mono text-amber-800">
                      <span>✓ จุดธรรมชาติของเอว</span>
                      <span>✓ เผื่อสอยเก็บเอวเข้าได้ฟรี 0.5-1.5 นิ้ว</span>
                    </div>
                  </div>

                  {/* Point 3: Hips */}
                  <div 
                    onClick={() => setActiveMeasurementPoint('hip')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeMeasurementPoint === 'hip'
                        ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h5 className="font-bold text-neutral-900 text-xs">
                        รอบสะโพก (Hips): ส่วนที่ผายกว้างที่สุด
                      </h5>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-8 leading-relaxed font-light">
                      ยืนส้นเท้าชิดกัน วัดรอบสะโพกตรงส่วนที่ผายและนูนที่สุดของก้น โดยให้สายวัดขนานพื้นรอบตัว สำหรับกระโปรงทรงสอบหรือกางเกง ควรวัดให้ขยับนั่งได้สะดวก
                    </p>
                    <div className="mt-1 pl-8 flex gap-2 text-[10px] font-mono text-emerald-800">
                      <span>✓ ยืนเท้าชิด</span>
                      <span>✓ รองรับการนั่งและลุกยืนอย่างมั่นใจ</span>
                    </div>
                  </div>

                  {/* Point 4: Garment Length */}
                  <div 
                    onClick={() => setActiveMeasurementPoint('length')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeMeasurementPoint === 'length'
                        ? 'bg-stone-100 border-stone-400 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-stone-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        4
                      </span>
                      <h5 className="font-bold text-neutral-900 text-xs">
                        ความยาวเสื้อ & กระโปรง (Garment Length)
                      </h5>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-8 leading-relaxed font-light">
                      วัดจากจุดยอดไหล่ (ข้างคอ) ทิ้งดิ่งลงมาสำหรับเสื้อ หรือจากระดับขอบเอวลงมาตามความยาวกระโปรง/กางเกง เพื่อเทียบกับส่วนสูงและรองเท้าส้นสูงที่จะสวมใส่
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Tips Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <h5 className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-stone-600" />
                  <span>3 ข้อควรระวังในการวัดขนาดก่อนเช่าชุดออนไลน์</span>
                </h5>
                <ul className="space-y-1 text-stone-600 list-disc list-inside text-[11px] leading-relaxed font-light">
                  <li><strong>ใช้สายวัดมาตรฐานที่ไม่ยืด:</strong> หลีกเลี่ยงสายวัดผ้าที่ผ่านการใช้งานมานานจนยืดหย่อน</li>
                  <li><strong>วัดตอนช่วงบ่ายหรือเย็น:</strong> ร่างกายคนเราอาจขยายตัวเล็กน้อยหลังรับประทานอาหารและดื่มน้ำระหว่างวัน ซึ่งสะท้อนความพอดีในงานเลี้ยงจริงได้ดีที่สุด</li>
                  <li><strong>หากสัดส่วนก้ำกึ่งระหว่าง 2 ไซส์:</strong> แนะนำให้เลือกไซส์ที่ใหญ่กว่าเล็กน้อย แล้วติ๊กเลือก <em>"บริการเนาสอยเก็บทรงฟรี"</em> เพื่อให้ช่างเย็บปรับเอวเข้าตามขนาดจริงของคุณ</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: SMART FIT CALCULATOR (Height & Weight) */}
          {activeTab === 'smart_recommender' && (
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/90 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>ระบบคำนวณไซส์จากส่วนสูงและน้ำหนัก (Smart Height-Weight Engine)</span>
                </div>
                <span className="text-[10px] font-mono text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
                  BMI: {hwEstimate.bmi}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-stone-500 font-semibold mr-1">สัดส่วนพบบ่อย:</span>
                {[
                  { label: '158 ซม. / 46 กก.', h: 158, w: 46 },
                  { label: '162 ซม. / 50 กก.', h: 162, w: 50 },
                  { label: '165 ซม. / 54 กก.', h: 165, w: 54 },
                  { label: '168 ซม. / 58 กก.', h: 168, w: 58 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHeight(p.h);
                      setWeight(p.w);
                    }}
                    className={`px-2 py-0.5 rounded-md border text-[10px] font-mono transition-colors cursor-pointer ${
                      height === p.h && weight === p.w
                        ? 'bg-rose-900 text-white border-rose-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Height */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-rose-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-neutral-800">
                      ส่วนสูงของคุณ: <strong className="text-rose-900 font-mono text-sm">{height} ซม.</strong>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="185"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-rose-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>145 ซม.</span>
                    <span>185 ซม.</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-rose-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-neutral-800">
                      น้ำหนักของคุณ: <strong className="text-rose-900 font-mono text-sm">{weight} กก.</strong>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="38"
                    max="88"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-rose-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>38 กก.</span>
                    <span>88 กก.</span>
                  </div>
                </div>
              </div>

              {/* Fit Preference */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span className="text-[11px] text-stone-600 font-medium">ความกระชับที่ชอบ:</span>
                <div className="flex gap-1.5">
                  {(['fitted', 'regular', 'relaxed'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setFitPref(pref)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                        fitPref === pref
                          ? 'bg-rose-900 text-white border-rose-900 font-bold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {pref === 'fitted' ? 'เข้ารูป' : pref === 'regular' ? 'พอดีตัว (แนะนำ)' : 'ใส่สบาย'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Measurements Output */}
              <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">สัดส่วนประมาณการจากส่วนสูงและน้ำหนัก:</span>
                <div className="flex gap-3 font-mono font-medium text-rose-900">
                  <span>อก ~{hwEstimate.estBust}"</span>
                  <span>เอว ~{hwEstimate.estWaist}"</span>
                  <span>สะโพก ~{hwEstimate.estHip}"</span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl shadow-2xs">
                <div>
                  <span className="text-[11px] text-stone-500">ไซส์ที่แนะนำสำหรับคุณ:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-3 py-1 rounded-xl bg-rose-900 text-white font-bold text-sm font-mono shadow-2xs">
                      ไซส์ {hwEstimate.recSize}
                    </span>
                    <span className="text-xs text-neutral-800 leading-snug">{hwEstimate.advice}</span>
                  </div>
                </div>

                {onSelectRecommendedSize && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecommendedSize(hwEstimate.recSize);
                      onClose();
                    }}
                    className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    เลือกไซส์ {hwEstimate.recSize} ทันที
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <Info className="w-3.5 h-3.5 text-rose-700" />
            <span>มีข้อสงสัยเรื่องคัตติ้งเฉพาะรุ่น ปรึกษาแอดมินสไตลิสต์ผ่านระบบแชทได้ตลอดเวลา</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-950 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            เข้าใจแล้ว / ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
