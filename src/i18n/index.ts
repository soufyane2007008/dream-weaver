/**
 * نظام الترجمة i18n لمنصة Ntfly
 * اللغة الافتراضية: العربية (RTL)
 * لتبديل اللغة: استخدم setLanguage('en') أو setLanguage('ar')
 */

import type { Language, TranslationStrings } from '@/types/global.d';

// النصوص العربية (الافتراضية)
const ar: TranslationStrings = {
  common: {
    loading: 'جارٍ التحميل...',
    error: 'حدث خطأ',
    success: 'تمت العملية بنجاح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    noData: 'لا توجد بيانات',
    retry: 'إعادة المحاولة',
  },
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginError: 'فشل تسجيل الدخول',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    registerSuccess: 'تم إنشاء الحساب بنجاح',
    registerError: 'فشل إنشاء الحساب',
    unauthorized: 'غير مصرح لك بالوصول',
    sessionExpired: 'انتهت صلاحية الجلسة',
  },
  nav: {
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    projects: 'المشاريع',
    orders: 'الطلبات',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    profile: 'الملف الشخصي',
    help: 'المساعدة',
  },
  home: {
    title: 'Ntfly - أنشئ موقعك في دقائق',
    subtitle: 'منصة ذكية لتوليد المواقع بتقنيات الذكاء الاصطناعي',
    cta: 'ابدأ الآن مجاناً',
    features: 'المميزات',
    pricing: 'الأسعار',
    contact: 'تواصل معنا',
    heroDescription: 'أنشئ موقعك الاحترافي في دقائق معدودة باستخدام الذكاء الاصطناعي. دعم كامل للغة العربية وتصميمات عصرية.',
  },
  dashboard: {
    welcome: 'مرحباً بك',
    stats: 'الإحصائيات',
    recentProjects: 'المشاريع الأخيرة',
    quickActions: 'إجراءات سريعة',
    createProject: 'مشروع جديد',
    viewAll: 'عرض الكل',
  },
  projects: {
    title: 'مشاريعي',
    new: 'مشروع جديد',
    name: 'اسم المشروع',
    description: 'وصف المشروع',
    template: 'القالب',
    status: 'الحالة',
    createdAt: 'تاريخ الإنشاء',
    actions: 'الإجراءات',
    download: 'تحميل',
    preview: 'معاينة',
    generating: 'جارٍ التوليد...',
    completed: 'مكتمل',
    failed: 'فشل',
    pending: 'في الانتظار',
    cancelled: 'ملغي',
  },
  templates: {
    landing: 'صفحة هبوط',
    business: 'موقع تجاري',
    portfolio: 'معرض أعمال',
    store: 'متجر إلكتروني',
    landingDesc: 'صفحة هبوط احترافية لمنتجك أو خدمتك',
    businessDesc: 'موقع متكامل لشركتك أو مؤسستك',
    portfolioDesc: 'معرض أعمال شخصي لعرض إنجازاتك',
    storeDesc: 'متجر إلكتروني بسيط لبيع منتجاتك',
  },
  admin: {
    title: 'لوحة الإدارة',
    users: 'المستخدمون',
    projects: 'المشاريع',
    orders: 'الطلبات',
    aiSettings: 'إعدادات AI',
    logs: 'السجلات',
    backups: 'النسخ الاحتياطي',
    featureFlags: 'الميزات',
    stats: 'الإحصائيات',
  },
  ai: {
    configTitle: 'إعدادات الذكاء الاصطناعي',
    enterPassphrase: 'أدخل كلمة المرور السرية',
    passphraseHint: 'تُستخدم لتشفير وفك تشفير مفاتيح API',
    saveKey: 'حفظ المفتاح',
    keysSaved: 'تم حفظ المفاتيح بنجاح',
    keysError: 'فشل حفظ المفاتيح',
    testConnection: 'اختبار الاتصال',
    connectionSuccess: 'الاتصال ناجح',
    connectionFailed: 'فشل الاتصال',
    mockMode: 'وضع المحاكاة نشط',
  },
  errors: {
    network: 'خطأ في الشبكة',
    timeout: 'انتهت مهلة الاتصال',
    unauthorized: 'غير مصرح',
    forbidden: 'ممنوع الوصول',
    notFound: 'غير موجود',
    serverError: 'خطأ في الخادم',
    validationError: 'خطأ في البيانات المدخلة',
    unknownError: 'خطأ غير معروف',
  },
  footer: {
    company: 'Ntfly Digital',
    rights: 'جميع الحقوق محفوظة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام',
    contact: 'تواصل معنا',
  },
};

