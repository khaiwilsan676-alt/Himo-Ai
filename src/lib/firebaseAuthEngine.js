// ==========================================
// HIMO FIREBASE AUTHENTICATION & API ENGINE (Production Config)
// ==========================================

const verifiedFirebaseConfig = {
  apiKey: "AIzaSyAmVde7UVEvfjcdXjLgeJ5gKuevhWxsRIQ",
  authDomain: "himo-6f545.firebaseapp.com",
  projectId: "himo-6f545",
  storageBucket: "himo-6f545.firebasestorage.app",
  messagingSenderId: "72355231728",
  appId: "1:72355231728:web:6b4707456acf9026fdcf35",
  measurementId: "G-HYXJXCNEVX"
};

export function generateFirebaseAuthCode(query) {
  const q = query ? query.replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().trim() : "";

  if (q.includes("signup") || q.includes("register") || q.includes("sign up")) {
    return `HIMO FIREBASE AUTHENTICATION API (SIGN UP)
Verified Production Code with your Firebase Config:

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "${verifiedFirebaseConfig.apiKey}",
  authDomain: "${verifiedFirebaseConfig.authDomain}",
  projectId: "${verifiedFirebaseConfig.projectId}",
  storageBucket: "${verifiedFirebaseConfig.storageBucket}",
  messagingSenderId: "${verifiedFirebaseConfig.messagingSenderId}",
  appId: "${verifiedFirebaseConfig.appId}",
  measurementId: "${verifiedFirebaseConfig.measurementId}"
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
Verified Production Code with your Firebase Config:

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "${verifiedFirebaseConfig.apiKey}",
  authDomain: "${verifiedFirebaseConfig.authDomain}",
  projectId: "${verifiedFirebaseConfig.projectId}",
  storageBucket: "${verifiedFirebaseConfig.storageBucket}",
  messagingSenderId: "${verifiedFirebaseConfig.messagingSenderId}",
  appId: "${verifiedFirebaseConfig.appId}",
  measurementId: "${verifiedFirebaseConfig.measurementId}"
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
Your Verified Firebase Project ID: ${verifiedFirebaseConfig.projectId}
Supported Modules:
1. firebase signup api
2. firebase login api

Request any of these to get the ready-to-use production code with your exact credentials!`;
}
