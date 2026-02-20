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

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⬇️  REPLACE THIS WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


