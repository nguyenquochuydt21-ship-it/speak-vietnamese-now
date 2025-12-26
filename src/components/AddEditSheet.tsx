import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { FoodItem, FoodCategory, CATEGORY_INFO, UNITS, AppSettings } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { ImageUpload } from './ImageUpload';
import { cn } from '@/lib/utils';

interface AddEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: FoodItem | null;
  settings: AppSettings;
  onAdd: (item: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<FoodItem>) => void;
}

export function AddEditSheet({ open, onOpenChange, editItem, settings, onAdd, onUpdate }: AddEditSheetProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('other');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('cái');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCategory(editItem.category);
      setExpiryDate(editItem.expiryDate);
      setQuantity(editItem.quantity.toString());
      setUnit(editItem.unit);
      setPrice(editItem.price?.toString() || '');
      setNotes(editItem.notes || '');
      setImageUrl(editItem.imageUrl);
    } else {
      resetForm();
    }
  }, [editItem, open]);

  const resetForm = () => {
    setName('');
    setCategory('other');
    setExpiryDate(undefined);
    setQuantity('1');
    setUnit('cái');
    setPrice('');
    setNotes('');
    setImageUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate) return;

    const itemData = {
      name,
      category,
      expiryDate,
      quantity: Number(quantity),
      unit,
      price: price ? Number(price) : undefined,
      notes: notes || undefined,
      imageUrl,
    };

    if (editItem) {
      onUpdate(editItem.id, itemData);
    } else {
      onAdd(itemData);
    }

    onOpenChange(false);
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] pb-6 hide-scrollbar">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Sữa tươi Vinamilk"
              className="rounded-xl h-12"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_INFO) as FoodCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'p-2 rounded-xl text-center transition-all active:scale-95',
                    'border-2',
                    category === cat
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent bg-muted hover:bg-muted/80'
                  )}
                >
                  <span className="text-xl block">{CATEGORY_INFO[cat].icon}</span>
                  <span className="text-[9px] font-medium text-muted-foreground leading-tight block mt-0.5">
                    {CATEGORY_INFO[cat].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>Hạn sử dụng *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal rounded-xl h-12',
                    !expiryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'PPP', { locale: vi }) : 'Chọn ngày hết hạn'}
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

          {/* Quantity & Unit */}
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
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn vị</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="rounded-xl h-12">
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

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="VD: 50000"
              className="rounded-xl h-12"
            />
          </div>

          {/* Notes */}
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

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full rounded-xl h-12 text-base font-semibold" 
            disabled={!name || !expiryDate}
          >
            {editItem ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
