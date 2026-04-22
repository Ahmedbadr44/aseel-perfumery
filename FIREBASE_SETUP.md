# Firebase Setup Guide for Aseel Perfumery

## 1. Create Firebase Project

1. Go to: https://console.firebase.google.com
2. Click "Add project" → Name it "aseel-perfumery"
3. Disable Google Analytics (optional) → Create project

## 2. Enable Authentication

1. In Firebase Console → **Authentication** → Get started
2. Go to **Sign-in method** tab
3. Enable **Email/Password**
4. Save

## 3. Enable Firestore Database

1. Go to **Firestore Database** → Create database
2. Choose "Start in production mode"
3. Select a location close to your users (e.g., europe-west or me-central)
4. Create

### Firestore Rules (MVP production-safe):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.admin == true ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true
      );
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /orders/{orderId} {
      allow create: if false;
      allow read, update, delete: if isAdmin();
    }
    match /users/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && request.auth.uid == userId &&
        request.resource.data.is_admin == resource.data.is_admin;
      allow update, delete: if isAdmin();
    }
  }
}
```

## 4. Enable Storage

1. Go to **Storage** → Get started
2. Choose "Start in production mode"
3. Select same location as Firestore

### Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 5. Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" → Click **Web** icon (</>)
3. Register app with nickname "Aseel Web"
4. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:..."
};
```

## 6. Update Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}'
```

### Important
- Never commit service account JSON files to git.
- All order creation/updates must go through API routes (`/api/orders`), not direct client writes.

## 7. Create Firestore Collections

In Firestore, create these collections:

### `users` collection
Add a test user document (optional for testing):
- Document ID: (auto-generate)
- Fields:
  - email: "test@example.com"
  - display_name: "Test User"
  - is_admin: false
  - created_at: (server timestamp)

### `products` collection
Add test products if needed.

### `orders` collection
Leave empty - will be populated by checkout.

## 8. Run the App

```bash
npm run dev
```

## Troubleshooting

### "Firebase App not initialized"
- Make sure `.env.local` has correct values
- Restart dev server after updating env

### "Permission denied" errors
- Confirm rules are published exactly as above.
- Ensure admin users have either custom claim `admin: true` or `users/{uid}.is_admin=true`.

### Auth not working
- Enable Email/Password in Authentication → Sign-in method
