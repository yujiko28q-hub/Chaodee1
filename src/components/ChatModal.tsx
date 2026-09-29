import React, { useState, useRef, useEffect } from 'react';
import { WomenSetItem } from '../types/rental';
import { 
  X, Send, Sparkles, FileText, CheckCheck, ShieldCheck, 
  Scissors, MapPin, Calendar, Clock, DollarSign, ArrowRight,
  Check, PenTool, Award, Copy
} from 'lucide-react';

interface ChatModalProps {
  item: WomenSetItem;
  onClose: () => void;
  onOpenContract?: (item: WomenSetItem) => void;
  customerName?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'shop';
  text: string;
  time: string;
  isContractCard?: boolean;
  isSigned?: boolean;
  contractDetails?: {
    contractId: string;
    itemTitle: string;
    depositAmount: number;
    rentalRate: number;
    cleaningIncluded: boolean;
    bastingIncluded: boolean;
  };
}

export const ChatModal: React.FC<ChatModalProps> = ({ 
  item, 
  onClose,
  onOpenContract,
  customerName = 'คุณลูกค้า'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'shop',
      text: `สวัสดีค่ะคุณ${customerName} ทางร้าน SETISTA ยินดีให้บริการค่ะ สำหรับชุด "${item.title}" คุณลูกค้าสามารถพูดคุยปรึกษารายละเอียดสัญญาเช่า นัดหมายการจัดส่ง สอยเก็บทรง หรือสอบถามการคืนเงินมัดจำได้โดยตรงกับทางร้านเลยนะคะ 🌸`,
      time: '10:30'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickContractTopics = [
    { label: '📜 ส่งร่างสัญญาเช่าชุด', action: 'send_contract' },
    { label: '💰 สอบถามเงื่อนไขเงินมัดจำ', action: 'ask_deposit' },
    { label: '✂️ ตกลงเรื่องการสอยเก็บทรง', action: 'ask_alteration' },
    { label: '📍 นัดหมายที่อยู่จัดส่ง', action: 'ask_shipping' },
    { label: '📅 ขอปรับวันรับ/คืนชุด', action: 'ask_dates' }
  ];

  const handleCopyContract = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopiedContractId(cid);
    setTimeout(() => {
      setCopiedContractId(null);
    }, 2500);
  };

  const handleSignContractInChat = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isSigned: true } : m))
    );

    // Followup celebration message from shop
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const signConfirmMsg: Message = {
        id: `shp-confirm-${Date.now()}`,
        sender: 'shop',
        text: `ได้รับลายมือชื่อรับทราบสัญญาเช่าเรียบร้อยแล้วค่ะ สัญญาดิจิทัลมีผลคุ้มครองทันที ทางร้านจะเริ่มขั้นตอนสอยเก็บทรงและเตรียมส่งมอบให้คุณลูกค้าตามกำหนดนัดหมายนะคะ ✨`,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, signConfirmMsg]);
    }, 900);
  };

  const handleSend = (textToSend?: string, isContractAction?: boolean) => {
    const text = textToSend || inputVal;
    if (!text.trim() && !isContractAction) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim() || 'ขอตรวจสอบสัญญาเช่าชุดดิจิทัลค่ะ',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Shop/Owner replies realistically with typing delay
    setTimeout(() => {
      setIsTyping(false);
      if (isContractAction || text.includes('สัญญา') || text.includes('ข้อตกลง')) {
        const contractMsg: Message = {
          id: `shp-${Date.now()}`,
          sender: 'shop',
          text: `ทางร้านแนบร่างสัญญาเช่าชุดดิจิทัล (e-Contract) สำหรับ "${item.title}" ให้คุณลูกค้าตรวจสอบข้อตกลงและเงื่อนไขความคุ้มครองค่ะ สามารถกดยอมรับสัญญาผ่านแชทนี้ได้เลยนะคะ:`,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          isContractCard: true,
          isSigned: false,
          contractDetails: {
            contractId: `CTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            itemTitle: item.title,
            depositAmount: item.deposit,
            rentalRate: item.pricePerDay,
            cleaningIncluded: true,
            bastingIncluded: item.alterationAvailable
          }
        };
        setMessages((prev) => [...prev, contractMsg]);
        return;
      }

      let reply = `ยินดีตอบทุกข้อตกลงค่ะ สำหรับชุด ${item.title} ทางร้านดูแลตรวจเช็คสภาพตะเข็บและกระดุมอย่างประณีตก่อนส่งมอบทุกครั้งค่ะ`;

      if (text.includes('มัดจำ') || text.includes('คืนเงิน')) {
        reply = `เรื่องเงินมัดจำ ฿${item.deposit.toLocaleString()}: เมื่อคุณลูกค้าส่งชุดคืนและผ่านการตรวจสอบสภาพตามปกติ ทางร้านจะโอนคืนเข้าบัญชี/พร้อมเพย์ของคุณลูกค้าเต็มจำนวนภายใน 2-4 ชั่วโมงทันทีค่ะ มั่นใจได้ 100% ค่ะ`;
      } else if (text.includes('สอย') || text.includes('แก้ทรง') || text.includes('เอว') || text.includes('อก')) {
        reply = `บริการสอยเก็บทรงฟรีค่ะ! ช่างประจำสตูดิโอจะใช้เทคนิค "สอยเนาชั่วคราวด้วยมือ" (Basting) ไม่ตัดหรือเจาะเนื้อผ้าเดิม ทำให้กระชับพอดีตัวและยังคงทรงสวยเดิมของแบรนด์ไว้ค่ะ สามารถแจ้งรอบเอวที่ต้องการได้เลยนะคะ`;
      } else if (text.includes('ที่อยู่') || text.includes('จัดส่ง') || text.includes('แมส')) {
        reply = `สามารถระบุที่อยู่จัดส่งและหมายเหตุถึงไรเดอร์ในหน้าจองได้เลยค่ะ ทางร้านจะส่งล่วงหน้าก่อนวันงาน 1 วัน และแจ้งเลขพัสดุหรือสถานะแมสเซนเจอร์ให้ทราบทางระบบค่ะ`;
      } else if (text.includes('วัน') || text.includes('เลื่อน') || text.includes('คืน')) {
        reply = `หากต้องการขยายวันเช่าหรือปรับวันส่งคืน สามารถแจ้งล่วงหน้าได้เลยค่ะ อัตราค่าเช่าวันถัดไปคิดตามราคาโปรโมชั่นรายวันตามสัญญา ไม่มีการปรับเพิ่มหากแจ้งล่วงหน้าค่ะ`;
      } else if (text.includes('ซัก') || text.includes('คราบ')) {
        reply = `ใส่เสร็จแล้วไม่ต้องซักคืนเลยค่ะ! ทางร้านรวมบริการสปาซักแห้งด้วยระบบไอน้ำโอโซนเกรดโรงแรม 5 ดาวให้ฟรีเรียบร้อยแล้วค่ะ สบายใจได้เลยนะคะ`;
      }

      const shopMsg: Message = {
        id: `shp-${Date.now()}`,
        sender: 'shop',
        text: reply,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, shopMsg]);
    }, 750);
  };

  const handleQuickTopic = (action: string) => {
    if (action === 'send_contract') {
      handleSend('ขอดูร่างสัญญาเช่าชุดและเงื่อนไขความคุ้มครองค่ะ', true);
    } else if (action === 'ask_deposit') {
      handleSend('สอบถามเงื่อนไขการคืนเงินมัดจำและการตรวจรับชุดค่ะ');
    } else if (action === 'ask_alteration') {
      handleSend('ต้องการตกลงเรื่องการสอยเก็บทรงเอวเข้า มีค่าใช้จ่ายไหมคะ?');
    } else if (action === 'ask_shipping') {
      handleSend('ที่อยู่จัดส่งพัสดุและเวลานำส่งชุดเป็นอย่างไรคะ?');
    } else if (action === 'ask_dates') {
      handleSend('หากต้องการขยายวันใช้งานหรือขอปรับวันส่งคืน คิดค่าบริการอย่างไรคะ?');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 text-left animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-900/60 border border-rose-500/40 text-rose-200 font-serif font-bold flex items-center justify-center text-sm shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold tracking-wide">
                  SETISTA Boutique & Contract Consultant
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] text-stone-300 block truncate max-w-[240px]">
                คุยสัญญาเช่าชุด: {item.title}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outfit Highlight Bar */}
        <div className="bg-stone-50 px-5 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-stone-500">ชุดที่สนใจ:</span>
            <strong className="text-neutral-900 truncate font-serif">{item.title}</strong>
          </div>
          <div className="text-right shrink-0">
            <span className="text-rose-900 font-bold font-mono">฿{item.pricePerDay}/วัน</span>
            <span className="text-stone-400 text-[10px] ml-1">(มัดจำ ฿{item.deposit.toLocaleString()})</span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-100/50 max-h-[46vh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-neutral-950 text-white rounded-br-xs'
                    : 'bg-white text-neutral-900 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {/* Digital Contract Card Bubble with Interactive e-Signing */}
                {msg.isContractCard && msg.contractDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-neutral-900 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                      <span className="font-bold text-[11px] flex items-center gap-1 text-rose-900 font-mono">
                        <FileText className="w-3.5 h-3.5" />
                        <span>สัญญาเช่าดิจิทัล (e-Contract)</span>
                      </span>

                      {/* Copy Contract ID */}
                      <button
                        type="button"
                        onClick={() => handleCopyContract(msg.contractDetails!.contractId)}
                        className="text-[10px] font-mono text-stone-500 hover:text-neutral-900 flex items-center gap-0.5 cursor-pointer bg-white px-1.5 py-0.5 rounded border border-stone-200"
                        title="คลิกเพื่อคัดลอกรหัสสัญญา"
                      >
                        {copiedContractId === msg.contractDetails.contractId ? (
                          <span className="text-emerald-700 font-bold">✓ คัดลอกแล้ว</span>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>{msg.contractDetails.contractId}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-600">
                      <div>
                        <span>ค่าเช่าเริ่มต้น: </span>
                        <strong className="text-neutral-900 font-mono">฿{msg.contractDetails.rentalRate}/วัน</strong>
                      </div>
                      <div>
                        <span>เงินมัดจำคืนได้: </span>
                        <strong className="text-neutral-900 font-mono">฿{msg.contractDetails.depositAmount.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-3 h-3" />
                        <span>รวมซักแห้งพรีเมียม</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <Scissors className="w-3 h-3" />
                        <span>สอยเก็บทรงฟรีไม่ตัดผ้า</span>
                      </div>
                    </div>

                    {/* e-Signature Status or Button */}
                    <div className="pt-1">
                      {msg.isSigned ? (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ลงนามรับทราบสัญญาแล้ว (e-Signed)</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-mono">VERIFIED</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSignContractInChat(msg.id)}
                          className="w-full py-2 px-3 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                        >
                          <PenTool className="w-3 h-3 text-rose-200" />
                          <span>✍️ คลิกเพื่อลงนามรับทราบสัญญาดิจิทัล</span>
                        </button>
                      )}
                    </div>

                    {onOpenContract && (
                      <button
                        type="button"
                        onClick={() => onOpenContract(item)}
                        className="w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-neutral-800 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>เปิดอ่านเงื่อนไขฉบับเต็ม</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1 font-mono">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Microinteraction: Realistic Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="p-3 bg-white rounded-2xl rounded-bl-xs border border-stone-200/80 shadow-2xs flex items-center gap-1.5 text-stone-400">
                <span className="text-[11px] text-stone-500 mr-1 font-medium">สไตลิสต์กำลังพิมพ์</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Contract Topics Buttons */}
        <div className="px-4 py-2 bg-white border-t border-stone-200">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono mb-1.5">
            หัวข้อพูดคุย & ตกลงสัญญาด่วน:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {quickContractTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickTopic(topic.action)}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-900 hover:border-rose-200 border border-stone-200 text-[11px] text-stone-700 whitespace-nowrap transition-colors cursor-pointer active:scale-95"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-stone-200 bg-stone-50 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="พิมพ์สอบถามข้อตกลงสัญญา นัดวันรับ หรือขอปรับไซส์..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs text-neutral-900 focus:outline-rose-900"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
