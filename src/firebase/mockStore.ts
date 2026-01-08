/**
 * Mock Store - مخزن البيانات المحلي
 * ملف منفصل لتجنب الاعتماديات الدائرية
 */

import { MOCK_DATA_KEY, ADMIN_EMAIL } from './constants';
import type { UserRole } from '@/types/global.d';

export interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  role?: UserRole;
  provider?: string;
}

// حالة Mock Mode
let mockModeEnabled = false;

// Mock data stores
const mockUsers = new Map<string, MockUser>();
const mockCollections = new Map<string, Map<string, unknown>>();
const mockStorage = new Map<string, Blob>();

/**
 * تعيين حالة Mock Mode
 */
export function setMockMode(enabled: boolean): void {
  mockModeEnabled = enabled;
  if (typeof window !== 'undefined') {
    window.__NTFLY_MOCK_MODE__ = enabled;
  }
}

/**
 * الحصول على حالة Mock Mode
 */
export function getMockMode(): boolean {
  return mockModeEnabled;
}

/**
 * تهيئة المخزن المحلي
 */
export function initializeMockStore(): void {
  try {
    const savedData = localStorage.getItem(MOCK_DATA_KEY);
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
  
  // إضافة مستخدم admin افتراضي
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
 * حفظ البيانات في localStorage
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
    
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
  } catch {
    // تجاهل
  }
}

/**
 * الحصول على مخزن المستخدمين
 */
export function getMockUsers(): Map<string, MockUser> {
  return mockUsers;
}

/**
 * الحصول على مجموعة
 */
export function getMockCollection(name: string): Map<string, unknown> {
  if (!mockCollections.has(name)) {
    mockCollections.set(name, new Map());
  }
  return mockCollections.get(name)!;
}

/**
 * الحصول على مخزن الملفات
 */
export function getMockStorage(): Map<string, Blob> {
  return mockStorage;
}
