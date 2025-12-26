import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WasteChartProps {
  data: {
    month: string;
    totalValue: number;
    itemCount: number;
  }[];
}

export function WasteChart({ data }: WasteChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...data.map(d => d.totalValue));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-2.5 shadow-lg">
          <p className="font-semibold text-foreground text-sm">{label}</p>
          <p className="text-expired font-bold">{formatFullCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.itemCount} sản phẩm</p>
        </div>
      );
    }
    return null;
  };

  const hasData = data.some(d => d.totalValue > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-4 shadow-soft border border-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-warning" />
        </div>
        <h3 className="font-bold text-foreground">Lãng phí theo tháng</h3>
      </div>

      {hasData ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickFormatter={formatCurrency}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
              <Bar dataKey="totalValue" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.totalValue === maxValue && entry.totalValue > 0 
                      ? 'hsl(var(--expired))' 
                      : 'hsl(var(--warning))'
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu lãng phí</p>
            <p className="text-xs text-muted-foreground/70">Dữ liệu sẽ hiển thị khi có sản phẩm hết hạn</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
