# APP_MAP.MD (PokerPal)

## Purpose
This file is the routing map for app-specific documentation in this repository.

- Behavior/workflow rules live in: `developer/agents/*.MD` and `AGENTS.md`
- App-specific details live near the code in: `info_*.md` and `src/skills/**/SKILL.md`

## Quick application map (pointers)
- React app source: `src/`
  - Bootstrap: `src/index.js`
  - Routing + main calculator flow: `src/App.js`
  - Firebase init (Auth/Analytics/Firestore): `src/firebase.js`
  - Auth wrapper: `src/contexts/AuthContext.js`
  - Pages/components: `src/components/`
  - i18n config (optional/experimental): `src/i18n/config.js`
- Build/SEO scripts: `scripts/`
- CI/CD: `.github/workflows/`
- Hosting configs: `vercel.json`, `vercel-build.sh`

## App-specific docs (source of truth)
- Source map + routes + major flows: `src/info_src.md`
- Auth flow (Firebase Auth): `src/contexts/info_auth.md`
- Skills:
  - Firebase Auth: `src/skills/firebase-auth/SKILL.md`
  - Firestore games schema + access patterns: `src/skills/firestore-games/SKILL.md`
  - Payout calculation logic: `src/skills/payouts/SKILL.md`
- Script behaviors (sitemap/robots, build helpers): `scripts/info_scripts.md`

## Updating this map
When adding a new top-level feature area, update:
1. the nearest `info_*.md` near the code, and
2. this file (`developer/APP_MAP.MD`) with a pointer to the new doc(s).

