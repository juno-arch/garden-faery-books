# Firebase Sync Setup Prompt for Claude Code

Paste this into Claude Code (or a new Cowork session) with the `garden-faery-books` folder open:

---

## The Prompt

I need you to add Firebase cloud sync to my Garden Faery Books PWA (`index.html`). This is a single-file app that stores everything in localStorage via a `state` object and `saveState()`/`loadState()` functions. I need it to sync between my phone and desktop.

### What already exists:
- Firebase SDK compat scripts are already loaded in the `<head>` (firebase-app-compat, firebase-auth-compat, firebase-firestore-compat v10.12.0)
- The app uses `let state = { income:[], expenses:[], mileage:[], receipts:[], invoices:[], clients:[], cards:[], learned:{vendors:{},aliases:{},categories:{}}, settings:{rate:25,goal:2000,visionKey:'',irsRate:0.70}, version:4 }`
- `saveState()` writes to localStorage (and is a no-op when `testMode = true`)
- `loadState()` reads from localStorage on app load
- Settings tab already has cards for Business Settings, Receipt Scanner, Data export/import, and About

### What I need you to build:

1. **Cloud Sync card in Settings tab** — Add it between the Data card and the About card. It should have:
   - A text input for Firebase Project ID
   - A text input for Firebase API Key
   - A text input for Firebase Auth Domain (auto-fill as `{projectId}.firebaseapp.com`)
   - A "Save Config" button that stores the Firebase config in localStorage under `firebaseConfig`
   - A "Sign in with Google" button that uses Firebase Auth popup sign-in
   - A sync status indicator showing: signed out, syncing, synced, or error
   - A toggle switch for "Auto-sync" (on/off)
   - Current user display (email + sign out button) when signed in

2. **Firebase initialization** — `initFirebase()` function that:
   - Reads config from localStorage `firebaseConfig`
   - Calls `firebase.initializeApp(config)` if not already initialized
   - Sets up Firestore reference: `db = firebase.firestore()`
   - Returns true/false for success

3. **Google Sign-in** — `signInWithGoogle()` function:
   - Uses `firebase.auth.GoogleAuthProvider` with popup
   - On success, triggers initial sync (pull from cloud)
   - Shows user email in the Cloud Sync card
   - `signOut()` function that signs out and clears cloud reference

4. **Sync logic** — Hook into `saveState()`:
   - After writing to localStorage, if signed in and auto-sync is on, push state to Firestore
   - Document path: `users/{uid}/data/state`
   - Use `set()` with merge to avoid overwriting
   - Add a `lastModified: firebase.firestore.FieldValue.serverTimestamp()` field
   - On load/sign-in, pull from Firestore and merge with local (cloud wins if `lastModified` is newer)
   - Add a `syncFromCloud()` function and a `syncToCloud()` function
   - Show a small sync indicator in the header or status area

5. **Merge strategy**:
   - Compare `lastModified` timestamps — most recent wins for the whole state
   - If cloud is newer, replace local state and call `refreshAll()`
   - If local is newer, push to cloud
   - For first sync (no cloud data), push local to cloud

6. **Error handling**:
   - Offline: queue sync, retry when back online (`window.addEventListener('online', ...)`)
   - Auth expired: prompt re-sign-in
   - Show toast messages for sync status

### Important constraints:
- This is a single-file PWA — all code goes in `index.html` inline
- Cash only business, no payment processing needed
- Don't break test mode — `saveState()` should still be a no-op when `testMode = true`
- Keep the Garden Faery brand styling: Warm Dark #4a3520, Mushroom Brown #c4956a, Cream #fffbf0, Fairy Pink #d4a0b0, Sparkle Gold #d4a843, Lavender #b8a9c9, fonts: Fredoka (headings) + Nunito (body)
- Don't remove or modify any existing features

### Before you code:
The user (Taya) needs to do these steps in Firebase Console first. Please walk her through it step by step:
1. Go to console.firebase.google.com
2. Create a new project called "garden-faery-books"
3. Add a Web app to get the config values
4. Enable Firestore Database (start in test mode, we'll add rules later)
5. Enable Google sign-in under Authentication → Sign-in method
6. Copy the config values (apiKey, authDomain, projectId) into the app's Settings → Cloud Sync

Then implement the sync code.
