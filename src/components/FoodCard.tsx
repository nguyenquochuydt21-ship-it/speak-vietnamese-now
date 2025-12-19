import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, Edit2 } from 'lucide-react';
import { FoodItem } from '@/types/food';
import { getStatus, getDaysUntilExpiry } from '@/hooks/useFoodItems';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function FoodCard({ item, onEdit, onDelete, index }: FoodCardProps) {
  const status = getStatus(item.expiryDate);
  const daysLeft = getDaysUntilExpiry(item.expiryDate);

  const borderColor = {
    fresh: 'border-l-fresh',
    expiring: 'border-l-warning',
    expired: 'border-l-expired',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative bg-card rounded-xl p-4 shadow-soft hover:shadow-soft-lg transition-all duration-300',
        'border-l-4',
        borderColor[status]
      )}
    >
      <div className="flex items-start gap-3">
        <CategoryIcon category={item.category} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.quantity} {item.unit}
              </p>
            </div>
            <StatusBadge status={status} daysLeft={daysLeft} />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              HSD: {format(item.expiryDate, 'dd/MM/yyyy', { locale: vi })}
            </p>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-expired"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {item.notes && (
        <p className="text-xs text-muted-foreground mt-2 pl-13 italic">
          {item.notes}
        </p>
      )}
    </motion.div>
  );
}
