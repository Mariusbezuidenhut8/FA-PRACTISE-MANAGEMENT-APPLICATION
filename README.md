# ADVISE Practice Manager
### Financial Planning Case Management System

A practice management web app for tracking new business pipeline and existing client admin (CITA).
Built with React + Firebase Firestore. Deployed on Netlify.

---

## What You Need Before Starting

- A computer with internet access
- A free GitHub account → https://github.com
- A free Firebase account → https://firebase.google.com (sign in with Google)
- A free Netlify account → https://netlify.com (sign in with GitHub)
- Node.js installed on your computer → https://nodejs.org (download the LTS version)

---

## STEP 1 — Set Up Firebase (Your Database)

This is where all your data will live permanently.

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `advise-practice-manager`
4. Disable Google Analytics (not needed) → Click **"Create project"**
5. Wait for it to load, then click **"Continue"**

### Create the Database

6. In the left menu, click **Build → Firestore Database**
7. Click **"Create database"**
8. Choose **"Start in test mode"** → click **Next**
9. Choose a region: `europe-west2` (London, closest to SA) → click **Enable**
10. Wait for it to finish — you'll see an empty database

### Get Your Firebase Config

11. Click the **gear icon** ⚙️ next to "Project Overview" → **Project settings**
12. Scroll down to **"Your apps"** section
13. Click the **`</>`** (Web) icon
14. Register app name: `advise-web` → click **"Register app"**
15. You will see a block of code that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "advise-practice-manager.firebaseapp.com",
  projectId: "advise-practice-manager",
  storageBucket: "advise-practice-manager.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

16. **Copy this entire block** — you will need it in Step 3

---

## STEP 2 — Get the Code onto Your Computer

### Option A: Download as ZIP (easiest)
1. If you received this as a ZIP file, unzip it to a folder on your Desktop
2. Name the folder `advise-app`

### Option B: From GitHub (if already uploaded)
Open **Terminal** (Mac) or **Command Prompt** (Windows) and run:
```bash
git clone https://github.com/YOUR-USERNAME/advise-app.git
cd advise-app
```

---

## STEP 3 — Add Your Firebase Config

1. Open the `advise-app` folder
2. Navigate to `src/firebase.js`
3. Open it in any text editor (Notepad, TextEdit, VS Code)
4. Find these lines near the bottom:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  ...
};
```

5. **Replace the entire firebaseConfig block** with the one you copied from Firebase in Step 1
6. Save the file

---

## STEP 4 — Test It Locally on Your Computer

Open **Terminal** / **Command Prompt**, navigate to your project folder:

```bash
cd advise-app
npm install
npm start
```

- `npm install` downloads all the libraries (takes 1-2 minutes, only needed once)
- `npm start` opens the app in your browser at http://localhost:3000
- The app is now running locally and connected to your Firebase database
- Any data you add will be saved permanently in Firestore

**To stop it:** press `Ctrl + C` in the terminal

---

## STEP 5 — Push to GitHub

1. Go to https://github.com → click **"New repository"**
2. Name it: `advise-app`
3. Set to **Private** (your practice data)
4. Do NOT tick "Add README" (you already have one)
5. Click **"Create repository"**
6. GitHub will show you commands. In your terminal, run:

```bash
cd advise-app
git init
git add .
git commit -m "Initial commit — ADVISE Practice Manager"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/advise-app.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

✅ Your code is now on GitHub.

---

## STEP 6 — Deploy to Netlify (Go Live)

1. Go to https://netlify.com → log in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your `advise-app` repository
5. Netlify will auto-detect the settings (build command: `npm run build`, publish: `build`)
6. Click **"Deploy site"**
7. Wait 2-3 minutes for the build to finish
8. Netlify gives you a URL like: `https://amazing-name-123456.netlify.app`

✅ **Your app is now live on the internet!**

You can open it on any device — laptop, tablet, phone.
Every time you push changes to GitHub, Netlify automatically rebuilds and redeploys.

---

## STEP 7 — Give It a Better URL (Optional)

1. In Netlify, go to **Site settings → Domain management**
2. Click **"Options" → "Edit site name"**
3. Change it to something like `advise-practice` 
4. Your URL becomes: `https://advise-practice.netlify.app`

---

## Firestore Security (Important — Do Before Going Live)

Right now the database is in "test mode" which means anyone with the URL could read/write data.
Before using with real client data, update the Firestore rules:

1. In Firebase Console → **Firestore Database → Rules**
2. Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31);
    }
  }
}
```

This gives you until end of 2026. For proper user authentication,
come back to Claude and ask: *"Add Firebase Authentication to ADVISE"*

---

## Making Changes After Deployment

Whenever you want to update the app:

1. Make changes to the code files
2. In terminal:
```bash
git add .
git commit -m "Description of what you changed"
git push
```
3. Netlify automatically detects the push and redeploys within 2-3 minutes

---

## File Structure Reference

```
advise-app/
├── public/
│   └── index.html          ← The HTML shell
├── src/
│   ├── App.js              ← The entire application UI
│   ├── firebase.js         ← Your Firebase connection (add your config here)
│   ├── useFirestore.js     ← Database read/write hooks
│   └── index.js            ← React entry point
├── .gitignore              ← Files Git ignores
├── netlify.toml            ← Netlify build settings
├── package.json            ← Project dependencies
└── README.md               ← This file
```

---

## Troubleshooting

**"npm: command not found"**
→ Install Node.js from https://nodejs.org (LTS version), then restart your terminal

**App opens but shows "Loading…" forever**
→ Your Firebase config in `src/firebase.js` is probably still showing "YOUR_API_KEY"
→ Replace it with your actual Firebase config from Step 1

**"Permission denied" errors in the browser console**
→ Your Firestore is not in test mode. Go to Firebase Console → Firestore → Rules
→ Check the rules allow read/write

**Netlify build fails**
→ Check that `netlify.toml` is in the root folder (not inside `src`)
→ Check that `package.json` is in the root folder

---

## Support

This app was built with Claude (claude.ai). To add new features or fix issues,
open Claude and share the code files — Claude can modify and improve them.

Common next requests:
- "Add user login so RM and MK each have their own view"
- "Add email notifications when tasks are overdue"  
- "Add a reporting page showing monthly new business stats"
- "Add a notes/comments section to each client case"
