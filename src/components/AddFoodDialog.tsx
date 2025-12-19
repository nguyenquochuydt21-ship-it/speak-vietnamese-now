import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodItem, FoodCategory, CATEGORY_INFO, UNITS } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AddFoodDialogProps {
  onAdd: (item: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  editItem?: FoodItem | null;
  onUpdate?: (id: string, updates: Partial<FoodItem>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddFoodDialog({ onAdd, editItem, onUpdate, open, onOpenChange }: AddFoodDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  const [name, setName] = useState(editItem?.name ?? '');
  const [category, setCategory] = useState<FoodCategory>(editItem?.category ?? 'other');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(editItem?.expiryDate);
  const [quantity, setQuantity] = useState(editItem?.quantity?.toString() ?? '1');
  const [unit, setUnit] = useState(editItem?.unit ?? 'cái');
  const [notes, setNotes] = useState(editItem?.notes ?? '');

  const resetForm = () => {
    setName('');
    setCategory('other');
    setExpiryDate(undefined);
    setQuantity('1');
    setUnit('cái');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate) return;

    if (editItem && onUpdate) {
      onUpdate(editItem.id, {
        name,
        category,
        expiryDate,
        quantity: Number(quantity),
        unit,
        notes: notes || undefined,
      });
    } else {
      onAdd({
        name,
        category,
        expiryDate,
        quantity: Number(quantity),
        unit,
        notes: notes || undefined,
      });
    }

    resetForm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!editItem && (
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-full shadow-soft-lg">
            <Plus className="h-5 w-5" />
            Thêm thực phẩm
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa' : 'Thêm thực phẩm mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên thực phẩm *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Sữa tươi Vinamilk"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Danh mục</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_INFO) as FoodCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'p-2 rounded-xl text-center transition-all',
                    'border-2 hover:scale-105',
                    category === cat
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent bg-muted'
                  )}
                >
                  <span className="text-xl block">{CATEGORY_INFO[cat].icon}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {CATEGORY_INFO[cat].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hạn sử dụng *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal rounded-xl',
                    !expiryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'PPP', { locale: vi }) : 'Chọn ngày'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn vị</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={!name || !expiryDate}>
            {editItem ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
