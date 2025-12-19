import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, ChefHat } from 'lucide-react';
import { useFoodItems, getStatus } from '@/hooks/useFoodItems';
import { FoodItem, FoodCategory, FoodStatus, SortOption } from '@/types/food';
import { StatsBar } from '@/components/StatsBar';
import { FoodCard } from '@/components/FoodCard';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { AddEditSheet } from '@/components/AddEditSheet';
import { ProductDetail } from '@/components/ProductDetail';
import { SettingsSheet } from '@/components/SettingsSheet';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { 
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
    isLoaded 
  } = useFoodItems();
  
  const { toast } = useToast();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<FoodCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<FoodStatus[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('expiryDate');
  
  // Sheet States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [detailItem, setDetailItem] = useState<FoodItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    const sorted = getSortedItems(sortBy);
    
    return sorted.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(getStatus(item.expiryDate, settings.notificationDays));
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, selectedCategories, selectedStatuses, sortBy, settings.notificationDays, getSortedItems]);

  // Handlers
  const handleAdd = (item: Omit<FoodItem, 'id' | 'createdAt'>) => {
    addItem(item);
    toast({
      title: 'Đã thêm thành công!',
      description: `${item.name} đã được thêm vào danh sách.`,
    });
  };

  const handleUpdate = (id: string, updates: Partial<FoodItem>) => {
    updateItem(id, updates);
    setEditItem(null);
    toast({
      title: 'Đã cập nhật!',
      description: 'Thông tin sản phẩm đã được cập nhật.',
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      const item = items.find((i) => i.id === deleteId);
      deleteItem(deleteId);
      setDeleteId(null);
      toast({
        title: 'Đã xóa!',
        description: `${item?.name} đã được xóa khỏi danh sách.`,
      });
    }
  };

  const handleDuplicate = (item: FoodItem) => {
    duplicateItem(item);
    toast({
      title: 'Đã sao chép!',
      description: `${item.name} đã được thêm lại vào danh sách.`,
    });
  };

  const handleEditClick = (item: FoodItem) => {
    setEditItem(item);
    setIsAddEditOpen(true);
  };

  const handleDetailClick = (item: FoodItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  const openAddNew = () => {
    setEditItem(null);
    setIsAddEditOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 gradient-hero rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-2xl">🥗</span>
          </div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const hasFilters = searchQuery || selectedCategories.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-lg">🥗</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">FreshTrack</h1>
                <p className="text-[10px] text-muted-foreground">Theo dõi hạn sử dụng</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4 space-y-4">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Search & Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          selectedStatuses={selectedStatuses}
          onStatusChange={setSelectedStatuses}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Swipe Hint */}
        {items.length > 0 && !hasFilters && (
          <p className="text-xs text-muted-foreground text-center">
            👈 Vuốt trái để xóa • Vuốt phải để sửa 👉
          </p>
        )}

        {/* Product List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">
              Sản phẩm
              {filteredItems.length !== items.length && (
                <span className="text-sm font-normal text-muted-foreground ml-1.5">
                  ({filteredItems.length}/{items.length})
                </span>
              )}
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState type={hasFilters ? 'no-results' : 'empty'} />
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FoodCard
                      item={item}
                      settings={settings}
                      onEdit={handleEditClick}
                      onDelete={setDeleteId}
                      onClick={handleDetailClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* Floating Add Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-soft-xl"
          onClick={openAddNew}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Add/Edit Sheet */}
      <AddEditSheet
        open={isAddEditOpen}
        onOpenChange={setIsAddEditOpen}
        editItem={editItem}
        settings={settings}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
      />

      {/* Product Detail Sheet */}
      <ProductDetail
        item={detailItem}
        settings={settings}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={handleEditClick}
        onDelete={setDeleteId}
        onDuplicate={handleDuplicate}
      />

      {/* Settings Sheet */}
      <SettingsSheet
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl max-w-[90vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="rounded-xl bg-expired hover:bg-expired/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
