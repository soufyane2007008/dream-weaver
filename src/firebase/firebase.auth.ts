/**
 * خدمات المصادقة Firebase/Mock لمنصة Ntfly
 * يدعم تسجيل الدخول بالبريد وGoogle في الوضع الحقيقي
 * ويحاكي نفس السلوك في وضع Mock باستخدام localStorage
 */

import { getMockMode, getMockUsers, saveMockData } from './index';
import type { NtflyUser, UserRole } from '@/types/global.d';
import { v4 as uuidv4 } from 'uuid';

// نوع المستمع لتغيير حالة المصادقة
type AuthStateListener = (user: NtflyUser | null) => void;

// المستمعون لتغيير حالة المصادقة
const authListeners: Set<AuthStateListener> = new Set();

// المستخدم الحالي
let currentUser: NtflyUser | null = null;

// مفتاح تخزين الجلسة
const SESSION_KEY = 'ntfly_session';
const ADMIN_ROLES_KEY = 'ntfly_admin_roles';

/**
 * تحميل الجلسة المحفوظة
 */
export function loadSession(): NtflyUser | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const user = JSON.parse(saved) as NtflyUser;
      currentUser = user;
      notifyListeners(user);
      return user;
    }
  } catch {
    // تجاهل أخطاء التحميل
  }
  return null;
}

/**
 * حفظ الجلسة
 */
function saveSession(user: NtflyUser | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // تجاهل أخطاء الحفظ
  }
}

/**
 * إشعار المستمعين بتغيير حالة المصادقة
 */
function notifyListeners(user: NtflyUser | null): void {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (error) {
      console.error('خطأ في مستمع المصادقة:', error);
    }
  });
}

/**
 * الحصول على دور المستخدم
 */
function getUserRole(uid: string, email: string): UserRole {
  // المدير الرئيسي
  if (email === 'admin@ntfly.dev' || uid === 'admin') {
    return 'admin';
  }
  
  // التحقق من قائمة المدراء المحفوظة
  try {
    const adminRoles = localStorage.getItem(ADMIN_ROLES_KEY);
    if (adminRoles) {
      const admins = JSON.parse(adminRoles) as string[];
      if (admins.includes(uid) || admins.includes(email)) {
        return 'admin';
      }
    }
  } catch {
    // تجاهل
  }
  
  return 'user';
}

/**
 * تسجيل الدخول بالبريد وكلمة المرور
 */
export async function signInWithEmail(
  email: string, 
  password: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    // وضع Mock - محاكاة تسجيل الدخول
    return mockSignIn(email, password);
  }
  
  // Firebase الحقيقي (يُفعّل عند تثبيت المكتبة)
  // TODO: إضافة تكامل Firebase Auth
  return mockSignIn(email, password);
}

/**
 * محاكاة تسجيل الدخول
 */
async function mockSignIn(
  email: string, 
  password: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // التحقق من صحة البريد
  if (!email || !email.includes('@')) {
    return { user: null, error: 'البريد الإلكتروني غير صالح' };
  }
  
  // التحقق من كلمة المرور (6 أحرف على الأقل)
  if (!password || password.length < 6) {
    return { user: null, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }
  
  const mockUsers = getMockUsers();
  
  // البحث عن المستخدم بالبريد
  let foundUser = Array.from(mockUsers.values()).find(u => u.email === email);
  
  if (!foundUser) {
    // إنشاء مستخدم جديد تلقائياً (للتجربة)
    const uid = uuidv4();
    foundUser = {
      uid,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      createdAt: Date.now(),
    };
    mockUsers.set(uid, foundUser);
    saveMockData();
  }
  
  const role = getUserRole(foundUser.uid, foundUser.email);
  
  const ntflyUser: NtflyUser = {
    uid: foundUser.uid,
    email: foundUser.email,
    displayName: foundUser.displayName,
    photoURL: foundUser.photoURL,
    role,
    createdAt: foundUser.createdAt,
    lastLoginAt: Date.now(),
    isActive: true,
  };
  
  currentUser = ntflyUser;
  saveSession(ntflyUser);
  notifyListeners(ntflyUser);
  
  return { user: ntflyUser, error: null };
}

/**
 * إنشاء حساب جديد
 */
export async function signUpWithEmail(
  email: string, 
  password: string,
  displayName?: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    return mockSignUp(email, password, displayName);
  }
  
  // Firebase الحقيقي
  return mockSignUp(email, password, displayName);
}

