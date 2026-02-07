# Auth (`src/contexts/`)

## Purpose
Document how authentication works in this app and how UI code should consume it.

## Source of Truth
- Firebase init: `src/firebase.js` (exports `auth`).
- Auth context: `src/contexts/AuthContext.js` (exports `AuthProvider`, `useAuth()`).
- Auth UI: `src/components/Login.js`, `src/components/Signup.js`, `src/components/ForgotPassword.js`, `src/components/Account.js`

## `useAuth()` API (Current)
From `src/contexts/AuthContext.js`:
- `currentUser`: Firebase user object (or `null`).
- `signup(email, password, displayName)`: creates user and sets `displayName`.
- `login(email, password)`: email/password sign-in.
- `logout()`: sign out.
- `resetPassword(email)`: triggers password reset email.

## Provider Behavior
- `AuthProvider` subscribes to `onAuthStateChanged` on mount.
- Children are only rendered once the initial auth state is resolved (`loading` becomes `false`).

Implication: do not assume `currentUser` is immediately available on first render; handle null/loading states.

## UI Features that Depend on Auth
Examples of current UI gating:
- Saving a game: `SaveGameDialog` requires `currentUser`.
- History: `GameHistory` shows an error/CTA if not logged in.
- Setup: `SetupInputs` only shows the "Game Title" input when logged in.
- Admin: `Admin` blocks unauthenticated users, but does not enforce "real" admin access.

## Security Notes (Important)
- UI gating is convenience only; authorization must be enforced via Firestore rules / claims.
- Avoid hard-coded admin emails for authorization decisions; prefer server-enforced rules.

## Common Changes
- Add a protected route: wrap the route element and redirect to `/login` when `!currentUser`.
- Add new auth actions: import from `firebase/auth` and expose via `AuthContext` (keep call sites using `useAuth()`).
- Sensitive account updates require re-authentication: see `Account.js` usage of `reauthenticateWithCredential`.

## Related Skills
- `src/skills/firebase-auth/SKILL.md`
- `src/skills/firestore-games/SKILL.md`

