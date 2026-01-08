/**
 * إعدادات Firebase الديناميكية لمنصة Ntfly
 */

import { STORAGE_KEY } from './constants';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * تحميل الإعدادات
 */
function loadConfig(): FirebaseConfig {
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.apiKey && parsed.authDomain && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // تجاهل
  }
  
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  };
}

export let firebaseConfig: FirebaseConfig = loadConfig();

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

export function isMockMode(): boolean {
  return !isFirebaseConfigured();
}

export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    firebaseConfig = config;
    return true;
  } catch {
    return false;
  }
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
  firebaseConfig = loadConfig();
}

export function reloadConfig(): FirebaseConfig {
  firebaseConfig = loadConfig();
  return firebaseConfig;
}

export function getFirebaseConfig(): FirebaseConfig {
  return firebaseConfig;
}
