/**
 * إعدادات السمة والألوان لمنصة Ntfly
 * يدير التبديل بين الوضع الداكن والفاتح وحفظ التفضيلات
 */

export type ThemeMode = 'light' | 'dark' | 'system';

// الألوان الأساسية للمنصة (HSL values)
export const themeColors = {
  primary: { h: 207, s: 90, l: 54 }, // #1E88E5
  accent: { h: 36, s: 100, l: 65 },  // #FFB74D
  success: { h: 123, s: 43, l: 57 }, // #66BB6A
  destructive: { h: 0, s: 84, l: 60 },
  warning: { h: 38, s: 92, l: 50 },
  
  light: {
    background: { h: 0, s: 0, l: 100 },
    foreground: { h: 222, s: 47, l: 11 },
    card: { h: 0, s: 0, l: 100 },
    muted: { h: 210, s: 20, l: 96 },
  },
  
  dark: {
    background: { h: 0, s: 0, l: 7 }, // #121212
    foreground: { h: 210, s: 40, l: 98 },
    card: { h: 0, s: 0, l: 11 },
    muted: { h: 217, s: 33, l: 17 },
  }
};

const THEME_STORAGE_KEY = 'ntfly_theme';

/**
 * الحصول على السمة الحالية
 */
export function getTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // تجاهل
  }
  return 'light';
}

/**
 * حفظ السمة
 */
export function setTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // تجاهل
  }
  applyTheme(mode);
}

/**
 * تطبيق السمة على الصفحة
 */
export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  
  let effectiveMode = mode;
  if (mode === 'system') {
    effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  if (effectiveMode === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

/**
 * تبديل السمة
 */
export function toggleTheme(): ThemeMode {
  const current = getTheme();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * تهيئة السمة عند بدء التطبيق
 */
export function initializeTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
  
  // الاستماع لتغييرات نظام التشغيل
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (getTheme() === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
