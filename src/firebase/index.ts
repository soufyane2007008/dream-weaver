/**
 * الملف الرئيسي لـ Firebase
 */

import { 
  firebaseConfig, 
  isFirebaseConfigured, 
  isMockMode, 
  saveFirebaseConfig,
  reloadConfig,
  type FirebaseConfig 
} from './firebase.config';

import {
  getMockMode,
  setMockMode,
  getMockUsers,
  getMockCollection,
  getMockStorage,
  saveMockData,
  initializeMockStore,
  type MockUser
} from './mockStore';

import { ADMIN_EMAIL } from './constants';

let isInitialized = false;
let firebaseApp: unknown = null;

/**
 * تهيئة Firebase
 */
export async function safeInitializeFirebase(): Promise<boolean> {
  if (isInitialized) return !getMockMode();
  
  reloadConfig();
  
  if (!isFirebaseConfigured()) {
    console.info('📦 Ntfly: Firebase غير مُعَد - تفعيل وضع Mock');
    setMockMode(true);
    isInitialized = true;
    initializeMockStore();
    return false;
  }
  
  try {
    const firebaseAppModule = await import('firebase/app');
    const { initializeApp, getApps, getApp } = firebaseAppModule;
    
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      console.info('✅ Ntfly: تم تهيئة Firebase بنجاح');
    } else {
      firebaseApp = getApp();
    }
    
    setMockMode(false);
    isInitialized = true;
    return true;
    
  } catch (error) {
    console.warn('⚠️ Ntfly: تعذر تحميل Firebase SDK:', error);
    setMockMode(true);
    isInitialized = true;
    initializeMockStore();
    return false;
  }
}

/**
 * إعادة تهيئة Firebase
 */
export async function reinitializeFirebase(config: FirebaseConfig): Promise<boolean> {
  saveFirebaseConfig(config);
  isInitialized = false;
  firebaseApp = null;
  return safeInitializeFirebase();
}

export function getFirebaseApp(): unknown {
  return firebaseApp;
}

// Re-exports
export { 
  ADMIN_EMAIL,
  getMockMode, 
  getMockUsers, 
  getMockCollection, 
  getMockStorage, 
  saveMockData,
  isFirebaseConfigured, 
  isMockMode, 
  firebaseConfig, 
  saveFirebaseConfig 
};

export type { MockUser, FirebaseConfig };
