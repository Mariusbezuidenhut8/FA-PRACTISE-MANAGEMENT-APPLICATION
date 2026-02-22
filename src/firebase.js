// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey:            "AIzaSyA_ZQPhaCAYptsadY30BeqKuoTk4g0BltY",
  authDomain:        "fa-practise-management.firebaseapp.com",
  projectId:         "fa-practise-management",
  storageBucket:     "fa-practise-management.firebasestorage.app",
  messagingSenderId: "737419772327",
  appId:             "1:737419772327:web:aac63b9ea59ece80dbb682",
  measurementId:     "G-4RGFVW9PVV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional debug (NO imports here)
onAuthStateChanged(auth, (user) => {
  console.log("AUTH STATE:", user ? user.uid : null, user);
});

// DEBUG:
auth.onAuthStateChanged((user) => {
  console.log("AUTH STATE:", user ? user.uid : null, user);
});
export const db = getFirestore(app);
export const storage = getStorage(app);
