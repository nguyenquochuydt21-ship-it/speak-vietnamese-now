import { useState, useEffect, useMemo } from 'react';
import { FoodItem, FoodCategory, FoodStatus } from '@/types/food';
import { differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

const STORAGE_KEY = 'freshtrack-items';

// Sample data for demo
const sampleItems: FoodItem[] = [
  {
    id: '1',
    name: 'Sữa tươi TH True Milk',
    category: 'dairy',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    quantity: 2,
    unit: 'hộp',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Thịt bò Úc',
    category: 'meat',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    quantity: 500,
    unit: 'g',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Cà chua',
    category: 'vegetables',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    quantity: 1,
    unit: 'kg',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Táo Mỹ',
    category: 'fruits',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    quantity: 6,
    unit: 'cái',
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Nước cam Tropicana',
    category: 'beverages',
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    quantity: 1,
    unit: 'chai',
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Bánh mì sandwich',
    category: 'grains',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    quantity: 1,
    unit: 'gói',
    createdAt: new Date(),
  },
];

export function getStatus(expiryDate: Date): FoodStatus {
  const today = startOfDay(new Date());
  const expiry = startOfDay(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 3) return 'expiring';
  return 'fresh';
}

export function getDaysUntilExpiry(expiryDate: Date): number {
  const today = startOfDay(new Date());
  const expiry = startOfDay(expiryDate);
  return differenceInDays(expiry, today);
}

export function useFoodItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          expiryDate: new Date(item.expiryDate),
          createdAt: new Date(item.createdAt),
        }));
        setItems(itemsWithDates);
      } catch (e) {
        setItems(sampleItems);
      }
    } else {
      setItems(sampleItems);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const newItem: FoodItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<FoodItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const stats = useMemo(() => {
    const expired = items.filter((i) => getStatus(i.expiryDate) === 'expired').length;
    const expiring = items.filter((i) => getStatus(i.expiryDate) === 'expiring').length;
    const fresh = items.filter((i) => getStatus(i.expiryDate) === 'fresh').length;
    return { total: items.length, expired, expiring, fresh };
  }, [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
  }, [items]);

  return {
    items: sortedItems,
    stats,
    addItem,
    updateItem,
    deleteItem,
    isLoaded,
  };
}
