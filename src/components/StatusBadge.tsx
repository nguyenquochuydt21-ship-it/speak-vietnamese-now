import { FoodStatus } from '@/types/food';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: FoodStatus;
  daysLeft: number;
  className?: string;
}

export function StatusBadge({ status, daysLeft, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'expired':
        return {
          label: `Hết hạn ${Math.abs(daysLeft)} ngày`,
          bgClass: 'bg-expired/10',
          textClass: 'text-expired',
          dotClass: 'bg-expired',
        };
      case 'expiring':
        return {
          label: daysLeft === 0 ? 'Hết hạn hôm nay' : `Còn ${daysLeft} ngày`,
          bgClass: 'bg-warning/10',
          textClass: 'text-warning',
          dotClass: 'bg-warning animate-pulse-soft',
        };
      case 'fresh':
        return {
          label: `Còn ${daysLeft} ngày`,
          bgClass: 'bg-fresh/10',
          textClass: 'text-fresh',
          dotClass: 'bg-fresh',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
