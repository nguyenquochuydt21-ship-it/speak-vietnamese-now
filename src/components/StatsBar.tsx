import { motion } from 'framer-motion';
import { Package, Leaf, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  stats: {
    total: number;
    fresh: number;
    expiring: number;
    expired: number;
  };
  showWasteStats?: boolean;
  onToggleWasteStats?: () => void;
}

export function StatsBar({ stats, showWasteStats, onToggleWasteStats }: StatsBarProps) {
  const items = [
    { label: 'Tổng', value: stats.total, icon: Package, color: 'text-primary', bg: 'bg-primary/10', key: 'total' },
    { label: 'Tốt', value: stats.fresh, icon: Leaf, color: 'text-fresh', bg: 'bg-fresh/10', key: 'fresh' },
    { label: 'Sắp hết', value: stats.expiring, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', key: 'expiring' },
    { label: 'Hết hạn', value: stats.expired, icon: XCircle, color: 'text-expired', bg: 'bg-expired/10', key: 'expired' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, index) => {
        const isExpired = item.key === 'expired';
        
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'rounded-2xl p-3 text-center shadow-soft relative',
              item.bg,
              isExpired && 'cursor-pointer hover:ring-2 hover:ring-expired/30 transition-all'
            )}
            onClick={isExpired ? onToggleWasteStats : undefined}
          >
            <item.icon className={cn('h-4 w-4 mx-auto mb-1', item.color)} />
            <p className={cn('text-lg font-bold', item.color)}>{item.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
            {isExpired && (
              <ChevronDown 
                className={cn(
                  'h-3 w-3 mx-auto mt-0.5 text-expired transition-transform duration-200',
                  showWasteStats && 'rotate-180'
                )} 
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
