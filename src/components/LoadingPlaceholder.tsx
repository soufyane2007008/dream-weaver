/**
 * مكون عرض حالة التحميل لمنصة Ntfly
 * يُستخدم في Guards وأثناء انتظار البيانات
 */

import { Loader2 } from 'lucide-react';

interface LoadingPlaceholderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingPlaceholder({ 
  message = 'جارٍ التحميل...', 
  size = 'md',
  fullScreen = false 
}: LoadingPlaceholderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      {content}
    </div>
  );
}

export default LoadingPlaceholder;
