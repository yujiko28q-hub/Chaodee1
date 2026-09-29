import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw, 
  CreditCard, ArrowRight, HelpCircle, Scissors 
} from 'lucide-react';

export interface StepByStepGuideProps {
  onStartExplore?: () => void;
  className?: string;
  variant?: 'inline' | 'compact';
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  onStartExplore,
  className = '',
  variant = 'inline',
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: 1,
      number: '01',
      title: 'เลือกชุด & ฟิตติ้งไซส์',
      subtitle: 'จองล่วงหน้า 3 - 7 วัน',
      desc: 'เลือกชุดเซ็ทแบรนด์เนมที่ถูกใจ พร้อมบริการนัดลองไซส์และเนาสอยความยาวให้พอดีรูปร่างฟรี โดยช่างมืออาชีพ',
      icon: <Scissors className="w-5 h-5 text-rose-500" />,
      detailHighlight: 'มีบริการลองชุดที่หน้าร้านทองหล่อ หรือส่งลองที่บ้าน',
      badge: 'ฟิตติ้งฟรี',
    },
    {
      step: 2,
      number: '02',
      title: 'มัดจำผ่าน Escrow ปลอดภัย',
      subtitle: 'คุ้มครองเงิน 100%',
      desc: 'ชำระค่าเช่าและวางเงินประกันมัดจำผ่านระบบบัญชีกลาง (Escrow) เงินของคุณจะได้รับการคุ้มครองตลอดระยะเวลาเช่า',
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      detailHighlight: 'รองรับพร้อมเพย์, บัตรเครดิต, และผ่อน 0%',
      badge: 'Escrow Guarantee',
    },
    {
      step: 3,
      number: '03',
      title: 'รับชุดสวยพร้อมใส่ ส่งฟรี',
      subtitle: 'ซักแห้งโอโซนเกรดแพทย์',
      desc: 'ชุดจัดส่งในถุงสูทพรีเมียมพร้อมไม้แขวน ผ่านการซักแห้งและอบฆ่าเชื้อด้วยโอโซนระดับมาตรฐานทางการแพทย์ แกะใส่ได้ทันที',
      icon: <Truck className="w-5 h-5 text-sky-500" />,
      detailHighlight: 'ส่งด่วน GrabExpress ใน กทม. ภายใน 2 ชั่วโมง',
      badge: 'ฟรีซักแห้ง',
    },
    {
      step: 4,
      number: '04',
      title: 'ส่งคืนง่าย รับมัดจำคืนทันที',
      subtitle: 'ไม่ต้องซักก่อนส่งคืน',
      desc: 'ใส่เสร็จไม่ต้องกังวลเรื่องคราบหรือการซัก แค่ใส่ถุงเดิมแล้วเรียกเมสเซนเจอร์เข้ารับ เมื่อทีมงานตรวจชุด จะโอนคืนมัดจำทันที',
      icon: <RotateCcw className="w-5 h-5 text-emerald-500" />,
      detailHighlight: 'ฟรีประกันคราบเลอะทั่วไป ไม่หักมัดจำ',
      badge: 'คืนมัดจำไว',
    },
  ];

  return (
    <section className={`rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4" />
            <span>HOW IT WORKS · ขั้นตอนการเช่าชุด</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-1">
            เช่าชุดสวย 4 ขั้นตอนง่ายๆ มั่นใจ ปลอดภัย 100%
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-light">
            ไม่ต้องซื้อชุดใหม่ใส่ครั้งเดียว สะดวก ประหยัดพื้นที่ตู้ และลด Fast Fashion
          </p>
        </div>

        {onStartExplore && (
          <button
            type="button"
            onClick={onStartExplore}
            className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>เริ่มเลือกชุดเลย</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((st, idx) => (
          <div
            key={st.step}
            onClick={() => setActiveStep(idx)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              activeStep === idx
                ? 'bg-rose-50/50 border-rose-200 ring-2 ring-rose-200/50 shadow-xs'
                : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
            }`}
          >
            {/* Step Number Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-stone-400">
                STEP {st.number}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 font-medium">
                {st.badge}
              </span>
            </div>

            {/* Icon & Title */}
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs mb-3">
              {st.icon}
            </div>

            <h4 className="font-serif font-bold text-base text-neutral-900 mb-0.5">
              {st.title}
            </h4>
            <span className="text-[11px] text-stone-500 font-medium block mb-2">
              {st.subtitle}
            </span>

            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {st.desc}
            </p>

            <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{st.detailHighlight}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
