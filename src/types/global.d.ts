/**
 * تعريفات TypeScript العامة لمنصة Ntfly
 * تُستخدم في كل أنحاء التطبيق لضمان Type Safety
 */

// أنواع المستخدمين والأدوار
export type UserRole = 'admin' | 'user';

export interface NtflyUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: number;
  lastLoginAt?: number;
  isActive?: boolean;
  provider?: string;
}

// أنواع المشاريع
export type ProjectStatus = 
  | 'pending' 
  | 'processing'
  | 'generating' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export type ProjectTemplate = 
  | 'landing' 
  | 'business' 
  | 'portfolio' 
  | 'store';

export interface ProjectColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  size: number;
  type: 'html' | 'css' | 'js' | 'json' | 'image' | 'other';
}

export interface ProjectLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  template: ProjectTemplate;
  status: ProjectStatus;
  files: ProjectFile[] | string[];
  filesContent?: Record<string, string>;
  logs: ProjectLog[];
  zipUrl: string | null;
  previewUrl?: string | null;
  colors?: ProjectColors;
  options?: Record<string, unknown>;
  error?: string;
  createdAt: number;
  updatedAt: number;
  generatedAt: number | null;
  completedAt?: number | null;
  exportedAt?: number | null;
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customPrompt?: string;
}

// أنواع AI
export type AIProvider = 'chatgpt' | 'gemini' | 'claude' | 'sonnet' | 'local';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
}

export interface AIRequest {
  prompt: string;
  template: ProjectTemplate;
  settings: ProjectSettings;
  context?: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  files: ProjectFile[];
  tokensUsed: number;
  provider: AIProvider;
  duration: number;
  error?: string;
}

// أنواع الطلبات
export type OrderStatus = 
  | 'draft' 
  | 'submitted' 
  | 'processing' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export interface Order {
  id: string;
  userId: string;
  projectId: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  rating: number | null;
  feedback: string | null;
  createdAt: number;
  completedAt: number | null;
}

// أنواع الوظائف (Jobs)
export type JobType = 'generate' | 'export' | 'backup' | 'cleanup';
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error: string | null;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
}

// أنواع الإحصائيات
export interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalOrders: number;
  totalRevenue: number;
  activeJobs: number;
  aiCallsToday: number;
  lastUpdated: number;
}

// أنواع سجلات الدخول
export interface LoginLog {
  id: string;
  uid: string;
  email: string;
  provider: 'email' | 'google' | 'mock';
  timestamp: number;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
}

// أنواع المفاتيح المشفرة
export interface SecureKey {
  id: string;
  provider: AIProvider;
  encryptedKey: string;
  salt: string;
  iv: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

// أنواع Feature Flags
export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  updatedAt: number;
  updatedBy: string;
}

// أنواع التنبيهات
export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  expiresAt: number | null;
}

// أنواع Webhooks
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  createdAt: number;
  lastTriggeredAt: number | null;
}

// أنواع المقاييس
export interface Metrics {
  aiFailures: number;
  jobsFailed: number;
  exportedZips: number;
  totalApiCalls: number;
  averageResponseTime: number;
  errorRate: number;
}

// أنواع i18n
export type Language = 'ar' | 'en';

export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}

// توسيع Window للـ Mock Mode
declare global {
  interface Window {
    __NTFLY_MOCK_MODE__?: boolean;
    __NTFLY_DEBUG__?: boolean;
  }
}

export {};
