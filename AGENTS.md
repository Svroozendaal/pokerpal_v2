# AGENTS.md (Router / Dispatch)

## Purpose
`AGENTS.md` is the single entrypoint for AI/Codex work in this repository. It:
- routes tasks to specialist agents in `developer/agents/`
- defines the standard workflow (clarify -> plan -> explicit approval -> implement -> docs)
- points to authoritative app documentation (without duplicating it here)

This router aims to stay "timeless": detailed app knowledge should live in `info_*.md` and `SKILL.md` files near the code.

## Read First (Routing References)
1. `developer/APP_MAP.MD` - application map + doc index (app-specific pointers)
2. `developer/agents/*` - behavior/workflow rules per domain
3. `src/info_src.md` - source tree map (app-specific)
4. `src/skills/**/SKILL.md` - deep app-specific skills (Firebase, Firestore, payouts, etc.)
5. `scripts/info_scripts.md` - build/SEO scripts (app-specific)

## App Map
Keep app-specific structure/details out of this router. Use `developer/APP_MAP.MD` (and the code-adjacent docs it points to) as the source of truth.

## Agent Registry
Specialist agents live in `developer/agents/`:
- `LIGHT_AGENTS.MD` - fast path for small, low-risk tasks
- `DESIGNER_AGENT.MD` - UI/UX work (React + MUI, responsiveness, a11y)
- `DEVELOPER_AGENT.MD` - app logic, state, data model, Firebase/Firestore integration
- `DEPLOYMENT_AGENT.MD` - build, CI/CD, hosting (GitHub Pages / Vercel)
- `DOC_AGENT.MD` - documentation hygiene and app mapping (`info_*.md`, `SKILL.md`)

## Routing Table
| Agent | Responsibilities | Typical triggers | Inputs needed | Expected outputs |
| --- | --- | --- | --- | --- |
| `LIGHT_AGENTS.MD` | Small, low-risk edits | Copy tweaks, small UI tweak, small refactor, docs update | Desired outcome + where to change | Micro plan + small patch |
| `DESIGNER_AGENT.MD` | UI/UX, components, theming | Layout, styling, accessibility, responsive issues | Screenshot/URL + breakpoints + acceptance criteria | UI patch + notes |
| `DEVELOPER_AGENT.MD` | Logic/state/data, Firebase | Payout logic, auth flows, Firestore reads/writes, bugs | Repro/stack trace + acceptance criteria | Patch + safety notes |
| `DEPLOYMENT_AGENT.MD` | CI/CD + hosting | "Deploy", GitHub Actions, GitHub Pages, Vercel, env vars | What must ship + target environment | Runbook/checklist |
| `DOC_AGENT.MD` | App docs and indexing | Add/update `info_*.md`, new feature map, docs hygiene | Which folders/features changed | Updated docs near code |

## Standard Codex Behavior (Policy)
### NL
Wanneer een gebruiker een change/feature voorstelt:
0. **Werkvoorkeuren (wanneer relevant):** vraag naar gewenste samenwerking (snelheid vs strictheid, uitleg-niveau, plan-frequentie, aannames-tolerantie).
1. **Stel gerichte verduidelijkingsvragen** tot de requirement onmiskenbaar is (doel, scope, acceptatiecriteria, randgevallen).
2. **Maak een kort plan**: wat verandert waar, en wat is het verwachte resultaat.
3. **Vraag expliciete goedkeuring** op dat plan **voor** codewijzigingen.
4. **Implementeer** en valideer waar mogelijk (gerichte tests/build/run), en geef een korte oplever-samenvatting.
5. **Docs check**: vraag of docs geupdatet moeten worden (agent docs vs `info_*.md`/`SKILL.md`). Update alleen na "ja" (behalve bij expliciete doc-taken).

### EN
When a user proposes a change/feature:
0. **Working preferences (when relevant):** ask how the user prefers to collaborate (speed vs strictness, explanation level, plan frequency, assumption tolerance).
1. **Ask targeted clarifying questions** until the requirement is unambiguous (goal, scope, acceptance criteria, edge cases).
2. **Draft a short plan**: what changes where, and the expected outcome.
3. **Request explicit approval** of that plan **before** code changes.
4. **Implement** and validate where possible (focused tests/build/run), then provide a short delivery summary.
5. **Docs check**: ask whether to update docs (agent rules vs `info_*.md`/`SKILL.md`). Update only after "yes" (except for explicitly doc-only tasks).

## Dispatch Protocol (Multi-Agent Collaboration)
- Pick 1 lead agent (best match from the routing table). The lead owns scope, plan, and approval.
- If work spans domains, compose agents:
  - UI + logic/data -> `DESIGNER_AGENT.MD` + `DEVELOPER_AGENT.MD`
  - Code + deployment -> `DEVELOPER_AGENT.MD` + `DEPLOYMENT_AGENT.MD`
  - Docs + code map -> `DOC_AGENT.MD` + the relevant agent

## Documentation Placement Rules
Goal: keep app-specific knowledge close to the code; keep behavior/workflow rules in agent files.

- Behavior/workflow rules: `developer/agents/*.MD` and this file (`AGENTS.md`)
- App-specific routing map: `developer/APP_MAP.MD` (routing only; points outward)
- App-specific details:
  - folder maps and contracts: `info_<folder>.md` inside the relevant folder
  - deep "how-to" guides: `src/skills/<topic>/SKILL.md`

## Documentation Standards (Code + Repo Docs)
### Code-level documentation (required)
- Add short intent-focused comments for non-trivial logic.
- Ensure every function has documentation (JSDoc) describing:
  - purpose
  - inputs (params)
  - outputs (return value and/or side effects)
- When touching an existing file, also backfill missing/insufficient docs for existing functions in that file.
- When calling functions/classes not defined in this repo (React/MUI/Firebase/Router/etc.), add a brief explanation comment when the usage is non-obvious.

### Repo documentation (where to put what)
- `info_*.md` should describe current behavior, file map, public entrypoints, and data contracts.
- `SKILL.md` should describe repeatable workflows (setup, debugging, patterns) for a specific topic.
- Avoid copying large code blocks into docs; summarize and reference file paths.

## Safety & Guardrails (Always)
- Secrets: do not paste or log secrets. Treat `.env*` as sensitive. Do not invent missing env vars.
- Security: never assume client-side checks are sufficient. Authz must be enforced via backend/rules (e.g., Firestore rules).
- Privacy: avoid logging user identifiers/emails unless required for debugging; prefer redaction.
- Deployments: pushing to `main` may trigger CI/CD (see `.github/workflows/*`). Ask before performing deployment actions.

## Extensibility (Adding New Agents)
To add a new agent:
1. Create: `developer/agents/<NAME>_AGENT.MD`
2. Define responsibilities, triggers, inputs/outputs, guardrails, and collaboration notes.
3. Register it above under Agent Registry + Routing Table.
