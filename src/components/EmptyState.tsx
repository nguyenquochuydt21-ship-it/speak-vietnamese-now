import { motion } from 'framer-motion';
import { ShoppingBasket, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'empty' | 'no-results';
  title?: string;
  description?: string;
}

export function EmptyState({ 
  type = 'empty',
  title,
  description 
}: EmptyStateProps) {
  const defaultTitle = type === 'no-results' ? 'Không tìm thấy' : 'Chưa có sản phẩm';
  const defaultDescription = type === 'no-results' 
    ? 'Thử thay đổi từ khóa hoặc bộ lọc' 
    : 'Thêm sản phẩm đầu tiên để bắt đầu theo dõi hạn sử dụng';

  const Icon = type === 'no-results' ? Search : ShoppingBasket;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title || defaultTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description || defaultDescription}</p>
    </motion.div>
  );
}
