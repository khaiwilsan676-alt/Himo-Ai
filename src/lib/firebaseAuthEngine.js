// ==========================================
// HIMO FIREBASE AUTHENTICATION & API ENGINE
// ==========================================

export function generateFirebaseAuthCode(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  if (q.includes("signup") || q.includes("register") || q.includes("sign up")) {
    return `HIMO FIREBASE AUTHENTICATION API (SIGN UP)
Implementation for Email & Password Registration:

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User Registered Successfully:", user.uid);
    return { success: true, user };
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);
    return { success: false, error: error.message };
  }
}`;
  }

  if (q.includes("login") || q.includes("signin") || q.includes("sign in")) {
    return `HIMO FIREBASE AUTHENTICATION API (LOGIN)
Implementation for Email & Password Sign In:

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User Logged In Successfully:", user.uid);
    return { success: true, user };
  } catch (error) {
    console.error("Firebase Login Error:", error.message);
    return { success: false, error: error.message };
  }
}`;
  }

  return `HIMO FIREBASE AUTHENTICATION API MASTER
Supported Authentication Modules:
1. Email & Password Sign Up
2. Email & Password Sign In
3. Google Auth Provider Integration
4. User Logout & Session State Observer (onAuthStateChanged)

Example Usage: Request 'firebase signup api' or 'firebase login api' to get full production code.`;
}
