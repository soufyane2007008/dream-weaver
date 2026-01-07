/**
 * مولّد المشاريع - ينشئ المشاريع ويديرها
 * يتكامل مع الحصص والقوالب والوظائف
 */

import { v4 as uuidv4 } from 'uuid';
import { createDocument, updateDocument, listenToDocument } from '@/firebase/firebase.db';
import { allowCreate } from '@/services/quotaService';
import { generateTemplateById, type TemplateId } from './templates';
import { exportProject, downloadBlob, type ExportProgress } from './exporter';
import type { Project, ProjectStatus } from '@/types/global.d';

export interface CreateProjectPayload {
  name: string;
  description?: string;
  templateId: TemplateId;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  options?: Record<string, unknown>;
}

export interface ProjectProgress {
  status: ProjectStatus;
  progress: number;
  message: string;
  step: 'validating' | 'creating' | 'generating' | 'exporting' | 'complete' | 'failed';
}

export interface CreateProjectResult {
  success: boolean;
  projectId?: string;
  error?: string;
}

/**
 * التحقق من إمكانية الإنشاء وإنشاء المشروع
 */
export async function createProjectRequest(
  userId: string,
  payload: CreateProjectPayload,
  onProgress?: (progress: ProjectProgress) => void
): Promise<CreateProjectResult> {
  const projectId = uuidv4();
  
  try {
    // 1. التحقق من الحصة
    onProgress?.({ 
      status: 'pending', 
      progress: 5, 
      message: 'جارٍ التحقق من الحصة...', 
      step: 'validating' 
    });
    
    const quotaCheck = await allowCreate(userId);
    
    if (!quotaCheck.allowed) {
      onProgress?.({ 
        status: 'failed', 
        progress: 0, 
        message: quotaCheck.reason || 'تجاوزت الحد المسموح', 
        step: 'failed' 
      });
      
      return { 
        success: false, 
        error: quotaCheck.reason || 'تجاوزت الحد المسموح للمشاريع' 
      };
    }
    
    // 2. إنشاء مستند المشروع
    onProgress?.({ 
      status: 'pending', 
      progress: 15, 
      message: 'جارٍ إنشاء المشروع...', 
      step: 'creating' 
    });
    
    const projectData: Omit<Project, 'id'> = {
      name: payload.name,
      description: payload.description || '',
      ownerId: userId,
      status: 'pending',
      template: payload.templateId,
      files: [],
      logs: [],
      zipUrl: null,
      generatedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      colors: payload.colors,
      options: payload.options,
    };
    
    await createDocument('projects', projectData, projectId);
    
    // 3. توليد الملفات
    onProgress?.({ 
      status: 'generating', 
      progress: 30, 
      message: 'جارٍ توليد الموقع...', 
      step: 'generating' 
    });
    
    await updateDocument('projects', projectId, { status: 'generating' as const });
    
    const files = generateTemplateById(payload.templateId, {
      title: payload.name,
      description: payload.description,
      colors: payload.colors,
      rtl: true,
    });
    
    onProgress?.({ 
      status: 'generating', 
      progress: 60, 
      message: 'تم توليد الملفات', 
      step: 'generating' 
    });
    
    // 4. تصدير الـ ZIP
    onProgress?.({ 
      status: 'generating', 
      progress: 70, 
      message: 'جارٍ إنشاء ملف ZIP...', 
      step: 'exporting' 
    });
    
    const exportResult = await exportProject(projectId, files, {
      uploadToCloud: true,
      onProgress: (exp: ExportProgress) => {
        const overallProgress = 70 + Math.round(exp.progress * 0.25);
        onProgress?.({ 
          status: 'generating', 
          progress: overallProgress, 
          message: exp.message, 
          step: 'exporting' 
        });
      },
    });
    
    if (!exportResult.success) {
      throw new Error(exportResult.error || 'فشل التصدير');
    }
    
    // 5. تحديث المشروع بالنتائج
    await updateDocument('projects', projectId, {
      status: 'completed' as const,
      zipUrl: exportResult.storageUrl || exportResult.downloadUrl,
      files: Object.keys(files),
      filesContent: files,
      generatedAt: Date.now(),
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    onProgress?.({ 
      status: 'completed', 
      progress: 100, 
      message: 'تم إنشاء المشروع بنجاح!', 
      step: 'complete' 
    });
    
    return { success: true, projectId };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    // تحديث حالة الفشل
    try {
      await updateDocument('projects', projectId, {
        status: 'failed',
        error: errorMessage,
        updatedAt: Date.now(),
      });
    } catch {
      // تجاهل
    }
    
    // تسجيل الخطأ
    try {
      await createDocument('errors', {
        projectId,
        step: 'generation',
        message: errorMessage,
        timestamp: Date.now(),
      });
    } catch {
      // تجاهل
    }
    
    onProgress?.({ 
      status: 'failed', 
      progress: 0, 
      message: errorMessage, 
      step: 'failed' 
    });
    
    return { success: false, error: errorMessage };
  }
}

/**
 * الاستماع لتغييرات المشروع (realtime)
 */
export function listenToProject(
  projectId: string,
  callback: (project: Project | null) => void
): () => void {
  return listenToDocument<Project>('projects', projectId, callback);
}

/**
 * تحميل مشروع كـ ZIP
 */
export async function downloadProjectZip(
  project: Project,
  onProgress?: (progress: ExportProgress) => void
): Promise<boolean> {
  const files = project.filesContent as Record<string, string>;
  
  if (!files || Object.keys(files).length === 0) {
    return false;
  }
  
  const { createZipFromFiles } = await import('./exporter');
  const blob = await createZipFromFiles(files, onProgress);
  const fileName = `${project.name.replace(/\s+/g, '-')}-${project.id.slice(0, 8)}.zip`;
  downloadBlob(blob, fileName);
  
  return true;
}
