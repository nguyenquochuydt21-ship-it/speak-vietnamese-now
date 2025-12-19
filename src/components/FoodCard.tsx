import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FoodItem, AppSettings } from '@/types/food';
import { getStatus, getDaysUntilExpiry } from '@/hooks/useFoodItems';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { SwipeableCard } from './SwipeableCard';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  item: FoodItem;
  settings: AppSettings;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onClick: (item: FoodItem) => void;
}

export function FoodCard({ item, settings, onEdit, onDelete, onClick }: FoodCardProps) {
  const status = getStatus(item.expiryDate, settings.notificationDays);
  const daysLeft = getDaysUntilExpiry(item.expiryDate);

  const borderColor = {
    fresh: 'border-l-fresh',
    expiring: 'border-l-warning',
    expired: 'border-l-expired',
  };

  return (
    <SwipeableCard
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
    >
      <div
        onClick={() => onClick(item)}
        className={cn(
          'p-3 border-l-4 shadow-soft cursor-pointer transition-all hover:shadow-soft-lg',
          borderColor[status]
        )}
      >
        <div className="flex items-center gap-3">
          {/* Image or Category Icon */}
          {item.imageUrl ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <CategoryBadge category={item.category} size="lg" />
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-foreground truncate text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <StatusBadge status={status} daysLeft={daysLeft} size="sm" />
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-1.5">
              HSD: {format(item.expiryDate, settings.dateFormat, { locale: vi })}
            </p>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
