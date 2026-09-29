import React from 'react';
import { ShieldCheck, Scissors, Sparkles, CheckCircle2, HeartHandshake, HelpCircle } from 'lucide-react';

export const SafetyGuaranteeSection: React.FC = () => {
  const faqs = [
    {
      q: 'ใส่ชุดไปงานเสร็จแล้ว ต้องนำไปซักคืนเองไหมคะ?',
      a: 'ไม่ต้องซักคืนเด็ดขาดค่ะ! ทางร้าน SETISTA รวมบริการซักแห้งพรีเมียมด้วยสารทำความสะอาดออร์แกนิกเฉพาะสำหรับผ้าทวีต ซาติน และผ้าลูกไม้ให้ฟรีเรียบร้อยแล้ว หลังใส่เสร็จเพียงพับใส่ถุงสูทที่ทางร้านจัดเตรียมไว้แล้วส่งคืนได้เลยค่ะ'
    },
    {
      q: 'บริการ "สอยเก็บทรงฟรี" มีขั้นตอนอย่างไร?',
      a: 'หากลูกค้ากังวลเรื่องรอบเอวหรือความยาว ช่างเทเลอร์ประจำสตูดิโอจะทำการสอยเนาเก็บทรงด้วยมือตามสัดส่วนที่ระบุ โดยไม่ตัดแต่งเนื้อผ้าเดิมของชุด ทำให้ชุดพอดีตัวเป๊ะเหมือนตัดมาเฉพาะคุณ และแกะออกได้อย่างไร้รอยเมื่อส่งคืนค่ะ'
    },
    {
      q: 'หากเกิดรอยเปื้อนเครื่องสำอาง ลิปสติก หรือเครื่องดื่มในงาน จะโดนหักมัดจำไหม?',
      a: 'ทางร้านมี "ฟรีประกันรอยเปื้อนทั่วไป" คุ้มครองอุบัติเหตุเล็กน้อย เช่น คราบแป้ง รองพื้น ละอองเครื่องดื่ม ทางร้านมีทีมช่างสปาผ้าขจัดคราบให้โดยไม่มีค่าใช้จ่ายเพิ่มเติม ยกเว้นกรณีผ้าไหมฉีกขาด ขาดวิ่น หรือโดนประกายไฟค่ะ'
    },
    {
      q: 'ต้องการลองชุดก่อนตัดสินใจเช่า สามารถทำได้ไหม?',
      a: 'สามารถนัดเข้ามาลองชุดจริงได้ที่ SETISTA Studio สาขาทองหล่อ ซอย 13 และเกษรวิลเลจ ชิดลม หรือหากไม่สะดวกเดินทาง สามารถเลือกรับชุดล่วงหน้าก่อนวันงาน 1 วันเพื่อลองสวมที่บ้านได้ค่ะ'
    },
    {
      q: 'การขอคืนเงินมัดจำใช้เวลากี่วัน?',
      a: 'เมื่อชุดถูกส่งกลับถึงสตูดิโอ ทีมงานจะทำการตรวจเช็กชิ้นส่วนและเครื่องประดับ จากนั้นระบบจะโอนคืนเงินมัดจำเข้าบัญชีธนาคารของลูกค้าเต็มจำนวนโดยอัตโนมัติภายใน 24 ชั่วโมงค่ะ'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-left">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto pb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>SETISTA CARE & FASHION GUARANTEE</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          ใส่ชุดสวยอย่างมั่นใจ ไร้ความกังวล
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          เราดูแลชุดเซ็ททุกชุดด้วยมาตรฐานสตูดิโอชั้นสูง ทั้งการซักแห้งพรีเมียม สอยแก้ทรง และประกันความปลอดภัย
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">1. สปาซักแห้งพรีเมียมฟรี (Zero Hassle Return)</h3>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
            อบโอโซนฆ่าเชื้อและทำความสะอาดเฉพาะเนื้อผ้าหรูหรา ผู้เช่าใส่เสร็จส่งคืนได้ทันที ไม่ต้องเสียเวลาหรือค่าใช้จ่ายส่งซักเอง
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">2. สอยเนาเก็บทรงฟรี (Basting Service)</h3>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
            บริการปรับเอวเข้า 0.5 - 1.5 นิ้วให้เข้ากับสรีระจริง โดยช่างเสื้อผู้ชำนาญการ ไม่ตัดผ้าเดิม ชุดพอดีตัวถ่ายรูปสวยเป๊ะ
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">3. ฟรีประกันรอยเปื้อนเครื่องสำอาง</h3>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
            หมดกังวลเรื่องคราบแป้ง รอยลิปสติก หรือละอองน้ำดื่ม ทางร้านมีช่างสปาผ้าขจัดคราบให้โดยไม่มีการหักเงินมัดจำ
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">4. โอนคืนเงินมัดจำทันใจใน 24 ชั่วโมง</h3>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
            ระบบ Escrow ปลอดภัย ตรวจรับชุดเรียบร้อย โอนเงินมัดจำคืนเข้าบัญชีคุณทันที โปร่งใส ชัดเจนทุกขั้นตอน
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-700" />
          <span>คำถามที่พบบ่อยเกี่ยวกับการเช่าชุดเซ็ท (FAQ)</span>
        </h3>

        <div className="space-y-5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0">
              <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                {faq.q}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