// النصوص الإنجليزية
const en: TranslationStrings = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Operation successful',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    noData: 'No data available',
    retry: 'Retry',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    loginSuccess: 'Login successful',
    loginError: 'Login failed',
    logoutSuccess: 'Logout successful',
    registerSuccess: 'Registration successful',
    registerError: 'Registration failed',
    unauthorized: 'Unauthorized access',
    sessionExpired: 'Session expired',
  },
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    projects: 'Projects',
    orders: 'Orders',
    settings: 'Settings',
    admin: 'Admin',
    profile: 'Profile',
    help: 'Help',
  },
  home: {
    title: 'Ntfly - Build Your Site in Minutes',
    subtitle: 'AI-Powered Website Generation Platform',
    cta: 'Start Free Now',
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact Us',
    heroDescription: 'Create your professional website in minutes using AI. Full Arabic support and modern designs.',
  },
  dashboard: {
    welcome: 'Welcome',
    stats: 'Statistics',
    recentProjects: 'Recent Projects',
    quickActions: 'Quick Actions',
    createProject: 'New Project',
    viewAll: 'View All',
  },
  projects: {
    title: 'My Projects',
    new: 'New Project',
    name: 'Project Name',
    description: 'Description',
    template: 'Template',
    status: 'Status',
    createdAt: 'Created At',
    actions: 'Actions',
    download: 'Download',
    preview: 'Preview',
    generating: 'Generating...',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
    cancelled: 'Cancelled',
  },
  templates: {
    landing: 'Landing Page',
    business: 'Business Site',
    portfolio: 'Portfolio',
    store: 'Online Store',
    landingDesc: 'Professional landing page for your product',
    businessDesc: 'Complete website for your company',
    portfolioDesc: 'Personal portfolio to showcase your work',
    storeDesc: 'Simple online store for your products',
  },
  admin: {
    title: 'Admin Panel',
    users: 'Users',
    projects: 'Projects',
    orders: 'Orders',
    aiSettings: 'AI Settings',
    logs: 'Logs',
    backups: 'Backups',
    featureFlags: 'Features',
    stats: 'Statistics',
  },
  ai: {
    configTitle: 'AI Configuration',
    enterPassphrase: 'Enter Secret Passphrase',
    passphraseHint: 'Used to encrypt and decrypt API keys',
    saveKey: 'Save Key',
    keysSaved: 'Keys saved successfully',
    keysError: 'Failed to save keys',
    testConnection: 'Test Connection',
    connectionSuccess: 'Connection successful',
    connectionFailed: 'Connection failed',
    mockMode: 'Mock mode active',
  },
  errors: {
    network: 'Network error',
    timeout: 'Connection timeout',
    unauthorized: 'Unauthorized',
    forbidden: 'Access forbidden',
    notFound: 'Not found',
    serverError: 'Server error',
    validationError: 'Validation error',
    unknownError: 'Unknown error',
  },
  footer: {
    company: 'Ntfly Digital',
    rights: 'All rights reserved',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact Us',
  },
};

// قاموس اللغات
const translations: Record<Language, TranslationStrings> = { ar, en };

// اللغة الحالية (افتراضياً العربية)
let currentLanguage: Language = 'ar';

/**
 * الحصول على اللغة الحالية
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * تغيير اللغة
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  
  // تحديث اتجاه الصفحة
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  
  // حفظ في localStorage
  try {
    localStorage.setItem('ntfly_language', lang);
  } catch {
    // تجاهل أخطاء localStorage
  }
}

/**
 * تحميل اللغة المحفوظة
 */
export function loadSavedLanguage(): void {
  try {
    const saved = localStorage.getItem('ntfly_language') as Language | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLanguage(saved);
    }
  } catch {
    // استخدم الافتراضي
  }
}

/**
 * الحصول على نص مترجم
 * @param key - مفتاح النص (مثل: 'auth.login' أو 'common.loading')
 * @param fallback - نص احتياطي إذا لم يُوجد المفتاح
 */
export function t(key: string, fallback?: string): string {
  const keys = key.split('.');
  let result: unknown = translations[currentLanguage];
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof result === 'string' ? result : (fallback || key);
}

/**
 * Hook للاستخدام في React components
 */
export function useTranslation() {
  return {
    t,
    language: currentLanguage,
    setLanguage,
    isRTL: currentLanguage === 'ar',
  };
}

// تحميل اللغة عند بدء التطبيق
loadSavedLanguage();

export default { t, getLanguage, setLanguage, useTranslation };
