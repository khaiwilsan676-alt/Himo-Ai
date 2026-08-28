import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmVde7UVEvfjcdXjLgeJ5gKuevhWxsRIQ",
  authDomain: "himo-6f545.firebaseapp.com",
  projectId: "himo-6f545",
  storageBucket: "himo-6f545.firebasestorage.app",
  messagingSenderId: "72355231728",
  appId: "1:72355231728:web:6b4707456acf9026fdcf35"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

