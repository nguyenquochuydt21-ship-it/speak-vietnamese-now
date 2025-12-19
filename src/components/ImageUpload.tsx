import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Resize image to reduce storage size
        resizeImage(result, 400, 400).then((resized) => {
          onChange(resized);
          setIsLoading(false);
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsLoading(false);
    }
  };

  const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => onChange(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-20 rounded-xl border-dashed"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isLoading}
          >
            <div className="flex flex-col items-center gap-1">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Camera</span>
            </div>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-20 rounded-xl border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thư viện</span>
            </div>
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
