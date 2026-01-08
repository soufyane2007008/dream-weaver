/**
 * خدمات المصادقة لمنصة Ntfly
 * يدعم Firebase Auth الحقيقي + وضع Mock للتطوير
 * يدعم Email/Password + Google + GitHub
 */

import { getMockMode, getMockUsers, saveMockData, ADMIN_EMAIL } from './index';
import { createDocument, getDocument, updateDocument } from './firebase.db';
import { v4 as uuidv4 } from 'uuid';
import type { NtflyUser } from '@/types/global.d';

// نوع callback للاستماع لتغييرات المصادقة
type AuthStateListener = (user: NtflyUser | null) => void;

// مستمعين لتغييرات حالة المصادقة
const authListeners = new Set<AuthStateListener>();

// المستخدم الحالي
let currentUser: NtflyUser | null = null;

// مفتاح الجلسة
const SESSION_KEY = 'ntfly_session';

/**
 * تحميل جلسة محفوظة
 */
function loadSession(): NtflyUser | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // تجاهل
  }
  return null;
}

/**
 * حفظ الجلسة
 */
function saveSession(user: NtflyUser | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * إشعار المستمعين بتغيير الحالة
 */
function notifyListeners(user: NtflyUser | null): void {
  authListeners.forEach(listener => listener(user));
}

/**
 * تحديد دور المستخدم
 */
function getUserRole(uid: string, email: string): 'admin' | 'user' {
  // البريد الإلكتروني الثابت للأدمن
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }
  
  // التحقق من قائمة الأدمن في localStorage (للمستخدمين المضافين)
  try {
    const adminList = localStorage.getItem('ntfly_admin_list');
    if (adminList) {
      const admins = JSON.parse(adminList) as string[];
      if (admins.includes(email.toLowerCase()) || admins.includes(uid)) {
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
    return mockSignIn(email, password);
  }
  
  try {
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    const auth = getAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    const role = getUserRole(result.user.uid, result.user.email || '');
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role,
      createdAt: Date.now(),
      provider: 'password',
    };
    
    // حفظ/تحديث المستخدم في Firestore
    await saveUserToFirestore(user);
    
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    
    // تسجيل الدخول
    await logLogin(user);
    
    return { user, error: null };
    
  } catch (error) {
    const message = getAuthErrorMessage(error);
    return { user: null, error: message };
  }
}

/**
 * Mock تسجيل الدخول
 */
async function mockSignIn(
  email: string,
  password: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  // التحقق من وجود المستخدم
  const mockUsers = getMockUsers();
  let existingUser: NtflyUser | null = null;
  
  mockUsers.forEach((u) => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      existingUser = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        role: getUserRole(u.uid, u.email),
        createdAt: u.createdAt,
        provider: 'password',
      };
    }
  });
  
  // إذا لم يوجد المستخدم، إنشاء حساب جديد
  if (!existingUser) {
    const uid = uuidv4();
    const role = getUserRole(uid, email);
    
    existingUser = {
      uid,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      role,
      createdAt: Date.now(),
      provider: 'password',
    };
    
    mockUsers.set(uid, {
      uid,
      email,
      displayName: existingUser.displayName,
      photoURL: null,
      createdAt: Date.now(),
      role,
    });
    
    saveMockData();
  }
  
  currentUser = existingUser;
  saveSession(existingUser);
  notifyListeners(existingUser);
  
  // تسجيل الدخول
  await logLogin(existingUser);
  
  return { user: existingUser, error: null };
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
  
  try {
    const { getAuth, createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const auth = getAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    const role = getUserRole(result.user.uid, email);
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: displayName || result.user.displayName,
      photoURL: result.user.photoURL,
      role,
      createdAt: Date.now(),
      provider: 'password',
    };
    
    // حفظ المستخدم في Firestore
    await saveUserToFirestore(user);
    
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    
    return { user, error: null };
    
  } catch (error) {
    const message = getAuthErrorMessage(error);
    return { user: null, error: message };
  }
}

/**
 * Mock إنشاء حساب
 */
async function mockSignUp(
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  // التحقق من عدم وجود المستخدم مسبقاً
  const mockUsers = getMockUsers();
  let exists = false;
  
  mockUsers.forEach((u) => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      exists = true;
    }
  });
  
  if (exists) {
    return { user: null, error: 'البريد الإلكتروني مستخدم بالفعل' };
  }
  
  const uid = uuidv4();
  const role = getUserRole(uid, email);
  
  const user: NtflyUser = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    role,
    createdAt: Date.now(),
    provider: 'password',
  };
  
  mockUsers.set(uid, {
    uid,
    email,
    displayName: user.displayName,
    photoURL: null,
    createdAt: Date.now(),
    role,
  });
  
  saveMockData();
  
  currentUser = user;
  saveSession(user);
  notifyListeners(user);
  
  return { user, error: null };
}

/**
 * تسجيل الدخول بـ Google
 */
export async function signInWithGoogle(): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    return mockOAuthSignIn('google');
  }
  
  try {
    const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const role = getUserRole(result.user.uid, result.user.email || '');
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role,
      createdAt: Date.now(),
      provider: 'google',
    };
    
    await saveUserToFirestore(user);
    
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    
    await logLogin(user);
    
    return { user, error: null };
    
  } catch (error) {
    const message = getAuthErrorMessage(error);
    return { user: null, error: message };
  }
}

