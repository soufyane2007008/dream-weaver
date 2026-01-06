/**
 * ملف تجميع القوالب - يصدر جميع القوالب المتاحة
 * يمكن استيراد أي قالب من هنا
 */

export * from './landing';
export * from './business';
export * from './portfolio';
export * from './store';

import { landingTemplateMeta, generateLandingTemplate } from './landing';
import { businessTemplateMeta, generateBusinessTemplate } from './business';
import { portfolioTemplateMeta, generatePortfolioTemplate } from './portfolio';
import { storeTemplateMeta, generateStoreTemplate } from './store';
import type { TemplateOptions } from './landing';

export type TemplateId = 'landing' | 'business' | 'portfolio' | 'store';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  nameEn: string;
  description: string;
  thumbnail: string;
}

// قائمة جميع القوالب
export const allTemplates: TemplateMeta[] = [
  landingTemplateMeta as TemplateMeta,
  businessTemplateMeta as TemplateMeta,
  portfolioTemplateMeta as TemplateMeta,
  storeTemplateMeta as TemplateMeta,
];

// دالة توليد القالب حسب النوع
export function generateTemplateById(
  templateId: TemplateId,
  options: TemplateOptions
): Record<string, string> {
  switch (templateId) {
    case 'landing':
      return generateLandingTemplate(options);
    case 'business':
      return generateBusinessTemplate(options);
    case 'portfolio':
      return generatePortfolioTemplate(options);
    case 'store':
      return generateStoreTemplate(options);
    default:
      return generateLandingTemplate(options);
  }
}
