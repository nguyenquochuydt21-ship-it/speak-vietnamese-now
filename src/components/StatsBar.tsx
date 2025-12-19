import { motion } from 'framer-motion';
import { Package, Leaf, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  stats: {
    total: number;
    fresh: number;
    expiring: number;
    expired: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Tổng', value: stats.total, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Tốt', value: stats.fresh, icon: Leaf, color: 'text-fresh', bg: 'bg-fresh/10' },
    { label: 'Sắp hết', value: stats.expiring, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Hết hạn', value: stats.expired, icon: XCircle, color: 'text-expired', bg: 'bg-expired/10' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'rounded-2xl p-3 text-center shadow-soft',
            item.bg
          )}
        >
          <item.icon className={cn('h-4 w-4 mx-auto mb-1', item.color)} />
          <p className={cn('text-lg font-bold', item.color)}>{item.value}</p>
          <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
