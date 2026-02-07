# DEPLOYMENT_AGENT.MD (Branches / CI / Hosting)

## Purpose
Use this agent for branch strategy, CI/CD, and hosting/deployment workflows.

This file is behavior/workflow only:
- app-specific code maps live in `developer/APP_MAP.MD` and `src/info_src.md`
- script behavior lives in `scripts/info_scripts.md`

## Current Repo State (Observed Locally)
Branches currently present in this repo:
- `main`
- `gh-pages`
- `gh-pages-deploy`
- feature branch(es) like `auth-feature`

## Target Branch Model (Requested)
Goal: keep day-to-day work in one branch, deploy from a trimmed branch, and publish GitHub Pages on staging pushes.

Proposed roles:
- `development`: full repo (including `developer/**`, agent docs, and code-adjacent docs).
- `staging`: deployable subset only (no `developer/**`, no agent/router docs unless explicitly allowed).
- `main`: stable/release branch (exact role depends on your preference: “production mirror of staging” vs “manual promote”).
- `gh-pages`: GitHub Pages publish branch (should contain **built static output**, not source).
- `gh-pages-deploy`: optional/legacy (keep only if it has a clear purpose; otherwise deprecate/remove later).

## Guardrails (Non-negotiable)
- Deployment actions are high-impact. Ask for explicit approval before:
  - pushing/merging to a deploy-triggering branch (`staging`/`main`)
  - changing `.github/workflows/*`
  - changing hosting config files (`vercel.json`, `public/_redirects`, etc.)
- Never paste, log, or rotate secrets/tokens in-chat.
- Avoid force-push and history rewrites on shared branches unless explicitly approved.
- SPA routing is required (deep links must resolve to `index.html`).

## Staging “Deployable Subset” - How to Maintain It
Staging must not just “ignore docs in the build”; it must *not contain* those files.

Supported strategies:
1. Local sync script (recommended for simplicity)
   - A script copies an allowlisted set of paths from `development` into a checked-out `staging` worktree, commits, and pushes.
   - Pros: simple mental model, no extra GitHub tokens.
   - Cons: relies on consistent manual operation.
2. GitHub Action sync (recommended for automation)
   - On push to `development`, a workflow generates the staging tree from an allowlist and pushes to `staging`.
   - Requires workflow permissions (`contents: write`) and careful protections to avoid loops.
3. “No staging pruning” (not acceptable for your goal)
   - Running deploys from a full branch doesn’t satisfy “agents/docs not in staging”.

Allowlist should be explicit (example only; confirm before implementation):
- `.github/workflows/**` (if staging is the trigger branch)
- `public/**`
- `src/**`
- `scripts/**`
- `package.json`, `package-lock.json`, `.gitignore`
- `vercel.json`, `vercel-build.sh` (only if Vercel is in use)

## GitHub Pages Deployment (Desired Behavior)
Desired trigger:
- Push to `staging` => build => publish `./build` to `gh-pages`

Notes:
- `gh-pages` should contain the build output (static files), not the React source tree.
- For SPA routes, GitHub Pages needs a client-side routing strategy (404 fallback / redirect approach).

## Debugging Playbook
- Confirm which branch triggers which workflow (`.github/workflows/*.yml`).
- Re-run locally:
  - `npm install`
  - `npm run build`
- If only deep links fail: fix host fallback/rewrites first.
- If Firebase/Auth/Firestore fails only in prod: verify Firebase project config and Firestore rules (no secrets in logs).

## Expected Outputs
- A branch + workflow plan that matches the target model.
- A minimal set of workflow changes with clear rollback steps.
- A documented allowlist for staging sync (script or action).
