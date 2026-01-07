/**
 * مُصدّر المشاريع - ينشئ ملفات ZIP للتحميل
 * يدعم التصدير المحلي والرفع إلى Firebase Storage
 */

import JSZip from 'jszip';
import { uploadFile as uploadToStorage } from '@/firebase/firebase.storage';
import { updateDocument, createDocument } from '@/firebase/firebase.db';

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  downloadUrl?: string;
  storageUrl?: string;
  error?: string;
}

export interface ExportProgress {
  stage: 'preparing' | 'zipping' | 'uploading' | 'complete' | 'error';
  progress: number;
  message: string;
}

/**
 * إنشاء ملف ZIP من الملفات
 */
export async function createZipFromFiles(
  files: Record<string, string>,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  onProgress?.({ stage: 'preparing', progress: 10, message: 'جارٍ تجهيز الملفات...' });
  
  const zip = new JSZip();
  const fileNames = Object.keys(files);
  
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    zip.file(fileName, files[fileName], { binary: false });
    
    const progress = 10 + Math.round((i / fileNames.length) * 40);
    onProgress?.({ stage: 'zipping', progress, message: `إضافة ${fileName}...` });
  }
  
  onProgress?.({ stage: 'zipping', progress: 60, message: 'جارٍ ضغط الملفات...' });
  
  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  onProgress?.({ stage: 'complete', progress: 100, message: 'تم إنشاء الملف بنجاح!' });
  
  return blob;
}

/**
 * تصدير مشروع كملف ZIP
 */
export async function exportProject(
  projectId: string,
  files: Record<string, string>,
  options?: {
    uploadToCloud?: boolean;
    onProgress?: (progress: ExportProgress) => void;
  }
): Promise<ExportResult> {
  const { uploadToCloud = false, onProgress } = options || {};
  
  try {
    // إنشاء الـ ZIP
    const blob = await createZipFromFiles(files, onProgress);
    
    // إنشاء رابط تحميل محلي
    const downloadUrl = URL.createObjectURL(blob);
    
    let storageUrl: string | undefined;
    
    // رفع للسحابة إذا مطلوب
    if (uploadToCloud) {
      onProgress?.({ stage: 'uploading', progress: 70, message: 'جارٍ الرفع للسحابة...' });
      
      const fileName = `projects/${projectId}/site-${Date.now()}.zip`;
      
      try {
        const uploadResult = await uploadToStorage(fileName, blob, (progress) => {
          const pct = progress.percentage || 0;
          const overallProgress = 70 + Math.round(pct * 0.25);
          onProgress?.({ 
            stage: 'uploading', 
            progress: overallProgress, 
            message: `رفع ${Math.round(pct)}%...` 
          });
        });
        
        if (uploadResult.success && uploadResult.url) {
          storageUrl = uploadResult.url;
          
          // تحديث المشروع بـ URL
          await updateDocument('projects', projectId, {
            zipUrl: storageUrl,
            exportedAt: Date.now(),
          });
        }
      } catch (uploadError) {
        console.warn('فشل الرفع للسحابة:', uploadError);
        // نستمر بدون رفع - التحميل المحلي متاح
      }
    }
    
    onProgress?.({ stage: 'complete', progress: 100, message: 'تم التصدير بنجاح!' });
    
    return {
      success: true,
      blob,
      downloadUrl,
      storageUrl,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    onProgress?.({ stage: 'error', progress: 0, message: errorMessage });
    
    // تسجيل الخطأ
    try {
      await createDocument('errors', {
        projectId,
        step: 'export',
        message: errorMessage,
        timestamp: Date.now(),
      });
    } catch {
      // تجاهل أخطاء التسجيل
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * تحميل ملف ZIP مباشرة
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // تنظيف الـ URL بعد فترة
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * تحميل مشروع مباشرة
 */
export async function downloadProject(
  projectId: string,
  projectName: string,
  files: Record<string, string>,
  onProgress?: (progress: ExportProgress) => void
): Promise<boolean> {
  try {
    const blob = await createZipFromFiles(files, onProgress);
    const fileName = `${projectName.replace(/\s+/g, '-')}-${projectId.slice(0, 8)}.zip`;
    downloadBlob(blob, fileName);
    return true;
  } catch (error) {
    console.error('فشل التحميل:', error);
    return false;
  }
}
