# Skill: Firestore `games` Collection (PokerPal)

## When to Use
Use this skill when working on:
- saving games
- game history, game view, and share links
- admin dashboards or moderation tools
- Firestore schema changes and backwards compatibility
- access-control decisions (what is private vs shareable)

## Source of Truth (Code)
- Writes: `src/components/SaveGameDialog.js`
- Reads (per-user): `src/components/GameHistory.js`
- Reads (by id): `src/components/GameView.js`
- Admin reads/deletes: `src/components/Admin.js`

## Current Collection(s)
### `games` (primary)
Documents are created by `SaveGameDialog` via `addDoc(collection(db, 'games'), gameData)`.

Current write shape (high-level):
- `title` (string)
- `date` (Firestore server timestamp)
- `userId` (string, Firebase Auth uid)
- `potValue` (number)
- `currency` (object: `code`, `symbol`, `name`)
- `payouts` (array of strings)
- `results` (array; player results - mixed legacy/current usage)
- `settings` (object)
  - `coinValue` (number)
  - `buyInValue` (number)
  - `players` (array of objects)
    - `name` (string)
    - `startStack` (number)
    - `endStack` (number)

Notes:
- `results` is kept for display/backwards-compat use (and is used by `Admin.js` for player count).
- `settings.players` is the normalized source for stacks in the newer structure.

### `users` (optional)
`Admin.js` reads `collection(db, 'users')` if it exists and rules allow. No code in this repo writes to `users`.

## Read Patterns
### Game history
`GameHistory.js`:
- queries `games` by `userId == currentUser.uid`
- supports both older and newer document shapes
- sorts by `date` client-side

### Single game view
`GameView.js`:
- fetches a game by id with `getDoc(doc(db, 'games', gameId))`
- assumes the newer shape (`settings.players`)

If old documents exist without `settings.players`, decide whether to:
- migrate old documents, or
- make `GameView` tolerant to the old shape.

### Admin
`Admin.js`:
- queries all games ordered by `date desc`
- can delete games with `deleteDoc(doc(db, 'games', gameId))`

## Sharing Model (Important)
The UI creates share links by copying a URL to `/game/:gameId`.

Whether a recipient can view a shared link depends on Firestore rules:
- If reads are owner-only, shared links will only work for the owner.
- If shared links should be publicly readable, you need an explicit, rules-enforced sharing model (e.g. a `visibility` field) and careful data minimization.

Document the chosen model in this skill when implemented.

## Security Checklist
- Do not rely on client-side "admin" checks (e.g., hidden nav links) as authorization.
- Enforce read/write/delete permissions with Firestore rules (and/or custom claims).
- Minimize personally identifiable information stored in game documents.

## Schema Change Guidelines
- Prefer additive changes (new fields) over breaking changes.
- Keep `GameHistory` backwards-compatible if old docs exist.
- Update `src/info_src.md` and this file when contracts change.

