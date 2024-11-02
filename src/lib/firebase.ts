import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  connectFirestoreEmulator,
  writeBatch,
  type WriteBatch
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_ioCmL6-Dh9bX0UE0Qlic6zBEm21qUqI",
  authDomain: "serviherocrm.firebaseapp.com",
  projectId: "serviherocrm",
  storageBucket: "serviherocrm.firebasestorage.app",
  messagingSenderId: "765055255480",
  appId: "1:765055255480:web:b0e261f219155855cd054d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings for offline support
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true
});

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support offline persistence');
  }
});

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);

// Set auth persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

// Helper function to convert Firestore timestamps
export const convertFromFirestore = <T>(doc: any): T => {
  const data = doc.data();
  const converted = { ...data };

  // Convert all timestamp fields to Date objects
  Object.keys(data).forEach(key => {
    if (data[key]?.toDate) {
      converted[key] = data[key].toDate();
    }
  });

  return {
    id: doc.id,
    ...converted,
  } as T;
};

// Batch operations helper
export const createBatch = (): WriteBatch => {
  return writeBatch(db);
};

// Cache management
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

export const setCache = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (key?: string): void => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Network status monitoring
let isOnline = true;
const networkListeners = new Set<(online: boolean) => void>();

const updateNetworkStatus = () => {
  const wasOnline = isOnline;
  isOnline = navigator.onLine;
  
  if (wasOnline !== isOnline) {
    console.log(`App is ${isOnline ? 'online' : 'offline'}`);
    networkListeners.forEach(listener => listener(isOnline));
  }
};

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Export initialized services and utilities
export { 
  app, 
  auth, 
  db, 
  storage, 
  isOnline,
  networkListeners
};

// Export a function to check network status
export const checkNetworkStatus = () => isOnline;

// Export a function to wait for online status
export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isOnline) {
      resolve();
    } else {
      const checkOnline = () => {
        if (navigator.onLine) {
          window.removeEventListener('online', checkOnline);
          resolve();
        }
      };
      window.addEventListener('online', checkOnline);
    }
  });
};

// Error handling wrapper
export const handleFirestoreError = (error: any): never => {
  // Log the error with additional context
  console.error('Firestore operation failed:', {
    code: error.code,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Throw a more user-friendly error
  throw new Error(
    error.code === 'permission-denied'
      ? 'You don\'t have permission to perform this action.'
      : 'An error occurred while accessing the database. Please try again.'
  );
};