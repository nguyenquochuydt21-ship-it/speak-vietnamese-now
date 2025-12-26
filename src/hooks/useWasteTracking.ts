import { useState, useEffect, useMemo, useCallback } from 'react';
import { WasteRecord, FoodItem } from '@/types/food';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';

const WASTE_STORAGE_KEY = 'freshtrack-waste';

export function useWasteTracking() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(WASTE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const recordsWithDates = parsed.map((record: any) => ({
          ...record,
          wastedAt: new Date(record.wastedAt),
          expiryDate: new Date(record.expiryDate),
        }));
        setWasteRecords(recordsWithDates);
      } catch (e) {
        setWasteRecords([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WASTE_STORAGE_KEY, JSON.stringify(wasteRecords));
    }
  }, [wasteRecords, isLoaded]);

  const addWasteRecord = useCallback((item: FoodItem) => {
    const record: WasteRecord = {
      id: crypto.randomUUID(),
      itemName: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      wastedAt: new Date(),
      expiryDate: item.expiryDate,
    };
    setWasteRecords((prev) => [record, ...prev]);
  }, []);

  const getMonthlyWaste = useMemo(() => {
    const months: { month: string; totalValue: number; itemCount: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthRecords = wasteRecords.filter((record) => {
        const wastedAt = new Date(record.wastedAt);
        return wastedAt >= monthStart && wastedAt <= monthEnd;
      });
      
      const totalValue = monthRecords.reduce((sum, record) => {
        return sum + (record.price || 0) * record.quantity;
      }, 0);
      
      months.push({
        month: format(date, 'MMM', { locale: vi }),
        totalValue,
        itemCount: monthRecords.length,
      });
    }
    
    return months;
  }, [wasteRecords]);

  const totalWasteStats = useMemo(() => {
    const totalValue = wasteRecords.reduce((sum, record) => {
      return sum + (record.price || 0) * record.quantity;
    }, 0);
    
    const thisMonth = wasteRecords.filter((record) => {
      const wastedAt = new Date(record.wastedAt);
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      return wastedAt >= monthStart && wastedAt <= monthEnd;
    });
    
    const thisMonthValue = thisMonth.reduce((sum, record) => {
      return sum + (record.price || 0) * record.quantity;
    }, 0);
    
    return {
      totalItems: wasteRecords.length,
      totalValue,
      thisMonthItems: thisMonth.length,
      thisMonthValue,
    };
  }, [wasteRecords]);

  return {
    wasteRecords,
    addWasteRecord,
    getMonthlyWaste,
    totalWasteStats,
    isLoaded,
  };
}
