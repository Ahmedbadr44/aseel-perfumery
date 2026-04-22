# Google Sign-In with Firebase

## Enable Provider
1. Open Firebase Console.
2. Go to `Authentication` -> `Sign-in method`.
3. Enable `Google` provider.
4. Add authorized domains for local and production app URLs.

## App Behavior
- Google sign-in is used from normal login/signup screens.
- Admin login is allowed only when the signed-in account is marked as admin.

## Admin Access Requirement
After user creation, mark admin users by either:
- setting custom claim `admin: true`, or
- setting Firestore document `users/{uid}.is_admin = true`.

## Troubleshooting
- `Unauthorized admin`: account exists but has no admin role.
- `Popup blocked`: allow popups for your site.
- `Auth domain error`: confirm `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` and Firebase authorized domains.
