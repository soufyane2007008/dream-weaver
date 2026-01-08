/**
 * خدمات التخزين
 */

import { getMockMode, getMockStorage, saveMockData } from './mockStore';
import { v4 as uuidv4 } from 'uuid';

const CHUNK_SIZE = 1024 * 1024;

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: 'running' | 'paused' | 'success' | 'error' | 'cancelled';
}

export interface UploadResult {
  success: boolean;
  url: string | null;
  path: string;
  error: string | null;
}

export type ProgressCallback = (progress: UploadProgress) => void;

export async function uploadFile(
  path: string,
  file: File | Blob,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const filePath = path || `files/${uuidv4()}`;
  return mockUpload(filePath, file, onProgress);
}

async function mockUpload(
  path: string,
  file: File | Blob,
  onProgress?: ProgressCallback
): Promise<UploadResult> {
  const totalBytes = file.size;
  let bytesTransferred = 0;
  
  const chunks = Math.ceil(totalBytes / CHUNK_SIZE);
  
  for (let i = 0; i < chunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    bytesTransferred = Math.min((i + 1) * CHUNK_SIZE, totalBytes);
    
    onProgress?.({
      bytesTransferred,
      totalBytes,
      percentage: Math.round((bytesTransferred / totalBytes) * 100),
      state: 'running',
    });
  }
  
  const storage = getMockStorage();
  storage.set(path, file);
  
  const url = URL.createObjectURL(file);
  
  try {
    const fileIndex = JSON.parse(localStorage.getItem('ntfly_file_index') || '{}');
    fileIndex[path] = {
      name: file instanceof File ? file.name : 'blob',
      size: file.size,
      type: file.type,
      uploadedAt: Date.now(),
    };
    localStorage.setItem('ntfly_file_index', JSON.stringify(fileIndex));
  } catch { /* ignore */ }
  
  onProgress?.({
    bytesTransferred: totalBytes,
    totalBytes,
    percentage: 100,
    state: 'success',
  });
  
  return { success: true, url, path, error: null };
}

export async function downloadFile(path: string): Promise<Blob | null> {
  const storage = getMockStorage();
  return storage.get(path) || null;
}

export async function getFileUrl(path: string): Promise<string | null> {
  const storage = getMockStorage();
  const blob = storage.get(path);
  return blob ? URL.createObjectURL(blob) : null;
}

export async function deleteFile(path: string): Promise<boolean> {
  const storage = getMockStorage();
  const deleted = storage.delete(path);
  
  try {
    const fileIndex = JSON.parse(localStorage.getItem('ntfly_file_index') || '{}');
    delete fileIndex[path];
    localStorage.setItem('ntfly_file_index', JSON.stringify(fileIndex));
  } catch { /* ignore */ }
  
  return deleted;
}

export async function listFiles(prefix: string = ''): Promise<Array<{
  path: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
}>> {
  try {
    const fileIndex = JSON.parse(localStorage.getItem('ntfly_file_index') || '{}');
    
    return Object.entries(fileIndex)
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, info]) => ({
        path,
        ...(info as { name: string; size: number; type: string; uploadedAt: number }),
      }));
  } catch {
    return [];
  }
}

export function createFileFromText(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

export function createHtmlFile(content: string, filename: string = 'index.html'): File {
  return createFileFromText(content, filename, 'text/html');
}

export function createCssFile(content: string, filename: string = 'styles.css'): File {
  return createFileFromText(content, filename, 'text/css');
}

export function createJsFile(content: string, filename: string = 'script.js'): File {
  return createFileFromText(content, filename, 'application/javascript');
}

export async function getStorageUsage(): Promise<{ used: number; files: number }> {
  try {
    const fileIndex = JSON.parse(localStorage.getItem('ntfly_file_index') || '{}');
    const files = Object.keys(fileIndex).length;
    const used = Object.values(fileIndex).reduce<number>(
      (total, info) => total + ((info as { size: number }).size || 0),
      0
    );
    return { used, files };
  } catch {
    return { used: 0, files: 0 };
  }
}

export async function cleanupOldFiles(daysOld: number = 30): Promise<number> {
  const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  let deletedCount = 0;
  
  try {
    const fileIndex = JSON.parse(localStorage.getItem('ntfly_file_index') || '{}');
    
    for (const [path, info] of Object.entries(fileIndex)) {
      if ((info as { uploadedAt: number }).uploadedAt < cutoffTime) {
        await deleteFile(path);
        deletedCount++;
      }
    }
  } catch { /* ignore */ }
  
  return deletedCount;
}
