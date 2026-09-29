import React, { useState, useMemo } from 'react';
import { WomenSetItem, ApparelSize } from '../types/rental';
import { 
  X, Sparkles, Ruler, Check, ArrowRight, Scissors, 
  HelpCircle, ThumbsUp, Info, RotateCcw, Sliders, ChevronDown
} from 'lucide-react';

interface SmartSizeRecommenderModalProps {
  isOpen: boolean;
  item: WomenSetItem;
  initialSize?: ApparelSize;
  onClose: () => void;
  onApplyRecommendedSize: (size: ApparelSize, alterationSuggestion?: string) => void;
}

type BodyShape = 'balanced' | 'hourglass' | 'pear' | 'rectangle' | 'apple';
type FitPreference = 'fitted' | 'regular' | 'relaxed';

interface SizeScoreResult {
  size: ApparelSize;
  score: number; // 0 to 100
  isRecommended: boolean;
  bustDiff: number; // estimated - chart mid
  waistDiff: number;
  hipDiff: number;
  verdict: 'perfect' | 'good' | 'snug' | 'loose' | 'too_tight' | 'too_large';
  verdictTextTh: string;
  alterationTip?: string;
  chartDetails: {
    bust: string;
    waist: string;
    hip: string;
    topLength?: string;
    bottomLength?: string;
  };
}

// Utility: parse measurement string like "32-34 นิ้ว" or "25-26 นิ้ว (สม็อกหลัง)" or "Free Size"
function parseRange(str?: string): { min: number; max: number; isFreeSize: boolean } {
  if (!str) return { min: 0, max: 100, isFreeSize: true };
  const lower = str.toLowerCase();
  if (lower.includes('free') || lower.includes('ฟรี')) {
    return { min: 0, max: 999, isFreeSize: true };
  }
  const matches = str.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (matches) {
    return { min: parseFloat(matches[1]), max: parseFloat(matches[2]), isFreeSize: false };
  }
  const single = str.match(/(\d+(?:\.\d+)?)/);
  if (single) {
    const val = parseFloat(single[1]);
    return { min: val - 1, max: val + 1, isFreeSize: false };
  }
  return { min: 0, max: 100, isFreeSize: true };
}

