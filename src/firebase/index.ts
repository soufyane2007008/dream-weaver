/**
 * الملف الرئيسي لـ Firebase - يدير التهيئة الديناميكية والتحول لوضع Mock
 * يدعم تغيير الإعدادات من لوحة التحكم بدون إعادة تحميل الكود
 */

import { 
  firebaseConfig, 
  isFirebaseConfigured, 
  isMockMode, 
  saveFirebaseConfig,
  reloadConfig,
  type FirebaseConfig 
} from './firebase.config';

// حالة التهيئة
let isInitialized = false;
let mockModeEnabled = false;
let firebaseApp: unknown = null;

// Mock data stores
const mockUsers = new Map<string, MockUser>();
const mockCollections = new Map<string, Map<string, unknown>>();
const mockStorage = new Map<string, Blob>();

export interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  role?: 'user' | 'admin';
  provider?: string;
}

/**
 * البريد الإلكتروني الثابت للأدمن
 */
export const ADMIN_EMAIL = 'lrsoufyane2007@gmail.com';

/**
 * تهيئة Firebase بشكل آمن
 * يتحول تلقائياً لوضع Mock إذا لم تكن الإعدادات موجودة
 */
export async function safeInitializeFirebase(): Promise<boolean> {
  if (isInitialized) return !mockModeEnabled;
  
  // إعادة تحميل الإعدادات
  reloadConfig();
  
  if (!isFirebaseConfigured()) {
    console.info('📦 Ntfly: Firebase غير مُعَد - تفعيل وضع Mock');
    mockModeEnabled = true;
    isInitialized = true;
    window.__NTFLY_MOCK_MODE__ = true;
    
    // تهيئة المخزن المحلي
    initializeMockStore();
    return false;
  }
  
  try {
    // محاولة تهيئة Firebase الحقيقي ديناميكياً
    const firebaseAppModule = await import('firebase/app');
    const { initializeApp, getApps, getApp } = firebaseAppModule;
    
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      console.info('✅ Ntfly: تم تهيئة Firebase بنجاح');
    } else {
      firebaseApp = getApp();
    }
    
    mockModeEnabled = false;
    isInitialized = true;
    window.__NTFLY_MOCK_MODE__ = false;
    return true;
    
  } catch (error) {
    console.warn('⚠️ Ntfly: تعذر تحميل Firebase SDK، تفعيل وضع Mock:', error);
    mockModeEnabled = true;
    isInitialized = true;
    window.__NTFLY_MOCK_MODE__ = true;
    initializeMockStore();
    return false;
  }
}

/**
 * إعادة تهيئة Firebase بإعدادات جديدة
 */
export async function reinitializeFirebase(config: FirebaseConfig): Promise<boolean> {
  saveFirebaseConfig(config);
  isInitialized = false;
  firebaseApp = null;
  return safeInitializeFirebase();
}

/**
 * تهيئة المخزن المحلي للـ Mock
 */
function initializeMockStore(): void {
  // تحميل البيانات المحفوظة
  try {
    const savedData = localStorage.getItem('ntfly_mock_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.users) {
        Object.entries(parsed.users).forEach(([key, value]) => {
          mockUsers.set(key, value as MockUser);
        });
      }
      if (parsed.collections) {
        Object.entries(parsed.collections).forEach(([collName, docs]) => {
          const collection = new Map<string, unknown>();
          Object.entries(docs as Record<string, unknown>).forEach(([docId, doc]) => {
            collection.set(docId, doc);
          });
          mockCollections.set(collName, collection);
        });
      }
    }
  } catch {
    // تجاهل أخطاء التحميل
  }
  
  // إضافة مستخدم admin افتراضي للاختبار
  if (!mockUsers.has('admin')) {
    mockUsers.set('admin', {
      uid: 'admin',
      email: ADMIN_EMAIL,
      displayName: 'مدير النظام - Soufyane',
      photoURL: null,
      createdAt: Date.now(),
      role: 'admin',
    });
  }
}

/**
 * حفظ البيانات Mock في localStorage
 */
export function saveMockData(): void {
  if (!mockModeEnabled) return;
  
  try {
    const data = {
      users: Object.fromEntries(mockUsers),
      collections: {} as Record<string, Record<string, unknown>>,
    };
    
    mockCollections.forEach((docs, collName) => {
      data.collections[collName] = Object.fromEntries(docs);
    });
    
    localStorage.setItem('ntfly_mock_data', JSON.stringify(data));
  } catch {
    // تجاهل أخطاء الحفظ
  }
}

/**
 * الحصول على حالة Mock Mode
 */
export function getMockMode(): boolean {
  return mockModeEnabled;
}

/**
 * الحصول على تطبيق Firebase
 */
export function getFirebaseApp(): unknown {
  return firebaseApp;
}

/**
 * الحصول على مخزن المستخدمين Mock
 */
export function getMockUsers(): Map<string, MockUser> {
  return mockUsers;
}

/**
 * الحصول على مجموعة Mock
 */
export function getMockCollection(name: string): Map<string, unknown> {
  if (!mockCollections.has(name)) {
    mockCollections.set(name, new Map());
  }
  return mockCollections.get(name)!;
}

/**
 * الحصول على مخزن الملفات Mock
 */
export function getMockStorage(): Map<string, Blob> {
  return mockStorage;
}

/**
 * إعادة تصدير الدوال الرئيسية
 */
export { isFirebaseConfigured, isMockMode, firebaseConfig, saveFirebaseConfig };
