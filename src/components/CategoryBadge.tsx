import { FoodCategory, CATEGORY_INFO } from '@/types/food';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: FoodCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function CategoryBadge({ category, size = 'md', showLabel = false, className }: CategoryBadgeProps) {
  const info = CATEGORY_INFO[category];

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-xl shrink-0',
          `bg-${info.color}/20`,
          sizeClasses[size]
        )}
        style={{
          backgroundColor: `hsl(var(--${info.color}) / 0.15)`,
        }}
      >
        <span>{info.icon}</span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{info.label}</span>
      )}
    </div>
  );
}
