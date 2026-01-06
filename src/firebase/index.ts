/**
 * الملف الرئيسي لـ Firebase - يدير التهيئة والتحول لوضع Mock
 * يعمل تلقائياً في وضع Mock إذا لم تكن مفاتيح Firebase موجودة
 */

import { firebaseConfig, isFirebaseConfigured, isMockMode } from './firebase.config';

// حالة التهيئة
let isInitialized = false;
let mockModeEnabled = false;

// Mock data stores
const mockUsers = new Map<string, MockUser>();
const mockCollections = new Map<string, Map<string, unknown>>();
const mockStorage = new Map<string, Blob>();

interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
}

/**
 * تهيئة Firebase بشكل آمن
 * يتحول تلقائياً لوضع Mock إذا لم تكن الإعدادات موجودة
 */
export async function safeInitializeFirebase(): Promise<boolean> {
  if (isInitialized) return !mockModeEnabled;
  
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
    // هنا يتم تهيئة Firebase الحقيقي
    // ملاحظة: لتفعيل Firebase الحقيقي، أضف مكتبة firebase وفك التعليقات
    /*
    const { initializeApp } = await import('firebase/app');
    const app = initializeApp(firebaseConfig);
    console.info('✅ Ntfly: تم تهيئة Firebase بنجاح');
    */
    
    // حالياً نستخدم Mock حتى مع وجود الإعدادات للاختبار
    console.info('📦 Ntfly: وضع Mock نشط (Firebase SDK غير مُثبّت)');
    mockModeEnabled = true;
    isInitialized = true;
    window.__NTFLY_MOCK_MODE__ = true;
    initializeMockStore();
    return false;
    
  } catch (error) {
    console.error('❌ Ntfly: فشل تهيئة Firebase:', error);
    mockModeEnabled = true;
    isInitialized = true;
    window.__NTFLY_MOCK_MODE__ = true;
    initializeMockStore();
    return false;
  }
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
      email: 'admin@ntfly.dev',
      displayName: 'مدير النظام',
      photoURL: null,
      createdAt: Date.now(),
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
export { isFirebaseConfigured, isMockMode, firebaseConfig };
