import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WasteStatsCardProps {
  stats: {
    totalItems: number;
    totalValue: number;
    thisMonthItems: number;
    thisMonthValue: number;
  };
}

export function WasteStatsCard({ stats }: WasteStatsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-soft border border-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-expired/10 flex items-center justify-center">
          <TrendingDown className="h-4 w-4 text-expired" />
        </div>
        <h3 className="font-bold text-foreground">Thống kê lãng phí</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Tháng này</span>
          </div>
          <p className="text-lg font-bold text-expired">{formatCurrency(stats.thisMonthValue)}</p>
          <p className="text-xs text-muted-foreground">{stats.thisMonthItems} sản phẩm</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Tổng cộng</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalValue)}</p>
          <p className="text-xs text-muted-foreground">{stats.totalItems} sản phẩm</p>
        </div>
      </div>
    </motion.div>
  );
}