export const SmartSizeRecommenderModal: React.FC<SmartSizeRecommenderModalProps> = ({
  isOpen,
  item,
  initialSize,
  onClose,
  onApplyRecommendedSize
}) => {
  // Inputs: Height and Weight
  const [height, setHeight] = useState<number>(162); // cm
  const [weight, setWeight] = useState<number>(50);  // kg
  const [bodyShape, setBodyShape] = useState<BodyShape>('balanced');
  const [fitPref, setFitPref] = useState<FitPreference>('regular');
  const [showAdvancedTuning, setShowAdvancedTuning] = useState(false);

  // Optional manual fine-tuning overrides
  const [customBust, setCustomBust] = useState<number | null>(null);
  const [customWaist, setCustomWaist] = useState<number | null>(null);
  const [customHip, setCustomHip] = useState<number | null>(null);

  // Common body presets
  const quickPresets = [
    { label: '158 ซม. / 46 กก.', h: 158, w: 46 },
    { label: '162 ซม. / 50 กก.', h: 162, w: 50 },
    { label: '165 ซม. / 54 กก.', h: 165, w: 54 },
    { label: '168 ซม. / 58 กก.', h: 168, w: 58 },
    { label: '172 ซม. / 63 กก.', h: 172, w: 63 }
  ];

  // Calculate BMI and estimated body dimensions
  const estimates = useMemo(() => {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    // Baseline anthropometric estimation (in inches)
    let estBust = 32.5 + (bmi - 20) * 0.95 + (weight - 50) * 0.15;
    let estWaist = 25.0 + (bmi - 20) * 1.15 + (weight - 50) * 0.18;
    let estHip = 35.5 + (bmi - 20) * 1.25 + (weight - 50) * 0.22;

    // Body shape adjustments
    if (bodyShape === 'hourglass') {
      estBust += 1.0;
      estWaist -= 1.0;
      estHip += 1.2;
    } else if (bodyShape === 'pear') {
      estBust -= 0.8;
      estWaist -= 0.5;
      estHip += 1.8;
    } else if (bodyShape === 'rectangle') {
      estBust -= 0.5;
      estWaist += 1.0;
      estHip -= 0.6;
    } else if (bodyShape === 'apple') {
      estBust += 1.0;
      estWaist += 1.6;
      estHip -= 0.8;
    }

    // Apply manual overrides if set
    const finalBust = customBust ?? Math.round(estBust * 2) / 2;
    const finalWaist = customWaist ?? Math.round(estWaist * 2) / 2;
    const finalHip = customHip ?? Math.round(estHip * 2) / 2;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bust: finalBust,
      waist: finalWaist,
      hip: finalHip
    };
  }, [height, weight, bodyShape, customBust, customWaist, customHip]);

  // Evaluate each available size for this item against the estimated measurements
  const sizeEvaluations = useMemo<SizeScoreResult[]>(() => {
    const { bust, waist, hip } = estimates;
    const availableSizes = item.availableSizes || ['S', 'M', 'L'];

    const results: SizeScoreResult[] = availableSizes.map((size) => {
      const chart = item.measurements?.[size] || {
        bust: '32-34 นิ้ว',
        waist: '25-26 นิ้ว',
        hip: '35-37 นิ้ว'
      };

      const bustRange = parseRange(chart.bust);
      const waistRange = parseRange(chart.waist);
      const hipRange = parseRange(chart.hip);

      // Midpoints
      const bustMid = bustRange.isFreeSize ? bust : (bustRange.min + bustRange.max) / 2;
      const waistMid = waistRange.isFreeSize ? waist : (waistRange.min + waistRange.max) / 2;
      const hipMid = hipRange.isFreeSize ? hip : (hipRange.min + hipRange.max) / 2;

      // Penalties if outside range
      let penalty = 0;

      // Bust check
      if (!bustRange.isFreeSize) {
        if (bust > bustRange.max) {
          // Too tight in chest is severe
          penalty += (bust - bustRange.max) * 22;
        } else if (bust < bustRange.min) {
          penalty += (bustRange.min - bust) * 9;
        }
      }

      // Waist check
      if (!waistRange.isFreeSize) {
        if (waist > waistRange.max) {
          penalty += (waist - waistRange.max) * 24;
        } else if (waist < waistRange.min) {
          // If waist is smaller, easy to alter/tuck in
          penalty += (waistRange.min - waist) * 8;
        }
      }

      // Hip check
      if (!hipRange.isFreeSize) {
        if (hip > hipRange.max) {
          penalty += (hip - hipRange.max) * 20;
        } else if (hip < hipRange.min) {
          penalty += (hipRange.min - hip) * 7;
        }
      }

      // Preference adjustments
      if (fitPref === 'fitted') {
        // slightly favor smaller/exact fit
        if (bust <= bustRange.max && waist <= waistRange.max && hip <= hipRange.max) {
          penalty -= 4;
        }
      } else if (fitPref === 'relaxed') {
        // slightly favor extra room
        if (bust <= bustRange.max - 0.5 && waist <= waistRange.max - 0.5) {
          penalty -= 5;
        }
      }

      const score = Math.max(15, Math.min(99, Math.round(100 - penalty)));

      // Determine verdict
      let verdict: SizeScoreResult['verdict'] = 'good';
      let verdictTextTh = 'สวมใส่ได้พอดี';
      let alterationTip: string | undefined = undefined;

      if (score >= 90) {
        verdict = 'perfect';
        verdictTextTh = '✨ ขนาดพอดีตัวเป๊ะ (Best Match)';
      } else if (score >= 78) {
        verdict = 'good';
        verdictTextTh = 'สวมใส่สบาย ทรงสวย';
      } else if (bust > bustRange.max || waist > waistRange.max || hip > hipRange.max) {
        verdict = 'too_tight';
        verdictTextTh = 'อาจแน่นช่วง ' + 
          (bust > bustRange.max ? 'อก ' : '') + 
          (waist > waistRange.max ? 'เอว ' : '') + 
          (hip > hipRange.max ? 'สะโพก ' : '');
      } else {
        verdict = 'loose';
        verdictTextTh = 'ทรงค่อนข้างหลวม';
      }

      // Check for alteration advice
      if (waist < waistRange.min && !waistRange.isFreeSize) {
        const diff = Math.round((waistRange.min - waist) * 10) / 10;
        if (diff >= 0.5) {
          alterationTip = `เอวชุดอาจหลวมประมาณ ${diff} นิ้ว (แนะนำติ๊กเลือกบริการเนาสอยเอวเข้าฟรี)`;
        }
      }

      return {
        size,
        score,
        isRecommended: false,
        bustDiff: Math.round((bust - bustMid) * 10) / 10,
        waistDiff: Math.round((waist - waistMid) * 10) / 10,
        hipDiff: Math.round((hip - hipMid) * 10) / 10,
        verdict,
        verdictTextTh,
        alterationTip,
        chartDetails: chart
      };
    });

    // Find the highest scoring size
    let bestIndex = 0;
    let maxScore = -1;
    results.forEach((r, idx) => {
      if (r.score > maxScore) {
        maxScore = r.score;
        bestIndex = idx;
      }
    });

    if (results[bestIndex]) {
      results[bestIndex].isRecommended = true;
    }

    return results;
  }, [estimates, item.availableSizes, item.measurements, fitPref]);

  const recommendedResult = sizeEvaluations.find((r) => r.isRecommended) || sizeEvaluations[0];
  const [selectedPreview, setSelectedPreview] = useState<ApparelSize>(
    recommendedResult?.size || initialSize || 'S'
  );

  // Sync preview with recommendation if inputs change
  React.useEffect(() => {
    if (recommendedResult) {
      setSelectedPreview(recommendedResult.size);
    }
  }, [recommendedResult?.size]);

  // Keyboard shortcut: Press Escape to close this modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  if (!isOpen) return null;

  const currentPreviewData = sizeEvaluations.find((r) => r.size === selectedPreview) || recommendedResult;

  // Garment length context based on height
  const getLengthContext = () => {
    const topLen = currentPreviewData?.chartDetails?.topLength;
    const botLen = currentPreviewData?.chartDetails?.bottomLength;

    if (!topLen && !botLen) return null;

    let heightNote = '';
    if (height < 158) {
      heightNote = `สำหรับส่วนสูง ${height} ซม. ช่วงความยาวกระโปรง/กางเกง (${botLen || 'มาตรฐาน'}) จะทิ้งตัวพอดีข้อเท้า/เหนือเข่าเล็กน้อย แนะนำสวมรองเท้าส้นสูง 2-3 นิ้วเพื่อเสริมช่วงขา`;
    } else if (height > 168) {
      heightNote = `สำหรับส่วนสูง ${height} ซม. ช่วงความยาวเสื้อ (${topLen || 'มาตรฐาน'}) และกระโปรง/กางเกง (${botLen || 'มาตรฐาน'}) จะเผยให้เห็นช่วงขาเรียวสวย ทรงสง่ากำลังดี`;
    } else {
      heightNote = `สำหรับส่วนสูง ${height} ซม. สัดส่วนความยาวเสื้อและท่อนล่างอยู่ในเกณฑ์พอดีมาตรฐานของแบรนด์ สวมใส่กับรองเท้าส้นแบนหรือส้นสูงก็เข้ากัน`;
    }

    return heightNote;
  };

  const handleApply = () => {
    const alteration = currentPreviewData?.alterationTip 
      ? `เนาสอยเอวเข้าประมาณ 0.5 นิ้ว (ขนาดเอวจริง ${estimates.waist} นิ้ว)`
      : undefined;
    onApplyRecommendedSize(selectedPreview, alteration);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-left font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-in border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Ribbon */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  Smart Size Recommender™
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-200">
                  AI Fit Engine
                </span>
              </div>
              <p className="text-xs text-stone-500">
                คำนวณไซส์ที่ดีที่สุดสำหรับคุณจากส่วนสูงและน้ำหนัก เปรียบเทียบกับตารางไซส์ของชุดนี้
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-neutral-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-neutral-800 flex-1">
          {/* Target Item Reference Chip */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-12 h-14 rounded-xl object-cover border border-stone-200 shrink-0" 
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-800 block">
                  {item.brand}
                </span>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-neutral-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">
                  {item.setTypeTh} • ไซส์ที่ร้านมี: {item.availableSizes.join(', ')}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shrink-0">
              ฿{item.pricePerDay.toLocaleString()}/วัน
            </span>
          </div>

          {/* Quick Body Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-stone-600">
                ⚡ สัดส่วนยอดนิยม (แตะเพื่อกรอกทันที):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setHeight(p.h);
                    setWeight(p.w);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                    height === p.h && weight === p.w
                      ? 'bg-rose-900 text-white border-rose-900 font-bold shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Height and Weight Sliders & Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-200">
            {/* Height (ส่วนสูง) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-rose-800" />
                  <span>ส่วนสูงของคุณ (Height)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={140}
                    max={195}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value) || 160)}
                    className="w-16 px-2 py-1 rounded-lg border border-stone-300 bg-white font-mono font-bold text-center text-xs focus:ring-1 focus:ring-rose-800 focus:outline-none"
                  />
                  <span className="text-stone-500 font-mono text-[11px]">ซม.</span>
                </div>
              </div>

              <input
                type="range"
                min={145}
                max={185}
                step={1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-rose-900 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>145 ซม.</span>
                <span className="text-stone-700 font-bold">{height} ซม.</span>
                <span>185 ซม.</span>
              </div>
            </div>

            {/* Weight (น้ำหนัก) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span className="text-sm">⚖️</span>
                  <span>น้ำหนักของคุณ (Weight)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={35}
                    max={110}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value) || 50)}
                    className="w-16 px-2 py-1 rounded-lg border border-stone-300 bg-white font-mono font-bold text-center text-xs focus:ring-1 focus:ring-rose-800 focus:outline-none"
                  />
                  <span className="text-stone-500 font-mono text-[11px]">กก.</span>
                </div>
              </div>

              <input
                type="range"
                min={38}
                max={90}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-rose-900 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>38 กก.</span>
                <span className="text-stone-700 font-bold">{weight} กก. (BMI: {estimates.bmi})</span>
                <span>90 กก.</span>
              </div>
            </div>
          </div>

          {/* Fit Preference & Shape Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Fit Preference */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                ความกระชับที่ชอบ (Fit Preference):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFitPref('fitted')}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    fitPref === 'fitted'
                      ? 'bg-rose-900 text-white font-bold border-rose-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-[11px]">เข้ารูป</span>
                  <span className="text-[9px] opacity-80 block">เน้นเอวคอด</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFitPref('regular')}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    fitPref === 'regular'
                      ? 'bg-rose-900 text-white font-bold border-rose-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-[11px]">พอดีตัว</span>
                  <span className="text-[9px] opacity-80 block">แนะนำ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFitPref('relaxed')}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    fitPref === 'relaxed'
                      ? 'bg-rose-900 text-white font-bold border-rose-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-[11px]">ใส่สบาย</span>
                  <span className="text-[9px] opacity-80 block">ไม่รัดรูป</span>
                </button>
              </div>
            </div>

            {/* Body Shape */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                โครงสร้างรูปร่าง (Body Frame):
              </label>
              <select
                value={bodyShape}
                onChange={(e) => setBodyShape(e.target.value as BodyShape)}
                className="w-full p-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-800"
              >
                <option value="balanced">สัดส่วนมาตรฐาน สมดุล (Balanced)</option>
                <option value="hourglass">หุ่นนาฬิกาทราย เอวคอด (Hourglass)</option>
                <option value="pear">หุ่นลูกแพร์ สะโพกผาย (Pear Shape)</option>
                <option value="rectangle">หุ่นทรงตรง เพรียวบาง (Rectangle)</option>
                <option value="apple">หุ่นทรงแอปเปิ้ล มีหน้าอก (Apple Shape)</option>
              </select>
            </div>
          </div>

          {/* Real-time Estimated Measurements Breakdown */}
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-700 animate-pulse" />
              <span className="text-xs font-bold text-rose-950">
                สัดส่วนจำลองของคุณ (โดยประมาณ):
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-900">
                อก: <strong>{estimates.bust}"</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-900">
                เอว: <strong>{estimates.waist}"</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-900">
                สะโพก: <strong>{estimates.hip}"</strong>
              </span>
            </div>
          </div>

          {/* PRIMARY RECOMMENDATION CARD */}
          <div className="p-5 rounded-3xl bg-neutral-950 text-white shadow-xl relative overflow-hidden space-y-4">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-800/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-neutral-950 flex flex-col items-center justify-center font-mono font-black text-xl shadow-lg border-2 border-rose-300">
                  <span>{recommendedResult.size}</span>
                  <span className="text-[8px] font-sans font-bold text-rose-800 uppercase tracking-tighter -mt-1">
                    RECOMMENDED
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200 text-[10px] font-semibold border border-rose-700/60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-300" />
                      <span>ผลลัพธ์คำนวณที่ดีที่สุด</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">
                      ความเข้ากัน {recommendedResult.score}%
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mt-1">
                    SETISTA แนะนำ: ไซส์ {recommendedResult.size}
                  </h4>
                </div>
              </div>

              {/* Apply Size Button */}
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all self-start sm:self-auto shrink-0"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>นำไซส์ {recommendedResult.size} ไปใช้กับชุดนี้</span>
              </button>
            </div>

            {/* Match Details & Tailoring Advice */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-xs text-stone-200 space-y-2 relative z-10 leading-relaxed font-light">
              <p>
                💡 <strong>คำแนะนำการสวมใส่:</strong> สำหรับส่วนสูง {height} ซม. น้ำหนัก {weight} กก. ไซส์ <strong>{recommendedResult.size}</strong> จะช่วยให้ช่วงอกและสะโพกขยับเคลื่อนไหวได้สบายในวันงาน ไม่ปริรั้ง
              </p>

              {/* Chart spec of recommended size */}
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-mono text-rose-200">
                <span>ตารางไซส์ {recommendedResult.size}:</span>
                <span>อก {recommendedResult.chartDetails.bust}</span> • 
                <span>เอว {recommendedResult.chartDetails.waist}</span> • 
                <span>สะโพก {recommendedResult.chartDetails.hip}</span>
              </div>

              {/* Tailoring Tip */}
              {recommendedResult.alterationTip && (
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 flex items-start gap-2 text-[11px]">
                  <Scissors className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span>{recommendedResult.alterationTip}</span>
                </div>
              )}

              {/* Garment Length Context */}
              {getLengthContext() && (
                <p className="text-[11px] text-stone-300 flex items-start gap-1.5">
                  <Info className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                  <span>{getLengthContext()}</span>
                </p>
              )}
            </div>
          </div>

          {/* ALL SIZES COMPARISON TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                <span>เปรียบเทียบทุกไซส์ของชุดนี้ ({item.brand})</span>
              </h5>
              <span className="text-[10px] text-stone-500 font-mono">
                หน่วย: นิ้ว (Inches)
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold text-[11px]">
                    <th className="py-2.5 px-3">ไซส์</th>
                    <th className="py-2.5 px-3">รอบอกชุด</th>
                    <th className="py-2.5 px-3">รอบเอวชุด</th>
                    <th className="py-2.5 px-3">รอบสะโพกชุด</th>
                    <th className="py-2.5 px-3 text-center">ความเข้ากัน</th>
                    <th className="py-2.5 px-3 text-right">เลือก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sizeEvaluations.map((evalItem) => {
                    const isRec = evalItem.isRecommended;
                    const isSelected = selectedPreview === evalItem.size;

                    return (
                      <tr 
                        key={evalItem.size}
                        className={`transition-colors ${
                          isRec 
                            ? 'bg-rose-50/70 font-medium' 
                            : isSelected
                            ? 'bg-stone-50'
                            : 'hover:bg-stone-50/50'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sm text-neutral-950">
                              {evalItem.size}
                            </span>
                            {isRec && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-900 text-white text-[9px] font-bold">
                                แนะนำ
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600">
                          {evalItem.chartDetails.bust}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600">
                          {evalItem.chartDetails.waist}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600">
                          {evalItem.chartDetails.hip}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            evalItem.score >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : evalItem.score >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}>
                            {evalItem.score}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedPreview(evalItem.size)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'border border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {isSelected ? 'เลือกอยู่' : 'เลือกไซส์นี้'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guarantee Footer Note */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>หากลองชุดแล้วไม่พอดี สามารถติดต่อสตูดิโอเพื่อเปลี่ยนไซส์ได้ทันที หรือใช้บริการช่างเนาเก็บทรงฟรี</span>
            </span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-neutral-950 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>ใช้ไซส์ {selectedPreview} ในการจองชุดนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
