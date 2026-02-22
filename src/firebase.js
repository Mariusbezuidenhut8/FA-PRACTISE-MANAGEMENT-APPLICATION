import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_ZQPhaCAYptsadY30BeqKuoTk4g0BltY",
  authDomain: "fa-practise-management.firebaseapp.com",
  projectId: "fa-practise-management",
  storageBucket: "fa-practise-management.firebasestorage.app",
  messagingSenderId: "737419772327",
  appId: "1:737419772327:web:aac63b9ea59ece80dbb682",
  measurementId: "G-4RGFVW9PVV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug auth state (safe)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth)
      .then(() => console.log("Signed in anonymously"))
      .catch((error) => console.error("Anon sign-in failed", error));
  } else {
    console.log("AUTH UID:", user.uid);
  }
});
