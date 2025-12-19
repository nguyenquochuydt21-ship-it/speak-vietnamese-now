import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FoodCategory, FoodStatus, CATEGORY_INFO } from '@/types/food';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: FoodCategory[];
  onCategoryChange: (categories: FoodCategory[]) => void;
  selectedStatuses: FoodStatus[];
  onStatusChange: (statuses: FoodStatus[]) => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedStatuses,
  onStatusChange,
}: SearchFilterProps) {
  const hasFilters = selectedCategories.length > 0 || selectedStatuses.length > 0;

  const toggleCategory = (cat: FoodCategory) => {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  const toggleStatus = (status: FoodStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
    onStatusChange([]);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm thực phẩm..."
          className="pl-9 rounded-xl bg-card"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className={cn('rounded-xl relative', hasFilters && 'border-primary')}>
            <Filter className="h-4 w-4" />
            {hasFilters && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {selectedCategories.length + selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center justify-between">
            Bộ lọc
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                Xóa tất cả
              </button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Trạng thái
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('expired')}
            onCheckedChange={() => toggleStatus('expired')}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-expired" />
              Hết hạn
            </span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('expiring')}
            onCheckedChange={() => toggleStatus('expiring')}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Sắp hết hạn
            </span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatuses.includes('fresh')}
            onCheckedChange={() => toggleStatus('fresh')}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fresh" />
              Còn hạn
            </span>
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Danh mục
          </DropdownMenuLabel>
          {(Object.keys(CATEGORY_INFO) as FoodCategory[]).map((cat) => (
            <DropdownMenuCheckboxItem
              key={cat}
              checked={selectedCategories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
            >
              <span className="flex items-center gap-2">
                <span>{CATEGORY_INFO[cat].icon}</span>
                {CATEGORY_INFO[cat].label}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
