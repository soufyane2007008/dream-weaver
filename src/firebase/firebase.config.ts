/**
 * إعدادات Firebase الديناميكية لمنصة Ntfly
 * تُحمل الإعدادات من لوحة التحكم (localStorage) أو من متغيرات البيئة
 * يتحول تلقائياً لوضع Mock إذا لم تتوفر إعدادات
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const STORAGE_KEY = 'ntfly_firebase_config';

/**
 * تحميل الإعدادات من localStorage أولاً، ثم من متغيرات البيئة
 */
function loadConfig(): FirebaseConfig {
  // أولاً: محاولة تحميل من localStorage (إعدادات لوحة التحكم)
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.apiKey && parsed.authDomain && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // تجاهل أخطاء التحميل
  }
  
  // ثانياً: تحميل من متغيرات البيئة
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  };
}

// الإعدادات الحالية
export let firebaseConfig: FirebaseConfig = loadConfig();

/**
 * التحقق من وجود إعدادات Firebase صالحة
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

/**
 * الحصول على حالة وضع Mock
 */
export function isMockMode(): boolean {
  return !isFirebaseConfigured();
}

/**
 * حفظ إعدادات Firebase في localStorage
 */
export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    firebaseConfig = config;
    return true;
  } catch {
    return false;
  }
}

/**
 * مسح إعدادات Firebase
 */
export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
  firebaseConfig = loadConfig();
}

/**
 * إعادة تحميل الإعدادات
 */
export function reloadConfig(): FirebaseConfig {
  firebaseConfig = loadConfig();
  return firebaseConfig;
}

/**
 * الحصول على الإعدادات الحالية
 */
export function getFirebaseConfig(): FirebaseConfig {
  return firebaseConfig;
}

export default firebaseConfig;