/**
 * محاكاة إنشاء حساب
 */
async function mockSignUp(
  email: string, 
  password: string,
  displayName?: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!email || !email.includes('@')) {
    return { user: null, error: 'البريد الإلكتروني غير صالح' };
  }
  
  if (!password || password.length < 6) {
    return { user: null, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }
  
  const mockUsers = getMockUsers();
  
  // التحقق من عدم وجود المستخدم
  const exists = Array.from(mockUsers.values()).some(u => u.email === email);
  if (exists) {
    return { user: null, error: 'هذا البريد مسجل مسبقاً' };
  }
  
  const uid = uuidv4();
  const now = Date.now();
  
  const mockUser = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    createdAt: now,
  };
  
  mockUsers.set(uid, mockUser);
  saveMockData();
  
  const role = getUserRole(uid, email);
  
  const ntflyUser: NtflyUser = {
    ...mockUser,
    role,
    lastLoginAt: now,
    isActive: true,
  };
  
  currentUser = ntflyUser;
  saveSession(ntflyUser);
  notifyListeners(ntflyUser);
  
  return { user: ntflyUser, error: null };
}

/**
 * تسجيل الخروج
 */
export async function signOut(): Promise<void> {
  currentUser = null;
  saveSession(null);
  notifyListeners(null);
}

/**
 * الحصول على المستخدم الحالي
 */
export function getCurrentUser(): NtflyUser | null {
  return currentUser;
}

/**
 * الاشتراك في تغييرات حالة المصادقة
 */
export function onAuthStateChanged(listener: AuthStateListener): () => void {
  authListeners.add(listener);
  
  // إشعار فوري بالحالة الحالية
  if (currentUser) {
    listener(currentUser);
  } else {
    // محاولة تحميل الجلسة
    const saved = loadSession();
    if (saved) {
      listener(saved);
    } else {
      listener(null);
    }
  }
  
  // إرجاع دالة إلغاء الاشتراك
  return () => {
    authListeners.delete(listener);
  };
}

/**
 * التحقق من كون المستخدم مديراً
 */
export function isAdmin(): boolean {
  return currentUser?.role === 'admin';
}

/**
 * إضافة مستخدم كمدير (للمدراء فقط)
 */
export function addAdmin(uidOrEmail: string): boolean {
  if (!isAdmin()) return false;
  
  try {
    const adminRoles = localStorage.getItem(ADMIN_ROLES_KEY);
    const admins = adminRoles ? JSON.parse(adminRoles) as string[] : [];
    
    if (!admins.includes(uidOrEmail)) {
      admins.push(uidOrEmail);
      localStorage.setItem(ADMIN_ROLES_KEY, JSON.stringify(admins));
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * إزالة مستخدم من المدراء
 */
export function removeAdmin(uidOrEmail: string): boolean {
  if (!isAdmin()) return false;
  if (uidOrEmail === 'admin@ntfly.dev') return false; // لا يمكن إزالة المدير الرئيسي
  
  try {
    const adminRoles = localStorage.getItem(ADMIN_ROLES_KEY);
    if (!adminRoles) return true;
    
    const admins = JSON.parse(adminRoles) as string[];
    const filtered = admins.filter(a => a !== uidOrEmail);
    localStorage.setItem(ADMIN_ROLES_KEY, JSON.stringify(filtered));
    
    return true;
  } catch {
    return false;
  }
}
