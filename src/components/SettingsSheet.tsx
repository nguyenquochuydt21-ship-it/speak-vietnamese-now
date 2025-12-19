import { Bell, Trash2, Calendar, Tag } from 'lucide-react';
import { AppSettings, FoodCategory, CATEGORY_INFO } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export function SettingsSheet({ open, onOpenChange, settings, onUpdateSettings }: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-bold">Cài đặt</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] hide-scrollbar">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Bell className="h-4 w-4" />
              Thông báo
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Bật thông báo</Label>
                  <p className="text-xs text-muted-foreground">Nhận thông báo khi sản phẩm sắp hết hạn</p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => onUpdateSettings({ notificationsEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Thông báo trước (ngày)</Label>
                <Select 
                  value={settings.notificationDays.toString()}
                  onValueChange={(value) => onUpdateSettings({ notificationDays: parseInt(value) })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 7, 14].map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} ngày
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Giờ thông báo</Label>
                <Input
                  type="time"
                  value={settings.notificationTime}
                  onChange={(e) => onUpdateSettings({ notificationTime: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Auto Delete Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Trash2 className="h-4 w-4" />
              Tự động xóa
            </div>

            <div className="space-y-2 pl-6">
              <Label className="text-sm">Xóa sản phẩm hết hạn sau</Label>
              <Select 
                value={settings.autoDeleteExpiredDays.toString()}
                onValueChange={(value) => onUpdateSettings({ autoDeleteExpiredDays: parseInt(value) })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không tự động xóa</SelectItem>
                  <SelectItem value="1">1 ngày</SelectItem>
                  <SelectItem value="3">3 ngày</SelectItem>
                  <SelectItem value="7">7 ngày</SelectItem>
                  <SelectItem value="14">14 ngày</SelectItem>
                  <SelectItem value="30">30 ngày</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sản phẩm sẽ tự động bị xóa sau khi hết hạn số ngày đã chọn
              </p>
            </div>
          </div>

          {/* Date Format Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Định dạng ngày
            </div>

            <div className="space-y-2 pl-6">
              <Select 
                value={settings.dateFormat}
                onValueChange={(value: AppSettings['dateFormat']) => onUpdateSettings({ dateFormat: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/MM/yyyy">31/12/2024</SelectItem>
                  <SelectItem value="MM/dd/yyyy">12/31/2024</SelectItem>
                  <SelectItem value="yyyy-MM-dd">2024-12-31</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Tag className="h-4 w-4" />
              Danh mục có sẵn
            </div>

            <div className="grid grid-cols-3 gap-2 pl-6">
              {(Object.keys(CATEGORY_INFO) as FoodCategory[]).map((cat) => (
                <div
                  key={cat}
                  className="p-2 rounded-xl bg-muted text-center"
                >
                  <span className="text-lg block">{CATEGORY_INFO[cat].icon}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {CATEGORY_INFO[cat].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
