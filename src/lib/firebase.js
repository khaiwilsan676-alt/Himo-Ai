import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForHimoOfflineAuth",
  authDomain: "himo-ai.firebaseapp.com",
  projectId: "himo-ai",
  storageBucket: "himo-ai.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
