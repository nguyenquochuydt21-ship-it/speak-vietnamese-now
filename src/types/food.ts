export type FoodCategory = 
  | 'dairy'
  | 'meat'
  | 'vegetables'
  | 'fruits'
  | 'beverages'
  | 'grains'
  | 'frozen'
  | 'other';

export type FoodStatus = 'fresh' | 'expiring' | 'expired';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  expiryDate: Date;
  quantity: number;
  unit: string;
  notes?: string;
  createdAt: Date;
}

export const CATEGORY_INFO: Record<FoodCategory, { label: string; icon: string; color: string }> = {
  dairy: { label: 'Sữa & Trứng', icon: '🥛', color: 'bg-category-dairy' },
  meat: { label: 'Thịt & Cá', icon: '🥩', color: 'bg-category-meat' },
  vegetables: { label: 'Rau củ', icon: '🥬', color: 'bg-category-vegetables' },
  fruits: { label: 'Trái cây', icon: '🍎', color: 'bg-category-fruits' },
  beverages: { label: 'Đồ uống', icon: '🧃', color: 'bg-category-beverages' },
  grains: { label: 'Ngũ cốc', icon: '🌾', color: 'bg-category-grains' },
  frozen: { label: 'Đông lạnh', icon: '🧊', color: 'bg-category-frozen' },
  other: { label: 'Khác', icon: '📦', color: 'bg-category-other' },
};

export const UNITS = ['cái', 'hộp', 'gói', 'chai', 'kg', 'g', 'lít', 'ml'];
