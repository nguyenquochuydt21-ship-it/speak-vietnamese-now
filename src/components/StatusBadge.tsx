import { FoodStatus } from '@/types/food';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: FoodStatus;
  daysLeft: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, daysLeft, className, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'expired':
        return {
          label: Math.abs(daysLeft) === 1 ? 'Hết hạn 1 ngày' : `Hết hạn ${Math.abs(daysLeft)} ngày`,
          bgClass: 'bg-expired/15',
          textClass: 'text-expired',
          dotClass: 'status-dot-expired',
        };
      case 'expiring':
        return {
          label: daysLeft === 0 ? 'Hết hạn hôm nay!' : daysLeft === 1 ? 'Còn 1 ngày' : `Còn ${daysLeft} ngày`,
          bgClass: 'bg-warning/15',
          textClass: 'text-warning',
          dotClass: 'status-dot-warning',
        };
      case 'fresh':
        return {
          label: daysLeft === 1 ? 'Còn 1 ngày' : `Còn ${daysLeft} ngày`,
          bgClass: 'bg-fresh/15',
          textClass: 'text-fresh',
          dotClass: 'status-dot-fresh',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span className={cn('status-dot', config.dotClass)} />
      {config.label}
    </span>
  );
}
