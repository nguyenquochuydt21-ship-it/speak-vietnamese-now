import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { X, Copy, Edit2, Trash2, Clock } from 'lucide-react';
import { FoodItem, CATEGORY_INFO, AppSettings } from '@/types/food';
import { getStatus, getDaysUntilExpiry } from '@/hooks/useFoodItems';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  item: FoodItem | null;
  settings: AppSettings;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: FoodItem) => void;
}

export function ProductDetail({ 
  item, 
  settings, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete,
  onDuplicate 
}: ProductDetailProps) {
  if (!item) return null;

  const status = getStatus(item.expiryDate, settings.notificationDays);
  const daysLeft = getDaysUntilExpiry(item.expiryDate);
  const categoryInfo = CATEGORY_INFO[item.category];

  const getTimeRemainingText = () => {
    if (daysLeft < 0) {
      const days = Math.abs(daysLeft);
      return `Đã hết hạn ${days} ngày trước`;
    } else if (daysLeft === 0) {
      return 'Hết hạn hôm nay!';
    } else if (daysLeft === 1) {
      return 'Còn 1 ngày';
    } else {
      return `Còn ${daysLeft} ngày`;
    }
  };

  const statusBg = {
    fresh: 'bg-fresh/10',
    expiring: 'bg-warning/10',
    expired: 'bg-expired/10',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        {/* Header Image or Gradient */}
        <div className={cn(
          'relative h-48 flex items-center justify-center',
          item.imageUrl ? '' : 'gradient-hero'
        )}>
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">{categoryInfo.icon}</span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(85vh-192px)] hide-scrollbar">
          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
              <StatusBadge status={status} daysLeft={daysLeft} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CategoryBadge category={item.category} size="sm" />
              <span className="text-sm text-muted-foreground">{categoryInfo.label}</span>
            </div>
          </div>

          {/* Time Remaining Card */}
          <div className={cn('p-4 rounded-2xl', statusBg[status])}>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-foreground">{getTimeRemainingText()}</p>
                <p className="text-sm text-muted-foreground">
                  Hạn sử dụng: {format(item.expiryDate, 'EEEE, dd MMMM yyyy', { locale: vi })}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Số lượng</span>
              <span className="font-semibold">{item.quantity} {item.unit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Ngày thêm</span>
              <span className="font-semibold">{format(item.createdAt, 'dd/MM/yyyy', { locale: vi })}</span>
            </div>
            {item.notes && (
              <div className="py-2">
                <span className="text-muted-foreground block mb-1">Ghi chú</span>
                <p className="text-foreground">{item.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Button
              variant="outline"
              className="rounded-xl h-12 flex-col gap-1"
              onClick={() => {
                onDuplicate(item);
                onOpenChange(false);
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="text-xs">Sao chép</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-12 flex-col gap-1"
              onClick={() => {
                onEdit(item);
                onOpenChange(false);
              }}
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-xs">Chỉnh sửa</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-12 flex-col gap-1 text-expired hover:text-expired hover:bg-expired/10"
              onClick={() => {
                onDelete(item.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-xs">Xóa</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
