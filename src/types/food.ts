export type FoodCategory = 
  | 'dairy'
  | 'meat'
  | 'vegetables'
  | 'fruits'
  | 'beverages'
  | 'grains'
  | 'frozen'
  | 'cosmetics'
  | 'medicine'
  | 'household'
  | 'other';

export type FoodStatus = 'fresh' | 'expiring' | 'expired';

export type SortOption = 'expiryDate' | 'name' | 'createdAt';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  expiryDate: Date;
  quantity: number;
  unit: string;
  price?: number;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface WasteRecord {
  id: string;
  itemName: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  price?: number;
  wastedAt: Date;
  expiryDate: Date;
}

export interface AppSettings {
  notificationDays: number;
  notificationTime: string;
  autoDeleteExpiredDays: number;
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notificationDays: 3,
  notificationTime: '08:00',
  autoDeleteExpiredDays: 7,
  dateFormat: 'dd/MM/yyyy',
  notificationsEnabled: true,
};

export const CATEGORY_INFO: Record<FoodCategory, { label: string; icon: string; color: string }> = {
  dairy: { label: 'Sữa & Trứng', icon: '🥛', color: 'category-dairy' },
  meat: { label: 'Thịt & Cá', icon: '🥩', color: 'category-meat' },
  vegetables: { label: 'Rau củ', icon: '🥬', color: 'category-vegetables' },
  fruits: { label: 'Trái cây', icon: '🍎', color: 'category-fruits' },
  beverages: { label: 'Đồ uống', icon: '🧃', color: 'category-beverages' },
  grains: { label: 'Ngũ cốc', icon: '🌾', color: 'category-grains' },
  frozen: { label: 'Đông lạnh', icon: '🧊', color: 'category-frozen' },
  cosmetics: { label: 'Mỹ phẩm', icon: '💄', color: 'category-cosmetics' },
  medicine: { label: 'Thuốc', icon: '💊', color: 'category-medicine' },
  household: { label: 'Gia dụng', icon: '🧹', color: 'category-household' },
  other: { label: 'Khác', icon: '📦', color: 'category-other' },
};

export const UNITS = ['cái', 'hộp', 'gói', 'chai', 'kg', 'g', 'lít', 'ml', 'viên', 'tuýp'];
