# Firebase Setup Status

## Current Architecture
- Frontend auth/data client: Firebase Web SDK
- Server-side trusted operations: Next.js API routes + Firebase Admin SDK
- Order creation and admin status updates: `/api/orders`
- Customer tracking lookup: `/api/orders/track`

## Required Environment Variables
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY` (server-only secret JSON string)

## Security Notes
- Never commit service account JSON files.
- Keep Firestore and Storage rules in production-safe mode.
- Admin access must rely on Firebase auth + admin role checks, not hardcoded credentials.

## Verification Checklist
- [ ] User can sign up and log in with Firebase Authentication.
- [ ] Admin user has `is_admin: true` in `users/{uid}` or custom claim `admin: true`.
- [ ] Customer can place order from checkout successfully.
- [ ] Admin can view and update orders from dashboard.
- [ ] Customer can track order by phone with masked address details.
