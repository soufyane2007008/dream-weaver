/**
 * خدمات قاعدة البيانات
 */

import { getMockMode, getMockCollection, saveMockData } from './mockStore';
import { v4 as uuidv4 } from 'uuid';

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

type DocumentListener<T> = (data: T | null) => void;
type CollectionListener<T> = (data: T[]) => void;

const documentListeners = new Map<string, Set<DocumentListener<unknown>>>();
const collectionListeners = new Map<string, Set<CollectionListener<unknown>>>();

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
  
  const collection = getMockCollection(collectionName);
  collection.set(id, docData);
  saveMockData();
  notifyDocumentListeners(collectionName, id, docData);
  notifyCollectionListeners(collectionName);
  
  return { id, data: docData };
}

export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const collection = getMockCollection(collectionName);
  return (collection.get(documentId) as T) || null;
}

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
  
  const collection = getMockCollection(collectionName);
  collection.set(documentId, updated);
  saveMockData();
  notifyDocumentListeners(collectionName, documentId, updated);
  notifyCollectionListeners(collectionName);
  
  return true;
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<boolean> {
  const collection = getMockCollection(collectionName);
  const deleted = collection.delete(documentId);
  saveMockData();
  notifyDocumentListeners(collectionName, documentId, null);
  notifyCollectionListeners(collectionName);
  return deleted;
}

export async function queryCollection<T>(
  collectionName: string,
  conditions: QueryCondition[] = [],
  options: QueryOptions = {}
): Promise<T[]> {
  const collection = getMockCollection(collectionName);
  let results = Array.from(collection.values()) as T[];
  
  for (const condition of conditions) {
    results = results.filter(doc => {
      const value = (doc as Record<string, unknown>)[condition.field];
      
      switch (condition.operator) {
        case '==': return value === condition.value;
        case '!=': return value !== condition.value;
        case '<': return (value as number) < (condition.value as number);
        case '<=': return (value as number) <= (condition.value as number);
        case '>': return (value as number) > (condition.value as number);
        case '>=': return (value as number) >= (condition.value as number);
        case 'array-contains': return Array.isArray(value) && value.includes(condition.value);
        default: return true;
      }
    });
  }
  
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
  
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

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
  
  getDocument<T>(collectionName, documentId).then(data => {
    listener(data);
  });
  
  return () => {
    listeners.delete(listener as DocumentListener<unknown>);
    if (listeners.size === 0) {
      documentListeners.delete(key);
    }
  };
}

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
  
  const wrapperListener = async () => {
    const data = await queryCollection<T>(collectionName, conditions, options);
    listener(data);
  };
  
  listeners.add(wrapperListener as CollectionListener<unknown>);
  wrapperListener();
  
  return () => {
    listeners.delete(wrapperListener as CollectionListener<unknown>);
    if (listeners.size === 0) {
      collectionListeners.delete(key);
    }
  };
}

function notifyDocumentListeners(
  collectionName: string,
  documentId: string,
  data: unknown
): void {
  const key = `${collectionName}/${documentId}`;
  const listeners = documentListeners.get(key);
  
  if (listeners) {
    listeners.forEach(listener => {
      try { listener(data); } catch { /* ignore */ }
    });
  }
}

function notifyCollectionListeners(collectionName: string): void {
  const listeners = collectionListeners.get(collectionName);
  
  if (listeners) {
    listeners.forEach(listener => {
      try { (listener as () => void)(); } catch { /* ignore */ }
    });
  }
}

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
  } catch {
    return false;
  }
}

export async function getCollectionCount(
  collectionName: string,
  conditions: QueryCondition[] = []
): Promise<number> {
  const results = await queryCollection(collectionName, conditions);
  return results.length;
}

export function clearAllData(): void {
  if (getMockMode()) {
    localStorage.removeItem('ntfly_mock_data');
  }
}
