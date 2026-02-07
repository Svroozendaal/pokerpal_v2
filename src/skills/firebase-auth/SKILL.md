# Skill: Firebase Auth (PokerPal)

## When to Use
Use this skill when working on:
- login/signup/reset flows
- protected routes and auth-gated UI
- account management (email/password updates, display name)
- debugging authentication issues

## Source of Truth (Code)
- Firebase SDK init: `src/firebase.js`
- Auth context: `src/contexts/AuthContext.js`
- UI pages: `src/components/Login.js`, `src/components/Signup.js`, `src/components/ForgotPassword.js`, `src/components/Account.js`

Related high-level doc:
- `src/contexts/info_auth.md`

## Current Auth Model
- Email/password auth through Firebase Auth.
- Global auth state is provided via `AuthProvider` + `useAuth()`.
- UI gating exists in several places, but authorization must be enforced via Firestore rules for data access.

## Common Tasks
### Add a new auth action to the app
1. Add the Firebase import in `src/contexts/AuthContext.js` (from `firebase/auth`).
2. Implement a wrapper function (keep the API on `useAuth()` stable).
3. Export it via the context `value`.
4. Update call sites to use `useAuth()` rather than importing Firebase directly.

### Protect a route
Current code uses plain routes in `src/App.js`.
Recommended pattern:
- Create a small wrapper component that checks `currentUser` and redirects to `/login` if missing.
- Use it as the `element` for routes that require authentication.

### Re-authentication for sensitive updates
Firebase requires re-auth for operations like `updateEmail` and `updatePassword`.
See the implemented pattern in:
- `src/components/Account.js`

## Debugging Checklist
- Confirm `currentUser` is present (and remember the provider delays rendering until auth state is resolved).
- Check browser console errors from Firebase Auth.
- Verify the Firebase project configuration referenced by `src/firebase.js` matches the environment you are testing.
- If a flow works locally but fails in production, verify hosting configuration and Firebase Auth settings (allowed domains, etc.).

## Pitfalls / Notes
- Do not treat client-side checks (e.g. hiding links) as authorization.
- Do not paste tokens, credentials, or `.env` values into docs or logs.

