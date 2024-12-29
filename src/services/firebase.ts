// src/services/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD-cyqmPLCWHVGQ-BfwBuNxaJvKXV1VP4A",
  authDomain: "om-motors-a2c86.firebaseapp.com",
  projectId: "om-motors-a2c86",
  storageBucket: "om-motors-a2c86.firebasestorage.app",
  messagingSenderId: "259932392587",
  appId: "1:259932392587:web:0b0fde524a9cb5ce13d88e",
  measurementId: "G-6YSYMQDM88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only if supported (web platform)
export const initAnalytics = async () => {
  try {
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.warn('Analytics not supported:', error);
    return null;
  }
};

// Export the app instance if needed elsewhere
export default app;