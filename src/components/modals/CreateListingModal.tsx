import React, { useState, useRef } from 'react';
import { WomenSetItem, OccasionCategory, ApparelSize } from '../types/rental';
import { X, Plus, Trash2, Check, Sparkles, Upload, Image as ImageIcon, Camera, Scissors } from 'lucide-react';

interface CreateListingModalProps {
  onClose: () => void;
  onAddListing: (newItem: WomenSetItem) => void;
  itemToEdit?: WomenSetItem | null;
  onUpdateListing?: (updatedItem: WomenSetItem) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  onClose,
  onAddListing,
  itemToEdit,
  onUpdateListing
}) => {
  const isEditing = Boolean(itemToEdit);
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [brand, setBrand] = useState(itemToEdit?.brand || '');
  const [category, setCategory] = useState<OccasionCategory>(itemToEdit?.category || 'tweed');
  const [setTypeTh, setSetTypeTh] = useState(itemToEdit?.setTypeTh || 'เสื้อกั๊กทวีตแขนกุด + กระโปรงทรงเอ');
  const [colorName, setColorName] = useState(itemToEdit?.colorName || 'Cream Vanilla');
  const [colorHex, setColorHex] = useState(itemToEdit?.colorHex || '#FDFBF7');
  const [pricePerDay, setPricePerDay] = useState<number>(itemToEdit?.pricePerDay || 450);
  const [deposit, setDeposit] = useState<number>(itemToEdit?.deposit || 1500);
  const [marketValue, setMarketValue] = useState<number>(itemToEdit?.marketValue || 12000);
  const [fabric, setFabric] = useState(itemToEdit?.fabric || 'ผ้าทวีตฝรั่งเศส ซับในผ้าไหม');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [imageUrl, setImageUrl] = useState(itemToEdit?.imageUrl || '');
  const [selectedSizes, setSelectedSizes] = useState<ApparelSize[]>(itemToEdit?.availableSizes || ['S', 'M']);
  const [bustMeasurement, setBustMeasurement] = useState(itemToEdit?.measurements?.S?.bust || '32-34 นิ้ว');
  const [waistMeasurement, setWaistMeasurement] = useState(itemToEdit?.measurements?.S?.waist || '24-26 นิ้ว');
  const [hipMeasurement, setHipMeasurement] = useState(itemToEdit?.measurements?.S?.hip || '35-37 นิ้ว');
  const [stylingTips, setStylingTips] = useState(itemToEdit?.stylingTips || 'ใส่คู่กับรองเท้าส้นสูงและกระเป๋าคลัตช์เรียบหรู');
  const [alterationAvailable, setAlterationAvailable] = useState(itemToEdit ? itemToEdit.alterationAvailable : true);
  const [dryCleaningIncluded, setDryCleaningIncluded] = useState(itemToEdit ? itemToEdit.dryCleaningIncluded : true);
  const [stockCount, setStockCount] = useState(itemToEdit?.stockCount || 1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ready presets for instant quick-fill
  const quickPresets = [
    {
      label: '✨ เซ็ททวีตคุณหนู',
      title: 'Maison Pearl Tweed Vest & Skirt Set',
      brand: 'Chic Boutique',
      category: 'tweed' as OccasionCategory,
      setTypeTh: 'เสื้อกั๊กทวีต + กระโปรงทรงเอ',
      price: 490,
      deposit: 1500,
      color: 'Vanilla Cream',
      colorHex: '#FDFBF7',
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      fabric: 'French Woven Tweed'
    },
    {
      label: '💍 เซ็ทไปงานแต่ง',
      title: 'Blush Rose Pleated Gala Two-Piece Set',
      brand: 'Atelier Couture',
      category: 'wedding' as OccasionCategory,
      setTypeTh: 'เบลเซอร์คอร์เซ็ต + กระโปรงพลีท Ombre',
      price: 690,
      deposit: 2000,
      color: 'Rose Dust Pink',
      colorHex: '#E2A9A8',
      img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      fabric: 'Crepe & Chiffon Satin'
    },
    {
      label: '🌴 เซ็ทเที่ยวทะเล',
      title: 'Mediterranean Floral Linen Crop & Maxi Skirt',
      brand: 'Resort Chic',
      category: 'vacation' as OccasionCategory,
      setTypeTh: 'เสื้อครอปผูกโบว์หน้า + กระโปรงยาวพริ้ว',
      price: 490,
      deposit: 1500,
      color: 'Ocean Ivory',
      colorHex: '#FAF0E6',
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      fabric: '100% Pure Natural Linen'
    },
    {
      label: '☕ เซ็ทคาเฟ่เกาหลี',
      title: 'Pastel Waistcoat & Bermuda Shorts Set',
      brand: 'Seoul Chic Studio',
      category: 'cafe' as OccasionCategory,
      setTypeTh: 'เสื้อกั๊กสูท + กางเกงขาสั้นเบอร์มิวดา',
      price: 390,
      deposit: 1200,
      color: 'Sky Pastel Blue',
      colorHex: '#8ECAE6',
      img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80',
      fabric: 'Soft Cotton-Linen Blend'
    }
  ];

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setTitle(preset.title);
    setBrand(preset.brand);
    setCategory(preset.category);
    setSetTypeTh(preset.setTypeTh);
    setPricePerDay(preset.price);
    setDeposit(preset.deposit);
    setColorName(preset.color);
    setColorHex(preset.colorHex);
    setImageUrl(preset.img);
    setFabric(preset.fabric);
    setDescription(`ชุดเซ็ท ${preset.setTypeTh} คุณภาพเกรดพรีเมียม สภาพสวยเป๊ะ 99% พร้อมส่งทันที`);
  };

  // Image Upload handler via FileReader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [includedList, setIncludedList] = useState<string[]>([
    'เสื้อท่อนบนสภาพสมบูรณ์',
    'ท่อนล่างกระโปรง/กางเกงเข้าเซ็ท',
    'ไม้แขวนสูทและถุงคลุมเสื้อผ้ากันฝุ่น'
  ]);
  const [newIncludedText, setNewIncludedText] = useState('');

  const toggleSize = (sz: ApparelSize) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter(s => s !== sz));
      }
    } else {
      setSelectedSizes([...selectedSizes, sz]);
    }
  };

  const handleAddIncluded = () => {
    if (!newIncludedText.trim()) return;
    setIncludedList([...includedList, newIncludedText.trim()]);
    setNewIncludedText('');
  };

  const handleRemoveIncluded = (idx: number) => {
    setIncludedList(includedList.filter((_, i) => i !== idx));
  };

  const categoryNames: Record<OccasionCategory, string> = {
    all: 'ชุดเซ็ททั่วไป',
    wedding: 'เซ็ทไปงานแต่ง & ดินเนอร์หรู',
    tweed: 'เซ็ทผ้าทวีต & สไตล์คุณหนู',
    vacation: 'เซ็ทเที่ยวทะเล & รีสอร์ท',
    cafe: 'เซ็ทคาเฟ่ & บรันช์เกาหลี',
    suit: 'เซ็ทสูท & สมาร์ทแคชชวล',
    thai_modern: 'เซ็ทไทยโมเดิร์น & งานมงคล',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && itemToEdit && onUpdateListing) {
      const updatedItem: WomenSetItem = {
        ...itemToEdit,
        title: title.trim(),
        brand: brand.trim() || itemToEdit.brand,
        category,
        categoryNameTh: categoryNames[category] || 'ชุดเซ็ทแฟชั่น',
        setTypeTh: setTypeTh.trim() || itemToEdit.setTypeTh,
        colorName: colorName.trim(),
        colorHex: colorHex || itemToEdit.colorHex,
        pricePerDay: Number(pricePerDay),
        deposit: Number(deposit),
        marketValue: Number(marketValue),
        availableSizes: selectedSizes,
        measurements: {
          ...itemToEdit.measurements,
          [selectedSizes[0] || 'S']: { 
            bust: bustMeasurement, 
            waist: waistMeasurement, 
            hip: hipMeasurement 
          }
        },
        description: description.trim() || itemToEdit.description,
        includedItems: includedList,
        stylingTips: stylingTips.trim(),
        imageUrl: imageUrl.trim() || itemToEdit.imageUrl,
        imageAlt: title.trim(),
        fabric: fabric.trim() || itemToEdit.fabric,
        dryCleaningIncluded,
        alterationAvailable,
        stockCount: Number(stockCount) || 1
      };
      onUpdateListing(updatedItem);
      onClose();
      return;
    }

    const newItem: WomenSetItem = {
      id: `my-set-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      brand: brand.trim() || 'My Wardrobe Collection',
      category,
      categoryNameTh: categoryNames[category] || 'ชุดเซ็ทแฟชั่น',
      setTypeTh: setTypeTh.trim() || 'เสื้อท็อป + กระโปรง/กางเกงเข้าเซ็ท',
      colorName: colorName.trim(),
      colorHex: colorHex || '#E2A9A8',
      pricePerDay: Number(pricePerDay),
      deposit: Number(deposit),
      marketValue: Number(marketValue),
      availableSizes: selectedSizes,
      measurements: {
        [selectedSizes[0] || 'S']: { 
          bust: bustMeasurement, 
          waist: waistMeasurement, 
          hip: hipMeasurement 
        }
      },
      rating: 5.0,
      reviewCount: 0,
      ownerName: 'ร้านของฉัน (Verified Owner)',
      ownerStudio: 'สตูดิโอส่วนตัว / จัดส่งด่วน',
      isAvailable: true,
      minRentDays: 2,
      condition: 'เหมือนใหม่ 99%',
      description: description.trim() || 'ชุดเซ็ทสวยเป๊ะ คัตติ้งเนี้ยบ ดูแลรักษาอย่างดี พร้อมปล่อยเช่าทันที',
      includedItems: includedList,
      matchingAccessories: ['เข็มขัดเข้าเซ็ท', 'ต่างหูมุก'],
      stylingTips: stylingTips.trim(),
      rules: [
        'ไม่ต้องซักคืน ทางร้านมีทีมซักแห้งพรีเมียมให้ฟรี',
        'ห้ามฉีดน้ำหอมใส่เนื้อผ้าโดยตรง'
      ],
      deliveryOptions: ['จัดส่งด่วน GrabExpress ใน กทม.', 'จัดส่ง EMS ทั่วประเทศ', 'นัดรับที่หน้าร้าน'],
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      imageAlt: title.trim(),
      tags: ['ชุดของฉัน', categoryNames[category], brand.trim() || 'Self-Listed'],
      fabric: fabric.trim() || 'ผ้าตัดเย็บเกรดพรีเมียม',
      dryCleaningIncluded,
      alterationAvailable,
      ownerIsSelf: true,
      stockCount: Number(stockCount) || 1
    };

    onAddListing(newItem);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-left animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <Camera className="w-3 h-3" />
              <span>{isEditing ? 'EDIT LISTING' : 'OWNER LISTING CONSOLE'}</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              {isEditing ? 'แก้ไขข้อมูลชุดเซ็ท' : 'ลงเสื้อผ้า / ชุดเซ็ทปล่อยเช่าหน้าร้าน'}
            </h3>
            <p className="text-xs text-stone-500 font-light">
              {isEditing 
                ? 'แก้ไขรายละเอียด ราคาต่อวัน ไซส์ หรือรูปภาพของชุดนี้'
                : 'กรอกข้อมูลและอัปโหลดรูปภาพชุดของคุณ เมื่อลงเสร็จลูกค้าสามารถเข้ามาเลือกเช่าได้ทันที'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 space-y-5 text-xs">
          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
              ⚡ กดใช้เทมเพลตตัวอย่างด่วน (หรือกรอกเอง):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-900 text-stone-700 text-[11px] border border-stone-200 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Area (Supports Local File & Preview) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <label className="font-bold text-neutral-900 block mb-2">
              รูปภาพชุดเซ็ท (อัปโหลดจากเครื่อง หรือใส่ลิงก์) *
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Image Preview Box */}
              <div className="w-28 h-36 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 flex items-center justify-center relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-stone-400 p-2">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[10px] block">ยังไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-300 hover:border-neutral-900 text-neutral-900 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                >
                  <Upload className="w-4 h-4 text-rose-700" />
                  <span>เลือกรูปภาพจากมือถือ / คอมพิวเตอร์</span>
                </button>

                <div className="flex items-center gap-2 text-stone-400 text-[10px]">
                  <div className="h-px bg-stone-200 flex-1" />
                  <span>หรือใส่ลิงก์รูปภาพ (Image URL)</span>
                  <div className="h-px bg-stone-200 flex-1" />
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                ชื่อชุดเซ็ท / เสื้อผ้าที่ต้องการปล่อยเช่า *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น เซ็ททวีตสีครีมขอบทองกระดุมมุก"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                แบรนด์ / ร้านตัดเย็บ *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="เช่น Poem, Zimmermann, Mitr, สั่งตัดพิเศษ"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Category & Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                หมวดหมู่ / โอกาสที่ใส่ *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OccasionCategory)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              >
                <option value="tweed">✨ เซ็ทผ้าทวีต & สไตล์คุณหนู</option>
                <option value="wedding">💍 เซ็ทไปงานแต่ง & ดินเนอร์หรู</option>
                <option value="vacation">🌴 เซ็ทเที่ยวทะเล & รีสอร์ท</option>
                <option value="cafe">☕ เซ็ทคาเฟ่ & บรันช์เกาหลี</option>
                <option value="suit">💼 เซ็ทสูท & สมาร์ทแคชชวล</option>
                <option value="thai_modern">🌸 เซ็ทไทยโมเดิร์น & งานมงคล</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                โครงสร้างชิ้นส่วนในเซ็ท
              </label>
              <input
                type="text"
                value={setTypeTh}
                onChange={(e) => setSetTypeTh(e.target.value)}
                placeholder="เช่น เสื้อกั๊ก + กระโปรงเอวสูงทรงเอ"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                ราคาค่าเช่าต่อวัน (฿) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-mono text-xs text-neutral-900 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                เงินมัดจำประกัน (฿) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-mono text-xs text-neutral-900"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                ราคาป้ายชุดเดิม (฿)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={marketValue}
                onChange={(e) => setMarketValue(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 font-mono text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Sizes and Sizing Measurements */}
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/70 space-y-3">
            <div>
              <label className="font-bold text-neutral-900 block mb-1.5">
                เลือกไซส์ที่มีให้เช่า *
              </label>
              <div className="flex gap-2">
                {(['XS', 'S', 'M', 'L', 'XL', 'Free Size'] as ApparelSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer ${
                      selectedSizes.includes(sz)
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-rose-100">
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">รอบอก (Bust)</label>
                <input
                  type="text"
                  value={bustMeasurement}
                  onChange={(e) => setBustMeasurement(e.target.value)}
                  placeholder="เช่น 32-34 นิ้ว"
                  className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">รอบเอว (Waist)</label>
                <input
                  type="text"
                  value={waistMeasurement}
                  onChange={(e) => setWaistMeasurement(e.target.value)}
                  placeholder="เช่น 24-26 นิ้ว"
                  className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">สะโพก (Hip)</label>
                <input
                  type="text"
                  value={hipMeasurement}
                  onChange={(e) => setHipMeasurement(e.target.value)}
                  placeholder="เช่น 35-37 นิ้ว"
                  className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-neutral-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Fabric & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                ชนิดเนื้อผ้า
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="เช่น ผ้าทวีตฝรั่งเศส, ผ้าไหมซาติน"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1">
                ชื่อโทนสี
              </label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="เช่น Cream Vanilla, Rose Dust"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              คำอธิบายรายละเอียดชุด & คำแนะนำสำหรับลูกค้า
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น ทรงสวยเป๊ะ ใส่แล้วพรางหุ่น เหมาะกับงานแต่งและคาเฟ่..."
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-neutral-900"
            />
          </div>

          {/* Special Boutique Services Options */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alterationAvailable}
                onChange={(e) => setAlterationAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950"
              />
              <span className="font-medium text-stone-800 flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                <span>มีบริการสอยเก็บทรงฟรี</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dryCleaningIncluded}
                onChange={(e) => setDryCleaningIncluded(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950"
              />
              <span className="font-medium text-stone-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>รวมซักแห้งฟรี (คืนได้เลย)</span>
              </span>
            </label>
          </div>

          {/* Included pieces */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              ชิ้นส่วนและพร็อพที่ลูกค้าจะได้รับในเซ็ต
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIncludedText}
                onChange={(e) => setNewIncludedText(e.target.value)}
                placeholder="พิมพ์ชื่อชิ้นส่วนเสริม เช่น เข็มขัด, ไม้แขวนสูท..."
                className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddIncluded}
                className="px-3 py-1.5 rounded-xl bg-neutral-950 text-white font-medium hover:bg-neutral-800 cursor-pointer"
              >
                + เพิ่ม
              </button>
            </div>
            <ul className="space-y-1">
              {includedList.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIncluded(idx)}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              ชุดที่ลงจะแสดงบนหน้าร้านให้ลูกค้าเลือกเช่าทันที
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-950 text-white font-semibold hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? 'บันทึกการแก้ไขชุด' : 'ลงชุดและเปิดให้เช่าทันที'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
