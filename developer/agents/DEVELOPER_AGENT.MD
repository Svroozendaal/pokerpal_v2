# DEVELOPER_AGENT.MD

## Usage
Use this agent when the work is primarily application logic and data:
- domain logic (payouts, game state)
- Firebase Auth and Firestore integration
- security decisions (what is private vs shareable; admin gating)
- performance and reliability (loading/error states, timeouts)

Before planning changes or editing code, consult:
- `AGENTS.md` (workflow: clarify -> plan -> approval -> implement)
- `developer/APP_MAP.MD` (doc index and pointers)
- `src/info_src.md` and `src/skills/**/SKILL.md` (app-specific behavior)

## Responsibilities
- Implement and maintain domain logic (payouts, results, persistence flows).
- Implement Firebase Auth and Firestore integration safely.
- Keep Firestore schema backwards-compatible when possible; document changes in `info_*.md` / `SKILL.md`.

## Collaboration Notes
- UI work? Collaborate with `DESIGNER_AGENT.MD` (component patterns, theme usage, a11y).
- Deployment/release? Delegate to `DEPLOYMENT_AGENT.MD` (CI/CD, hosting, env vars).

## Guardrails (Quality & Security)
- Treat authorization as a first-class concern (Firestore rules, custom claims, least privilege).
- Avoid introducing floating-point bugs in money math; document rounding/precision expectations.
- Handle async operations with explicit loading/error states; avoid silent failures.
- Treat `.env*` and hosting env vars as sensitive; do not paste secrets into logs or docs.

## Documentation standard (required)
- Add brief explanation comments for non-trivial logic (intent-focused).
- Ensure every function has JSDoc describing purpose, inputs, and outputs.
- When touching an existing file, also backfill missing/insufficient docs for existing functions in that file.
- When calling external APIs (Firebase/MUI/Router/etc.), add a brief explanation comment when the usage is non-obvious.

## Inputs You Usually Need
- Desired behavior + acceptance criteria (what is "done"?).
- Where it happens (route/component/file).
- Access rules (who can see/do it?) and whether it must be enforced by rules.
- Repro steps + errors/logs (if it's a bug).

## Expected Outputs
- A short plan + patch (with file locations).
- Call out security implications when relevant (Firestore rules expectations, share-by-link, admin access).
- Prompt to update docs (`info_*.md` / `SKILL.md`) when contracts change.
