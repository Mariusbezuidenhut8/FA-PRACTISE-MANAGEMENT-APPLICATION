// src/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "advise-practice-manager"
// 3. Once created, click the "</>" (Web) icon to add a web app
// 4. Register the app, then copy the firebaseConfig object below
// 5. In the Firebase console, go to Build → Firestore Database
//    → Create database → Start in test mode → Choose a region
// ─────────────────────────────────────────────────────────────────────────────

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_ZQPhaCAYptsadY30BeqKuoTk4g0BltY",
  authDomain: "fa-practise-management.firebaseapp.com",
  projectId: "fa-practise-management",
  storageBucket: "fa-practise-management.firebasestorage.app",
  messagingSenderId: "737419772327",
  appId: "1:737419772327:web:aac63b9ea59ece80dbb682",
  measurementId: "G-4RGFVW9PVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Add 'export' at the start of this line
export const db = getFirestore(app);


