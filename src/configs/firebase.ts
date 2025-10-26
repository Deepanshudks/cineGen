import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "cinegen-22996.firebaseapp.com",
  projectId: "cinegen-22996",
  storageBucket: "cinegen-22996.firebasestorage.app",
  messagingSenderId: "518749336121",
  appId: "1:518749336121:web:7701611ab084aca35f53e8",
  measurementId: "G-TN8W1THDK2",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
