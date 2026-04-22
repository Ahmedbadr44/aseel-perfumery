# Admin Setup Guide (Firebase)

## 1) Create Admin User
- Sign up normally from the app (`/signup`) or Firebase Authentication console.

## 2) Grant Admin Role
Use one of these secure approaches:
- Set custom claim on the user: `admin: true`, or
- Set Firestore flag: `users/{uid}.is_admin = true`.

Client-side admin promotion pages and open admin APIs are intentionally disabled for security.

## 3) Verify Access
1. Login at `/admin/login`.
2. Use email/password or Google sign-in.
3. Non-admin users should be rejected.
4. Admin users should access `/admin/dashboard`, `/admin/orders`, and `/admin/products`.

## 4) Security Checks
- Ensure `firestore.rules` and `storage.rules` are deployed.
- Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is set in server environment.
- Confirm no service-account JSON files are tracked in git.
