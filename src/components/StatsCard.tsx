import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'total' | 'fresh' | 'warning' | 'expired';
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, variant, delay = 0 }: StatsCardProps) {
  const variants = {
    total: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      iconBg: 'bg-primary',
    },
    fresh: {
      bg: 'bg-fresh/10',
      text: 'text-fresh',
      iconBg: 'bg-fresh',
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      iconBg: 'bg-warning',
    },
    expired: {
      bg: 'bg-expired/10',
      text: 'text-expired',
      iconBg: 'bg-expired',
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'rounded-2xl p-4 flex items-center gap-3',
        config.bg
      )}
    >
      <div className={cn('p-2.5 rounded-xl', config.iconBg)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className={cn('text-2xl font-bold', config.text)}>{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
      </div>
    </motion.div>
  );
}
