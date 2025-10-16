import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, logEvent, setUserId, setUserProperties } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Garante que só um app seja inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth (login/logout etc.)
export const auth = getAuth(app);

// Analytics (somente no browser)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("📊 Firebase Analytics inicializado");
    }
  });
}

// Helpers para rastrear eventos
export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (analytics) logEvent(analytics, name, params);
};

export const setAnalyticsUser = (uid: string) => {
  if (analytics) setUserId(analytics, uid);
};

export const setAnalyticsProps = (props: Record<string, any>) => {
  if (analytics) setUserProperties(analytics, props);
};
