import React from 'react';
import { WomenSetItem, ApparelSize } from '../types/rental';
import { X, ShieldCheck, Printer, CheckCircle2, Scissors, Sparkles } from 'lucide-react';

interface RentalAgreementModalProps {
  item: WomenSetItem;
  days: number;
  startDate: string;
  endDate: string;
  size: ApparelSize;
  onClose: () => void;
}

export const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
  item,
  days,
  startDate,
  endDate,
  size,
  onClose
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              สัญญาเช่าชุดแฟชั่นและข้อตกลงการถนอมเนื้อผ้า (e-Contract)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Content */}
        <div className="overflow-y-auto p-6 flex-1 text-xs text-neutral-700 space-y-4 font-sans leading-relaxed">
          <div className="text-center pb-3 border-b border-stone-200">
            <span className="text-[10px] uppercase font-mono tracking-widest text-rose-800">
              SETISTA LUXURY FASHION RENTAL AGREEMENT
            </span>
            <h4 className="text-base font-serif font-bold text-neutral-900 mt-1">
              หนังสือสัญญาเช่าชุดเซ็ทและการดูแลรักษา
            </h4>
            <p className="text-[11px] text-stone-500 font-mono mt-0.5">
              เลขที่อ้างอิง: CTR-{item.id.toUpperCase()}-{size}-2026
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 1. คู่สัญญา</h5>
            <p>
              สัญญานี้ทำขึ้นระหว่าง <strong>{item.ownerStudio} ({item.brand})</strong> ซึ่งต่อไปนี้เรียกว่า "ผู้ให้เช่า" ฝ่ายหนึ่ง กับ ผู้เช่าที่ลงทะเบียนทำรายการในระบบ ซึ่งต่อไปนี้เรียกว่า "ผู้เช่า" อีกฝ่ายหนึ่ง
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 2. ชุดเซ็ทที่เช่าและสภาพทรัพย์สิน</h5>
            <p>
              ผู้ให้เช่าตกลงส่งมอบชุด <strong>{item.title} (ไซส์ {size})</strong> สภาพ <strong>{item.condition}</strong> มูลค่าประเมิน ฿{item.marketValue.toLocaleString()} บาท ผลิตจากเนื้อผ้า <em>{item.fabric}</em>
            </p>
            <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-semibold block mb-1">รายการชิ้นส่วนที่ส่งมอบครบเซ็ท:</span>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                {item.includedItems.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 3. นโยบายการซักรีดและการดูแล (Dry Cleaning Included)</h5>
            <p className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-rose-950 font-medium">
              ★ <strong>ผู้เช่าไม่ต้องซักชุดก่อนส่งคืนโดยเด็ดขาด:</strong> ทางร้านมีผู้เชี่ยวชาญซักแห้งด้วยสารทำความสะอาดออร์แกนิกเฉพาะสำหรับผ้าทวีต ซาติน และลูกไม้ การนำไปซักน้ำหรือซักเครื่องเองอาจทำให้เส้นใยหดตัวและถือเป็นความเสียหาย
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 4. การสอยเนาเก็บทรง (Complimentary Basting)</h5>
            <p>
              การปรับขนาดทรงชุดชั่วคราวจะกระทำโดยช่างเทเลอร์ของทางร้านเท่านั้น ด้วยวิธีเนาสอยซ่อนฝีเข็มโดยไม่ตัดแต่งเนื้อผ้าเดิมของชุดแต่อย่างใด
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 5. ระยะเวลาและเงินประกันการเช่า (Deposit Escrow)</h5>
            <p>
              กำหนดระยะเวลาเช่า <strong>{days} วัน</strong> ตั้งแต่วันที่ <strong>{startDate}</strong> ถึงวันที่ <strong>{endDate}</strong> เมื่อสิ้นสุดการเช่าและชุดถูกส่งคืนในสภาพเรียบร้อย ทางร้านจะโอนคืนเงินประกันมัดจำจำนวน ฿{item.deposit.toLocaleString()} บาท เข้าบัญชีของผู้เช่าภายใน 24 ชั่วโมง
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 mb-1">ข้อ 6. การประกันคราบเปื้อนอุบัติเหตุ</h5>
            <p>
              คราบเปื้อนทั่วไป เช่น แป้ง คราบรองพื้น ลิปสติกเล็กน้อย หรือหยดน้ำดื่ม ทางร้านดูแลซักขจัดคราบให้ฟรี ยกเว้นกรณีผ้าไหมขาดวิ่น ไหม้ไฟ หรือสูญหาย ผู้เช่าตกลงชดใช้ตามค่าซ่อมแซมจริงของศูนย์ช่างผู้ชำนาญการ
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              สัญญานี้มีผลสมบูรณ์ตามพระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 เมื่อผู้เช่ากดปุ่ม "ยืนยันการจองเช่าชุด"
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์สัญญา / บันทึก PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
