import React from 'react';

export type RentalStatusType =
  | 'available'
  | 'rented'
  | 'cleaning'
  | 'reserved'
  | 'maintenance'
  | 'pending_owner_approval'
  | 'fitting_scheduled'
  | 'dispatched'
  | 'active_renting'
  | 'returning'
  | 'completed'
  | 'cancelled';

export interface StatusBadgeProps {
  status: RentalStatusType | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'พร้อมเช่า',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'rented':
      case 'active_renting':
        return {
          label: 'กำลังเช่าอยู่',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'cleaning':
        return {
          label: 'ส่งซักแห้งพรีเมียม',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'pending_owner_approval':
        return {
          label: 'รอยืนยันคำขอ',
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-500',
        };
      case 'fitting_scheduled':
        return {
          label: 'นัดลองไซส์ / สอยทรง',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'dispatched':
        return {
          label: 'ส่งด่วนแล้ว',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'returning':
        return {
          label: 'อยู่ระหว่างส่งคืน',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'completed':
        return {
          label: 'เสร็จสิ้น & คืนมัดจำแล้ว',
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
        };
      case 'maintenance':
        return {
          label: 'ตรวจเช็คสภาพ',
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
        };
      case 'cancelled':
        return {
          label: 'ยกเลิกคำขอ',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-400',
        };
      default:
        return {
          label: status,
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'text-[11px] py-0.5 px-2' : 'text-xs py-1 px-2.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border tracking-tight select-none ${sizeClasses} ${config.bg} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
