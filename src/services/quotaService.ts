/**
 * خدمة إدارة الحصص - تتحقق من عدد المشاريع المسموح بها للمستخدم
 * تستخدم sliding window للتحقق من الحدود الزمنية
 */

import { queryCollection } from '@/firebase/firebase.db';
import type { Project } from '@/types/global.d';

// الإعدادات الافتراضية
const DEFAULT_QUOTA = {
  maxProjectsPerDay: 5,
  maxProjectsPerMonth: 20,
  maxTotalProjects: 50,
};

export interface QuotaCheck {
  allowed: boolean;
  reason?: string;
  remaining: {
    daily: number;
    monthly: number;
    total: number;
  };
}

/**
 * التحقق من إمكانية إنشاء مشروع جديد
 */
export async function allowCreate(userId: string): Promise<QuotaCheck> {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  // جلب مشاريع المستخدم
  const allProjects = await queryCollection<Project>('projects', [
    { field: 'ownerId', operator: '==', value: userId }
  ]);

  const totalCount = allProjects.length;
  const dailyCount = allProjects.filter(p => p.createdAt > dayAgo).length;
  const monthlyCount = allProjects.filter(p => p.createdAt > monthAgo).length;

  const remaining = {
    daily: Math.max(0, DEFAULT_QUOTA.maxProjectsPerDay - dailyCount),
    monthly: Math.max(0, DEFAULT_QUOTA.maxProjectsPerMonth - monthlyCount),
    total: Math.max(0, DEFAULT_QUOTA.maxTotalProjects - totalCount),
  };

  if (remaining.daily === 0) {
    return {
      allowed: false,
      reason: 'لقد وصلت للحد الأقصى اليومي. حاول مرة أخرى غداً.',
      remaining,
    };
  }

  if (remaining.monthly === 0) {
    return {
      allowed: false,
      reason: 'لقد وصلت للحد الأقصى الشهري. انتظر حتى الشهر القادم.',
      remaining,
    };
  }

  if (remaining.total === 0) {
    return {
      allowed: false,
      reason: 'لقد وصلت للحد الأقصى من المشاريع. قم بحذف بعض المشاريع القديمة.',
      remaining,
    };
  }

  return { allowed: true, remaining };
}
