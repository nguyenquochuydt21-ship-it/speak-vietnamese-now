import { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { FoodCategory, FoodStatus, SortOption, CATEGORY_INFO } from '@/types/food';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: FoodCategory[];
  onCategoryChange: (categories: FoodCategory[]) => void;
  selectedStatuses: FoodStatus[];
  onStatusChange: (statuses: FoodStatus[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'expiryDate', label: 'Ngày hết hạn' },
  { value: 'name', label: 'Tên A-Z' },
  { value: 'createdAt', label: 'Mới thêm' },
];

const STATUS_OPTIONS: { value: FoodStatus; label: string; color: string }[] = [
  { value: 'expired', label: 'Hết hạn', color: 'bg-expired' },
  { value: 'expiring', label: 'Sắp hết hạn', color: 'bg-warning' },
  { value: 'fresh', label: 'Còn hạn', color: 'bg-fresh' },
];

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedStatuses,
  onStatusChange,
  sortBy,
  onSortChange,
}: SearchAndFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10 pr-10 rounded-xl h-11 bg-card shadow-soft"
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                'rounded-xl h-11 w-11 shrink-0 shadow-soft',
                hasFilters && 'border-primary bg-primary/5'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {hasFilters && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {selectedCategories.length + selectedStatuses.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold">Bộ lọc</SheetTitle>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
                    Xóa tất cả
                  </Button>
                )}
              </div>
            </SheetHeader>

            <div className="space-y-6 overflow-y-auto max-h-[calc(70vh-100px)] hide-scrollbar">
              {/* Sort */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sắp xếp theo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => onSortChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Trạng thái</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedStatuses.includes(option.value) ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full gap-2"
                      onClick={() => toggleStatus(option.value)}
                    >
                      <span className={cn('w-2 h-2 rounded-full', option.color)} />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Danh mục</h3>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(CATEGORY_INFO) as FoodCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        'p-2 rounded-xl text-center transition-all active:scale-95',
                        'border-2',
                        selectedCategories.includes(cat)
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
            </div>

            <Button 
              className="w-full mt-4 rounded-xl h-12"
              onClick={() => setIsOpen(false)}
            >
              Áp dụng
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
