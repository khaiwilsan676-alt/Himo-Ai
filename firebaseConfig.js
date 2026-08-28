import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmVde7UVEvfjcdXjLgeJ5gKuevhWxsRIQ",
  authDomain: "himo-6f545.firebaseapp.com",
  projectId: "himo-6f545",
  storageBucket: "himo-6f545.firebasestorage.app",
  messagingSenderId: "72355231728",
  appId: "1:72355231728:web:6b4707456acf9026fdcf35",
  measurementId: "G-HYXJXCNEVX"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
