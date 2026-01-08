/**
 * خدمات المصادقة لمنصة Ntfly
 */

import { getMockMode, getMockUsers, saveMockData } from './mockStore';
import { ADMIN_EMAIL } from './constants';
import { createDocument, getDocument, updateDocument } from './firebase.db';
import { v4 as uuidv4 } from 'uuid';
import type { NtflyUser } from '@/types/global.d';

type AuthStateListener = (user: NtflyUser | null) => void;

const authListeners = new Set<AuthStateListener>();
let currentUser: NtflyUser | null = null;
const SESSION_KEY = 'ntfly_session';

function loadSession(): NtflyUser | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveSession(user: NtflyUser | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function notifyListeners(user: NtflyUser | null): void {
  authListeners.forEach(listener => listener(user));
}

function getUserRole(email: string): 'admin' | 'user' {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
}

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
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role: getUserRole(result.user.email || ''),
      createdAt: Date.now(),
      provider: 'password',
    };
    
    await saveUserToFirestore(user);
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    await logLogin(user);
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

async function mockSignIn(
  email: string,
  _password: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
  const mockUsers = getMockUsers();
  let existingUser: NtflyUser | null = null;
  
  mockUsers.forEach((u) => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      existingUser = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        role: getUserRole(u.email),
        createdAt: u.createdAt,
        provider: 'password',
      };
    }
  });
  
  if (!existingUser) {
    const uid = uuidv4();
    existingUser = {
      uid,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      role: getUserRole(email),
      createdAt: Date.now(),
      provider: 'password',
    };
    
    mockUsers.set(uid, {
      uid,
      email,
      displayName: existingUser.displayName,
      photoURL: null,
      createdAt: Date.now(),
      role: existingUser.role,
    });
    
    saveMockData();
  }
  
  currentUser = existingUser;
  saveSession(existingUser);
  notifyListeners(existingUser);
  await logLogin(existingUser);
  
  return { user: existingUser, error: null };
}

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
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: displayName || result.user.displayName,
      photoURL: result.user.photoURL,
      role: getUserRole(email),
      createdAt: Date.now(),
      provider: 'password',
    };
    
    await saveUserToFirestore(user);
    currentUser = user;
    saveSession(user);
    notifyListeners(user);
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

async function mockSignUp(
  email: string,
  _password: string,
  displayName?: string
): Promise<{ user: NtflyUser | null; error: string | null }> {
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
  const user: NtflyUser = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    role: getUserRole(email),
    createdAt: Date.now(),
    provider: 'password',
  };
  
  mockUsers.set(uid, {
    uid,
    email,
    displayName: user.displayName,
    photoURL: null,
    createdAt: Date.now(),
    role: user.role,
  });
  
  saveMockData();
  currentUser = user;
  saveSession(user);
  notifyListeners(user);
  
  return { user, error: null };
}

export async function signInWithGoogle(): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    return mockOAuthSignIn('google');
  }
  
  try {
    const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role: getUserRole(result.user.email || ''),
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
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

export async function signInWithGitHub(): Promise<{ user: NtflyUser | null; error: string | null }> {
  if (getMockMode()) {
    return mockOAuthSignIn('github');
  }
  
  try {
    const { getAuth, signInWithPopup, GithubAuthProvider } = await import('firebase/auth');
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const user: NtflyUser = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      role: getUserRole(result.user.email || ''),
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
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

async function mockOAuthSignIn(
  provider: 'google' | 'github'
): Promise<{ user: NtflyUser | null; error: string | null }> {
  const uid = uuidv4();
  const email = `demo-${provider}@ntfly.dev`;
  
  const user: NtflyUser = {
    uid,
    email,
    displayName: `مستخدم ${provider === 'google' ? 'Google' : 'GitHub'}`,
    photoURL: null,
    role: getUserRole(email),
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
    role: user.role,
  });
  
  saveMockData();
  currentUser = user;
  saveSession(user);
  notifyListeners(user);
  await logLogin(user);
  
  return { user, error: null };
}

export async function signOut(): Promise<void> {
  if (!getMockMode()) {
    try {
      const { getAuth, signOut: firebaseSignOut } = await import('firebase/auth');
      const auth = getAuth();
      await firebaseSignOut(auth);
    } catch { /* ignore */ }
  }
  
  currentUser = null;
  saveSession(null);
  notifyListeners(null);
}

export function getCurrentUser(): NtflyUser | null {
  if (!currentUser) {
    currentUser = loadSession();
  }
  return currentUser;
}

export function onAuthStateChanged(listener: AuthStateListener): () => void {
  authListeners.add(listener);
  const user = getCurrentUser();
  listener(user);
  
  return () => {
    authListeners.delete(listener);
  };
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

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
      await createDocument('users', user as unknown as Record<string, unknown>, user.uid);
    }
  } catch { /* ignore */ }
}

async function logLogin(user: NtflyUser): Promise<void> {
  try {
    await createDocument('login_logs', {
      uid: user.uid,
      email: user.email,
      provider: user.provider || 'unknown',
      timestamp: Date.now(),
      success: true,
    });
  } catch { /* ignore */ }
}

function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  
  const messages: Record<string, string> = {
    'auth/user-not-found': 'لم يتم العثور على المستخدم',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً',
    'auth/invalid-email': 'البريد الإلكتروني غير صالح',
    'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول',
  };
  
  return messages[code] || 'حدث خطأ في تسجيل الدخول';
}

export { ADMIN_EMAIL };
