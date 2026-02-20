// 1. Imports from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 2. Your specific Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_ZQPhaCAYptsadY30BeqKuoTk4g0BltY",
  authDomain: "fa-practise-management.firebaseapp.com",
  projectId: "fa-practise-management",
  storageBucket: "fa-practise-management.firebasestorage.app",
  messagingSenderId: "737419772327",
  appId: "1:737419772327:web:aac63b9ea59ece80dbb682",
  measurementId: "G-4RGFVW9PVV"
};

// 3. Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// 4. Initialize and Export Firestore (The Database)
export const db = getFirestore(app);
