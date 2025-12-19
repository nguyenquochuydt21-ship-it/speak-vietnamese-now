import { FoodCategory, CATEGORY_INFO } from '@/types/food';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  category: FoodCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function CategoryIcon({ category, size = 'md', showLabel = false, className }: CategoryIconProps) {
  const info = CATEGORY_INFO[category];

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          info.color,
          'bg-opacity-20',
          sizeClasses[size]
        )}
      >
        <span>{info.icon}</span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{info.label}</span>
      )}
    </div>
  );
}
