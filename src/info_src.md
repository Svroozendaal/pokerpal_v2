# `src/` (PokerPal) - Source Map

## Purpose
- Provide a quick map of the React source tree for PokerPal.
- Document the main routes and user flows.
- Point to deeper, app-specific documentation (`info_*.md`, `SKILL.md`).

## Entry Points / Core Files
- `src/index.js`: mounts the React app.
- `src/App.js`: routing + main calculator state + payout calculation.
- `src/theme.js`: MUI theme definitions (dark/light).
- `src/firebase.js`: Firebase SDK initialization (Auth/Firestore/Analytics). Do not copy keys into docs.
- `src/contexts/AuthContext.js`: `AuthProvider` and `useAuth()`.

## Routes (React Router)
Defined in `src/App.js`:
- `/`: calculator (main flow).
- `/login`: log in.
- `/signup`: create account.
- `/forgot-password`: password reset.
- `/terms`: terms page.
- `/history`: saved games list (requires auth in UI).
- `/account`: account management (requires auth).
- `/game/:gameId`: view a saved game by id.
- `/admin`: admin dashboard (UI-gated; must be enforced via Firestore rules).
- `/faq`: FAQ page.

## Main Flows (High-level)
### Payout calculator
- Inputs live in `src/components/SetupInputs.js` and `src/components/PlayerInput.js`.
- Payout logic lives in `src/App.js` (`calculatePayouts`).
- Discrepancies between total start/end stacks trigger `src/components/DiscrepancyModal.js`.
- Results rendering uses `src/components/ResultsDisplay.js`, `src/components/ResultsTable.js`, and `src/components/ResultsDialog.js`.

Deep dive: `src/skills/payouts/SKILL.md`

### Saving games
- `src/components/SaveGameDialog.js` writes a new document to Firestore and navigates to `/game/:gameId`.

Deep dive: `src/skills/firestore-games/SKILL.md`

### History and sharing
- `src/components/GameHistory.js` queries the current user's saved games.
- Sharing copies a URL to `/game/:gameId`; whether others can view the link depends on Firestore rules.

Deep dive: `src/skills/firestore-games/SKILL.md`

### Viewing a single game
- `src/components/GameView.js` loads a game by id and renders `ResultsDisplay`.

### Authentication / account
- Auth context: `src/contexts/AuthContext.js`
- Auth pages: `src/components/Login.js`, `src/components/Signup.js`, `src/components/ForgotPassword.js`
- Account settings: `src/components/Account.js`

Deep dive: `src/contexts/info_auth.md`, `src/skills/firebase-auth/SKILL.md`

### Admin
- `src/components/Admin.js` reads games (and optionally users) and can delete games.
- Client-side UI gating is not a security boundary; enforce access via Firestore rules/claims.

## `src/components/` (Quick Map)
- Layout: `AppContainer`, `Navigation`, `Footer`, `GoogleAd`
- Calculator: `SetupInputs`, `PlayerInput`, `TotalStackDisplay`
- Results: `ResultsDisplay`, `ResultsTable`, `PayoutsDisplay`, `ResultsDialog`, `DiscrepancyModal`
- Persistence: `SaveGameDialog`, `GameHistory`, `GameView`
- Auth: `Login`, `Signup`, `ForgotPassword`, `Account`
- Admin: `Admin`
- Content: `FAQ`, `Terms`

## i18n / SEO (Currently Not Wired)
- `src/i18n/config.js` and `src/components/SEOHelmet.js` exist, but are not currently imported/used by the app.
- Treat these as experimental/unfinished until they are actually wired into `src/index.js` / `src/App.js`.

## Legacy/Unused Files (Verify Before Removing)
- `src/App old.js`
- `src/components/MainApp.js`

