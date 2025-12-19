import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Leaf, AlertTriangle, XCircle } from 'lucide-react';
import { useFoodItems, getStatus } from '@/hooks/useFoodItems';
import { FoodItem, FoodCategory, FoodStatus } from '@/types/food';
import { StatsCard } from '@/components/StatsCard';
import { FoodCard } from '@/components/FoodCard';
import { AddFoodDialog } from '@/components/AddFoodDialog';
import { SearchFilter } from '@/components/SearchFilter';
import { EmptyState } from '@/components/EmptyState';
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
  const { items, stats, addItem, updateItem, deleteItem, isLoaded } = useFoodItems();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<FoodCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<FoodStatus[]>([]);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(getStatus(item.expiryDate));
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, selectedCategories, selectedStatuses]);

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
      description: 'Thông tin thực phẩm đã được cập nhật.',
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
                <span className="text-xl">🥗</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FreshTrack</h1>
                <p className="text-xs text-muted-foreground">Theo dõi hạn sử dụng</p>
              </div>
            </div>
            <AddFoodDialog onAdd={handleAdd} />
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatsCard
              title="Tổng cộng"
              value={stats.total}
              icon={Package}
              variant="total"
              delay={0}
            />
            <StatsCard
              title="Còn hạn"
              value={stats.fresh}
              icon={Leaf}
              variant="fresh"
              delay={0.1}
            />
            <StatsCard
              title="Sắp hết hạn"
              value={stats.expiring}
              icon={AlertTriangle}
              variant="warning"
              delay={0.2}
            />
            <StatsCard
              title="Đã hết hạn"
              value={stats.expired}
              icon={XCircle}
              variant="expired"
              delay={0.3}
            />
          </div>
        </section>

        {/* Search & Filter */}
        <section>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
          />
        </section>

        {/* Food List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Danh sách thực phẩm
              {filteredItems.length !== items.length && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredItems.length}/{items.length})
                </span>
              )}
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState
              title={searchQuery || selectedCategories.length > 0 || selectedStatuses.length > 0 
                ? 'Không tìm thấy kết quả' 
                : 'Chưa có thực phẩm nào'}
              description={searchQuery || selectedCategories.length > 0 || selectedStatuses.length > 0
                ? 'Thử thay đổi từ khóa hoặc bộ lọc'
                : 'Thêm thực phẩm đầu tiên để bắt đầu theo dõi hạn sử dụng'}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={setEditItem}
                    onDelete={setDeleteId}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* Edit Dialog */}
      {editItem && (
        <AddFoodDialog
          editItem={editItem}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa thực phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-expired hover:bg-expired/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
