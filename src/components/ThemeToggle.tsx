/**
 * زر تبديل السمة بين الوضع الداكن والفاتح
 * يحفظ التفضيل في localStorage
 */

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTheme, toggleTheme, type ThemeMode } from '@/settings/theme';

export function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      title={theme === 'dark' ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
