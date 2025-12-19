import { useState, useRef, ReactNode } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const SWIPE_THRESHOLD = 80;

export function SwipeableCard({ children, onEdit, onDelete, className }: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  
  const editOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const deleteOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const editScale = useTransform(x, [0, SWIPE_THRESHOLD], [0.5, 1]);
  const deleteScale = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.offset.x > SWIPE_THRESHOLD) {
      onEdit();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onDelete();
    }
  };

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-xl">
      {/* Edit Action (Right swipe) */}
      <motion.div 
        className="absolute inset-y-0 left-0 w-20 flex items-center justify-center bg-primary rounded-l-xl"
        style={{ opacity: editOpacity, scale: editScale }}
      >
        <Edit2 className="w-6 h-6 text-primary-foreground" />
      </motion.div>

      {/* Delete Action (Left swipe) */}
      <motion.div 
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-expired rounded-r-xl"
        style={{ opacity: deleteOpacity, scale: deleteScale }}
      >
        <Trash2 className="w-6 h-6 text-expired-foreground" />
      </motion.div>

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          'relative bg-card touch-pan-y cursor-grab active:cursor-grabbing',
          isDragging && 'z-10',
          className
        )}
        whileTap={{ cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
