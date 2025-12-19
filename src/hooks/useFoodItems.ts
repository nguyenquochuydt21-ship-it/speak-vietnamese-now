import { useState, useEffect, useMemo, useCallback } from 'react';
import { FoodItem, FoodCategory, FoodStatus, SortOption, AppSettings, DEFAULT_SETTINGS } from '@/types/food';
import { differenceInDays, startOfDay } from 'date-fns';

const STORAGE_KEY = 'freshtrack-items';
const SETTINGS_KEY = 'freshtrack-settings';

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

export function getStatus(expiryDate: Date, notificationDays: number = 3): FoodStatus {
  const today = startOfDay(new Date());
  const expiry = startOfDay(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= notificationDays) return 'expiring';
  return 'fresh';
}

export function getDaysUntilExpiry(expiryDate: Date): number {
  const today = startOfDay(new Date());
  const expiry = startOfDay(expiryDate);
  return differenceInDays(expiry, today);
}

export function useFoodItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (storedItems) {
      try {
        const parsed = JSON.parse(storedItems);
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

    if (storedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      } catch (e) {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save items to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Save settings to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Auto-delete expired items
  useEffect(() => {
    if (isLoaded && settings.autoDeleteExpiredDays > 0) {
      const now = new Date();
      const updatedItems = items.filter((item) => {
        const daysExpired = getDaysUntilExpiry(item.expiryDate);
        return daysExpired >= -settings.autoDeleteExpiredDays;
      });
      
      if (updatedItems.length !== items.length) {
        setItems(updatedItems);
      }
    }
  }, [isLoaded, settings.autoDeleteExpiredDays]);

  const addItem = useCallback((item: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const newItem: FoodItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<FoodItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const duplicateItem = useCallback((item: FoodItem) => {
    const newItem: FoodItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const stats = useMemo(() => {
    const expired = items.filter((i) => getStatus(i.expiryDate, settings.notificationDays) === 'expired').length;
    const expiring = items.filter((i) => getStatus(i.expiryDate, settings.notificationDays) === 'expiring').length;
    const fresh = items.filter((i) => getStatus(i.expiryDate, settings.notificationDays) === 'fresh').length;
    return { total: items.length, expired, expiring, fresh };
  }, [items, settings.notificationDays]);

  const getSortedItems = useCallback((sortBy: SortOption) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'expiryDate':
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        case 'name':
          return a.name.localeCompare(b.name, 'vi');
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  }, [items]);

  const getExpiringItems = useCallback(() => {
    return items.filter((item) => {
      const status = getStatus(item.expiryDate, settings.notificationDays);
      return status === 'expiring' || status === 'expired';
    }).sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
  }, [items, settings.notificationDays]);

  return {
    items,
    settings,
    stats,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    updateSettings,
    getSortedItems,
    getExpiringItems,
    isLoaded,
  };
}
