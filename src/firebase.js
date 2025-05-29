// Nouveau style modulaire Firebase
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "com.minifirestoreapp",
  projectId: "cookingapp-5669a",
  storageBucket: "TON_PROJECT.appspot.com",
  messagingSenderId: "679976666210",
  appId: "1:679976666210:android:ee20d1cbc2881eb4713d3b",
};

// Pour éviter l'erreur "Firebase App named '[DEFAULT]' already exists"
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export const storage = getStorage(app);

export { db };
