import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account"
  });
  
  if (!firebaseConfig.apiKey) {
    console.error("❌ Missing Firebase configuration:");
    console.error("   NEXT_PUBLIC_FIREBASE_API_KEY:", firebaseConfig.apiKey ? "✓" : "✗");
    console.error("   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", firebaseConfig.authDomain ? "✓" : "✗");
    console.error("   NEXT_PUBLIC_FIREBASE_PROJECT_ID:", firebaseConfig.projectId ? "✓" : "✗");
  } else {
    console.log("✅ Firebase initialized successfully");
  }
}

export { app, auth, db, storage, googleProvider, signInWithPopup, GoogleAuthProvider };
