/**
 * خدمات قاعدة البيانات Firebase/Mock لمنصة Ntfly
 * توفر واجهة موحدة للتعامل مع Firestore أو IndexedDB/localStorage
 */

import { getMockMode, getMockCollection, saveMockData } from './index';
import { v4 as uuidv4 } from 'uuid';

// أنواع العمليات
export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains';

export interface QueryCondition {
  field: string;
  operator: QueryOperator;
  value: unknown;
}

export interface QueryOptions {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: unknown;
}

// نوع المستمع
type DocumentListener<T> = (data: T | null) => void;
type CollectionListener<T> = (data: T[]) => void;

// مخزن المستمعين
const documentListeners = new Map<string, Set<DocumentListener<unknown>>>();
const collectionListeners = new Map<string, Set<CollectionListener<unknown>>>();

/**
 * إنشاء مستند جديد
 */
export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
  customId?: string
): Promise<{ id: string; data: T }> {
  const id = customId || uuidv4();
  const timestamp = Date.now();
  
  const docData = {
    ...data,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  } as T;
  
  if (getMockMode()) {
    const collection = getMockCollection(collectionName);
    collection.set(id, docData);
    saveMockData();
    notifyDocumentListeners(collectionName, id, docData);
    notifyCollectionListeners(collectionName);
  } else {
    // Firebase الحقيقي
    // TODO: إضافة تكامل Firestore
    const collection = getMockCollection(collectionName);
    collection.set(id, docData);
    saveMockData();
    notifyDocumentListeners(collectionName, id, docData);
    notifyCollectionListeners(collectionName);
  }
  
  return { id, data: docData };
}

/**
 * قراءة مستند
 */
export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  if (getMockMode()) {
    const collection = getMockCollection(collectionName);
    return (collection.get(documentId) as T) || null;
  }
  
  // Firebase الحقيقي
  const collection = getMockCollection(collectionName);
  return (collection.get(documentId) as T) || null;
}

/**
 * تحديث مستند
 */
export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<boolean> {
  const existing = await getDocument<T>(collectionName, documentId);
  if (!existing) return false;
  
  const updated = {
    ...existing,
    ...data,
    updatedAt: Date.now(),
  };
  
  if (getMockMode()) {
    const collection = getMockCollection(collectionName);
    collection.set(documentId, updated);
    saveMockData();
    notifyDocumentListeners(collectionName, documentId, updated);
    notifyCollectionListeners(collectionName);
  } else {
    const collection = getMockCollection(collectionName);
    collection.set(documentId, updated);
    saveMockData();
    notifyDocumentListeners(collectionName, documentId, updated);
    notifyCollectionListeners(collectionName);
  }
  
  return true;
}

/**
 * حذف مستند
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<boolean> {
  if (getMockMode()) {
    const collection = getMockCollection(collectionName);
    const deleted = collection.delete(documentId);
    saveMockData();
    notifyDocumentListeners(collectionName, documentId, null);
    notifyCollectionListeners(collectionName);
    return deleted;
  }
  
  const collection = getMockCollection(collectionName);
  const deleted = collection.delete(documentId);
  saveMockData();
  notifyDocumentListeners(collectionName, documentId, null);
  notifyCollectionListeners(collectionName);
  return deleted;
}

/**
 * استعلام عن مجموعة
 */