/**
 * تسجيل الدخول بـ GitHub
 */
export async function signInWithGitHub(): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    return mockOAuthSignIn('github');
  }
  
  try {
    const { getAuth, signInWithPopup, GithubAuthProvider } = await import('firebase/auth');
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const role = getUserRole(result.user.uid, result.user.email || '');
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role,
      createdAt: Date.now(),
      provider: 'github',
    };
    
    await saveUserToFirestore(user);
    
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    
    await logLogin(user);
    
    return { user, error: null };
    
  } catch (error) {
    const message = getAuthErrorMessage(error);
    return { user: null, error: message };
  }
}

/**
 * Mock OAuth تسجيل الدخول
 */
async function mockOAuthSignIn(
  provider: 'google' | 'github'
): Promise<{ user: NtflyUser | null; error: string | null }> {
  // إنشاء مستخدم وهمي للاختبار
  const uid = uuidv4();
  const email = `demo-${provider}@ntfly.dev`;
  const role = getUserRole(uid, email);
  
  const user: NtflyUser = {
    uid,
    email,
    displayName: `مستخدم ${provider === 'google' ? 'Google' : 'GitHub'}`,
    photoURL: null,
    role,
    createdAt: Date.now(),
    provider,
  };
  
  const mockUsers = getMockUsers();
  mockUsers.set(uid, {
    uid,
    email,
    displayName: user.displayName,
    photoURL: null,
    createdAt: Date.now(),
    role,
  });
  
  saveMockData();
  
  currentUser = user;
  saveSession(user);
  notifyListeners(user);
  
  await logLogin(user);
  
  return { user, error: null };
}

/**
 * تسجيل الخروج
 */
export async function signOut(): Promise<void> {
  if (!getMockMode()) {
    try {
      const { getAuth, signOut: firebaseSignOut } = await import('firebase/auth');
      const auth = getAuth();
      await firebaseSignOut(auth);
    } catch {
      // تجاهل أخطاء تسجيل الخروج من Firebase
    }
  }
  
  currentUser = null;
  saveSession(null);
  notifyListeners(null);
}

/**
 * الحصول على المستخدم الحالي
 */
export function getCurrentUser(): NtflyUser | null {
  if (!currentUser) {
    currentUser = loadSession();
  }
  return currentUser;
}

/**
 * الاستماع لتغييرات حالة المصادقة
 */
export function onAuthStateChanged(listener: AuthStateListener): () => void {
  authListeners.add(listener);
  
  // استدعاء فوري بالحالة الحالية
  const user = getCurrentUser();
  listener(user);
  
  // دالة إلغاء الاستماع
  return () => {
    authListeners.delete(listener);
  };
}

/**
 * التحقق من كون المستخدم أدمن
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * حفظ المستخدم في Firestore
 */
async function saveUserToFirestore(user: NtflyUser): Promise<void> {
  try {
    const existing = await getDocument<NtflyUser>('users', user.uid);
    
    if (existing) {
      await updateDocument('users', user.uid, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLoginAt: Date.now(),
      });
    } else {
      await createDocument('users', user, user.uid);
    }
  } catch (error) {
    console.warn('فشل حفظ المستخدم:', error);
  }
}

/**
 * تسجيل عملية الدخول
 */
async function logLogin(user: NtflyUser): Promise<void> {
  try {
    await createDocument('login_logs', {
      uid: user.uid,
      email: user.email,
      provider: user.provider,
      timestamp: Date.now(),
      isAdmin: user.role === 'admin',
    });
  } catch (error) {
    console.warn('فشل تسجيل الدخول:', error);
  }
}

/**
 * ترجمة أخطاء المصادقة
 */
function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/user-disabled': 'تم تعطيل هذا الحساب',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/popup-closed-by-user': 'تم إلغاء عملية تسجيل الدخول',
      'auth/cancelled-popup-request': 'تم إلغاء الطلب',
      'auth/network-request-failed': 'فشل الاتصال بالشبكة',
    };
    
    return messages[code] || 'حدث خطأ أثناء المصادقة';
  }
  
  return 'حدث خطأ غير متوقع';
}

/**
 * إضافة مستخدم كأدمن (للأدمن الحالي فقط)
 */
export function addAdmin(uidOrEmail: string): boolean {
  if (!isAdmin()) return false;
  
  try {
    const adminList = localStorage.getItem('ntfly_admin_list');
    const admins = adminList ? JSON.parse(adminList) : [];
    
    if (!admins.includes(uidOrEmail.toLowerCase())) {
      admins.push(uidOrEmail.toLowerCase());
      localStorage.setItem('ntfly_admin_list', JSON.stringify(admins));
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * إزالة مستخدم من الأدمن (للأدمن الحالي فقط)
 */
export function removeAdmin(uidOrEmail: string): boolean {
  if (!isAdmin()) return false;
  
  // لا يمكن إزالة الأدمن الرئيسي
  if (uidOrEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return false;
  }
  
  try {
    const adminList = localStorage.getItem('ntfly_admin_list');
    if (adminList) {
      const admins = JSON.parse(adminList) as string[];
      const filtered = admins.filter(a => a !== uidOrEmail.toLowerCase());
      localStorage.setItem('ntfly_admin_list', JSON.stringify(filtered));
    }
    
    return true;
  } catch {
    return false;
  }
}
