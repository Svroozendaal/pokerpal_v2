# LIGHT_AGENTS.MD

## Purpose
`LIGHT_AGENTS.MD` is a fast path for small, low-risk tasks and short prompts. It exists to ship quickly with minimal overhead, while staying safe-by-default.

This document is subordinate to `AGENTS.md` and is not a replacement. When in doubt: escalate to `AGENTS.md`.

## When to Use
Use Light mode when intent is clear and the impact is limited/isolated, for example:
- Small UI tweak in a React component (spacing, alignment, small MUI `sx` change)
- Copy/text change (UI or docs)
- Simple JS behavior tweak with low blast radius (one handler, one component)
- Quick fix with a clear repro and clear "done" definition
- Docs-only updates (`info_*.md`, `SKILL.md`, or agent docs) when the task is explicitly documentation

Practical heuristic:
- Expected change is small (1-2 files, small diff)
- No new data contracts, no new permissions/security decisions
- No unknown edge cases or product decisions required

## When NOT to Use
Escalate to `AGENTS.md` when:
- Scope grows or is uncertain ("while we're here..." / multiple sub-features)
- Data/auth coupling becomes non-trivial (Firebase Auth + Firestore schema/rules)
- Permissions/access control are involved (admin, sharing links, Firestore rules)
- Secrets/config are involved (`.env*`, hosting env vars, API keys)
- New persistent storage contracts are introduced (new Firestore collections/fields)
- Integrations/external calls are involved (ads/analytics/3rd parties)
- Deployment/release is requested (route to `DEPLOYMENT_AGENT.MD`)
- You feel uncertainty (unclear intent, unexpected side effects, security/perf risk)

## Simplified Workflow
1. Restate what you will do in 1 sentence (include assumptions).
2. Ask at most 1-2 clarifying questions if anything is ambiguous.
3. State what will change (1-3 bullets: which files/symbols, what, expected outcome).
4. Ask for confirmation before code changes, except:
   - explicit docs-only tasks, or
   - truly trivial refactors explicitly requested as "trivial" (no behavior change)
5. Implement small and targeted; do a quick sanity check.
6. Ask sparingly whether to promote new knowledge/patterns into `info_*.md` / `SKILL.md`.

## Documentation standard (still applies)
Even in Light mode:
- Add brief explanation comments for non-trivial logic.
- Ensure every function has a minimal JSDoc describing purpose + inputs + outputs.
- When touching an existing file, also backfill missing/insufficient docs for existing functions in that file.

## Safety Guardrails (Always)
Even in Light mode:
- Do not paste or log secrets (treat `.env*` and hosting env vars as sensitive).
- Do not assume client-side checks are sufficient for authorization (enforce via backend/rules).
- Prefer safe defaults for user data (no PII in logs; handle errors explicitly).
- Avoid breaking deploy flows (GitHub Actions/Vercel); run `npm run build` when relevant.

## Agent Collaboration
Light Agents may temporarily act as Developer/Designer for small changes, but must stop and hand off when boundaries are crossed:
- UI/UX complexity -> hand off to `DESIGNER_AGENT.MD`
- App logic/data/auth/security decisions -> hand off to `DEVELOPER_AGENT.MD`
- Deploy/release/CI/CD -> hand off to `DEPLOYMENT_AGENT.MD`
