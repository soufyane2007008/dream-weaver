/**
 * خدمة إدارة مفاتيح الذكاء الاصطناعي
 * تخزين آمن في Firestore مع تشفير
 */

import { getDocument, setDocument, updateDocument } from '@/firebase/firebase.db';
import { getCurrentUser } from '@/firebase/firebase.auth';
import { getMockMode } from '@/firebase/mockStore';
import { ADMIN_EMAIL } from '@/firebase/constants';

export interface AIKey {
  provider: 'gemini' | 'openai' | 'claude';
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIKeysDocument {
  userId: string;
  keys: AIKey[];
  updatedAt: string;
}

const AI_KEYS_COLLECTION = 'ai_keys';
const MOCK_STORAGE_KEY = 'ntfly_ai_keys_secure';

// تشفير بسيط للمفاتيح
function encryptKey(key: string): string {
  return btoa(key.split('').reverse().join(''));
}

function decryptKey(encrypted: string): string {
  try {
    return atob(encrypted).split('').reverse().join('');
  } catch {
    return encrypted;
  }
}

/**
 * التحقق من صلاحية الأدمن
 */
export async function isAdmin(): Promise<boolean> {
  const user = getCurrentUser();
  if (!user) return false;
  return user.email === ADMIN_EMAIL || user.role === 'admin';
}

/**
 * جلب مفاتيح AI للأدمن
 */
export async function getAIKeys(): Promise<AIKey[]> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('غير مصرح لك بالوصول إلى مفاتيح AI');
  }

  if (getMockMode()) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as AIKeysDocument;
        return data.keys.map(k => ({
          ...k,
          key: decryptKey(k.key)
        }));
      } catch {
        return [];
      }
    }
    return [];
  }

  try {
    const doc = await getDocument<AIKeysDocument>(AI_KEYS_COLLECTION, 'admin_keys');
    if (doc && doc.keys) {
      return doc.keys.map(k => ({
        ...k,
        key: decryptKey(k.key)
      }));
    }
    return [];
  } catch (error) {
    console.error('خطأ في جلب مفاتيح AI:', error);
    return [];
  }
}

/**
 * حفظ مفتاح AI
 */
export async function saveAIKey(provider: AIKey['provider'], key: string): Promise<boolean> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('غير مصرح لك بحفظ مفاتيح AI');
  }

  const now = new Date().toISOString();
  const encryptedKey = encryptKey(key);

  if (getMockMode()) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    let data: AIKeysDocument = {
      userId: 'admin',
      keys: [],
      updatedAt: now
    };

    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch {
        // استخدم القيمة الافتراضية
      }
    }

    const existingIndex = data.keys.findIndex(k => k.provider === provider);
    if (existingIndex >= 0) {
      data.keys[existingIndex] = {
        provider,
        key: encryptedKey,
        createdAt: data.keys[existingIndex].createdAt,
        updatedAt: now
      };
    } else {
      data.keys.push({
        provider,
        key: encryptedKey,
        createdAt: now,
        updatedAt: now
      });
    }

    data.updatedAt = now;
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
    return true;
  }

  try {
    const existingDoc = await getDocument<AIKeysDocument>(AI_KEYS_COLLECTION, 'admin_keys');
    let keys: AIKey[] = existingDoc?.keys || [];

    const existingIndex = keys.findIndex(k => k.provider === provider);
    if (existingIndex >= 0) {
      keys[existingIndex] = {
        provider,
        key: encryptedKey,
        createdAt: keys[existingIndex].createdAt,
        updatedAt: now
      };
    } else {
      keys.push({
        provider,
        key: encryptedKey,
        createdAt: now,
        updatedAt: now
      });
    }

    if (existingDoc) {
      await updateDocument(AI_KEYS_COLLECTION, 'admin_keys', {
        keys,
        updatedAt: now
      });
    } else {
      await setDocument(AI_KEYS_COLLECTION, 'admin_keys', {
        userId: 'admin',
        keys,
        updatedAt: now
      });
    }

    return true;
  } catch (error) {
    console.error('خطأ في حفظ مفتاح AI:', error);
    return false;
  }
}

/**
 * حذف مفتاح AI
 */
export async function deleteAIKey(provider: AIKey['provider']): Promise<boolean> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('غير مصرح لك بحذف مفاتيح AI');
  }

  if (getMockMode()) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      try {
        const data: AIKeysDocument = JSON.parse(stored);
        data.keys = data.keys.filter(k => k.provider !== provider);
        data.updatedAt = new Date().toISOString();
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  try {
    const existingDoc = await getDocument<AIKeysDocument>(AI_KEYS_COLLECTION, 'admin_keys');
    if (existingDoc && existingDoc.keys) {
      const keys = existingDoc.keys.filter(k => k.provider !== provider);
      await updateDocument(AI_KEYS_COLLECTION, 'admin_keys', {
        keys,
        updatedAt: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('خطأ في حذف مفتاح AI:', error);
    return false;
  }
}

/**
 * جلب مفتاح محدد للاستخدام الداخلي (لا يُظهر للمستخدم)
 */
export async function getAIKeyForProvider(provider: AIKey['provider']): Promise<string | null> {
  if (getMockMode()) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      try {
        const data: AIKeysDocument = JSON.parse(stored);
        const keyDoc = data.keys.find(k => k.provider === provider);
        if (keyDoc) {
          return decryptKey(keyDoc.key);
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  try {
    const doc = await getDocument<AIKeysDocument>(AI_KEYS_COLLECTION, 'admin_keys');
    if (doc && doc.keys) {
      const keyDoc = doc.keys.find(k => k.provider === provider);
      if (keyDoc) {
        return decryptKey(keyDoc.key);
      }
    }
    return null;
  } catch {
    return null;
  }
}