export async function queryCollection<T>(
  collectionName: string,
  conditions: QueryCondition[] = [],
  options: QueryOptions = {}
): Promise<T[]> {
  const collection = getMockCollection(collectionName);
  let results = Array.from(collection.values()) as T[];
  
  // تطبيق الشروط
  for (const condition of conditions) {
    results = results.filter(doc => {
      const value = (doc as Record<string, unknown>)[condition.field];
      
      switch (condition.operator) {
        case '==':
          return value === condition.value;
        case '!=':
          return value !== condition.value;
        case '<':
          return (value as number) < (condition.value as number);
        case '<=':
          return (value as number) <= (condition.value as number);
        case '>':
          return (value as number) > (condition.value as number);
        case '>=':
          return (value as number) >= (condition.value as number);
        case 'array-contains':
          return Array.isArray(value) && value.includes(condition.value);
        default:
          return true;
      }
    });
  }
  
  // الترتيب
  if (options.orderBy) {
    const direction = options.orderDirection === 'desc' ? -1 : 1;
    results.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[options.orderBy!];
      const bVal = (b as Record<string, unknown>)[options.orderBy!];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }
  
  // التحديد
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

/**
 * الاستماع لتغييرات مستند
 */
export function listenToDocument<T>(
  collectionName: string,
  documentId: string,
  listener: DocumentListener<T>
): () => void {
  const key = `${collectionName}/${documentId}`;
  
  if (!documentListeners.has(key)) {
    documentListeners.set(key, new Set());
  }
  
  const listeners = documentListeners.get(key)!;
  listeners.add(listener as DocumentListener<unknown>);
  
  // إرسال القيمة الحالية
  getDocument<T>(collectionName, documentId).then(data => {
    listener(data);
  });
  
  // إرجاع دالة إلغاء الاشتراك
  return () => {
    listeners.delete(listener as DocumentListener<unknown>);
    if (listeners.size === 0) {
      documentListeners.delete(key);
    }
  };
}

/**
 * الاستماع لتغييرات مجموعة
 */
export function listenToCollection<T>(
  collectionName: string,
  listener: CollectionListener<T>,
  conditions: QueryCondition[] = [],
  options: QueryOptions = {}
): () => void {
  const key = collectionName;
  
  if (!collectionListeners.has(key)) {
    collectionListeners.set(key, new Set());
  }
  
  const listeners = collectionListeners.get(key)!;
  
  // إنشاء wrapper listener للتطبيق الفلترة
  const wrapperListener = async () => {
    const data = await queryCollection<T>(collectionName, conditions, options);
    listener(data);
  };
  
  listeners.add(wrapperListener as CollectionListener<unknown>);
  
  // إرسال القيمة الحالية
  wrapperListener();
  
  // إرجاع دالة إلغاء الاشتراك
  return () => {
    listeners.delete(wrapperListener as CollectionListener<unknown>);
    if (listeners.size === 0) {
      collectionListeners.delete(key);
    }
  };
}

/**
 * إشعار مستمعي المستندات
 */
function notifyDocumentListeners(
  collectionName: string,
  documentId: string,
  data: unknown
): void {
  const key = `${collectionName}/${documentId}`;
  const listeners = documentListeners.get(key);
  
  if (listeners) {
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('خطأ في مستمع المستند:', error);
      }
    });
  }
}

/**
 * إشعار مستمعي المجموعات
 */
function notifyCollectionListeners(collectionName: string): void {
  const listeners = collectionListeners.get(collectionName);
  
  if (listeners) {
    listeners.forEach(listener => {
      try {
        (listener as () => void)();
      } catch (error) {
        console.error('خطأ في مستمع المجموعة:', error);
      }
    });
  }
}

/**
 * عمليات مجمعة (Batched Writes)
 */
export interface BatchOperation {
  type: 'create' | 'update' | 'delete';
  collection: string;
  documentId?: string;
  data?: Record<string, unknown>;
}

export async function batchWrite(operations: BatchOperation[]): Promise<boolean> {
  try {
    for (const op of operations) {
      switch (op.type) {
        case 'create':
          await createDocument(op.collection, op.data || {}, op.documentId);
          break;
        case 'update':
          if (op.documentId) {
            await updateDocument(op.collection, op.documentId, op.data || {});
          }
          break;
        case 'delete':
          if (op.documentId) {
            await deleteDocument(op.collection, op.documentId);
          }
          break;
      }
    }
    return true;
  } catch (error) {
    console.error('خطأ في العمليات المجمعة:', error);
    return false;
  }
}

/**
 * الحصول على عدد المستندات في مجموعة
 */
export async function getCollectionCount(
  collectionName: string,
  conditions: QueryCondition[] = []
): Promise<number> {
  const results = await queryCollection(collectionName, conditions);
  return results.length;
}

/**
 * مسح جميع البيانات (للاختبار فقط)
 */
export function clearAllData(): void {
  if (getMockMode()) {
    localStorage.removeItem('ntfly_mock_data');
    console.info('🧹 تم مسح جميع البيانات');
  }
}
