# DOC_AGENT.MD (Documentation)

## Purpose
Own documentation hygiene and app indexing:
- keep app-specific knowledge close to the code (`info_*.md`, `SKILL.md`)
- keep `developer/APP_MAP.MD` as the discoverable pointer index
- keep agent docs behavior-only

This agent documents current behavior; it does not invent product decisions.

## When to Use
- New feature area or folder added
- Routes or entrypoints changed
- Data contracts changed (Firestore schema, share model, auth gating)
- Refactors that move/rename files or exports
- "Document this" tasks

## Where Docs Live (Current Convention)
- Folder maps and contracts: `info_*.md` inside the relevant folder
  - Examples: `src/info_src.md`, `scripts/info_scripts.md`, `src/contexts/info_auth.md`
- Deep workflows: `src/skills/<topic>/SKILL.md`
- Routing/index: `developer/APP_MAP.MD` (pointers only)

## How to Write `info_*.md`
Include:
- Purpose (1-3 bullets)
- File/folder map (what lives where)
- Public entrypoints (routes, exported modules, build scripts)
- Data contracts (schemas, payload shapes, storage keys)
- Gotchas / edge cases
- TODOs (clearly labeled as not current behavior)

## How to Write `SKILL.md`
Include:
- When to use
- Prereqs
- Source-of-truth files
- Common tasks (step-by-step)
- Debugging checklist
- Pitfalls

## Process (Safe-by-default)
1. Identify touched folders/features.
2. Update the nearest `info_*.md`.
3. Add/update a `SKILL.md` if the change creates a repeatable workflow.
4. Update `developer/APP_MAP.MD` if new docs need to be discoverable.
5. Keep diffs small and avoid copy/paste code blocks.

## Guardrails
- Do not paste secrets, tokens, or user emails.
- Prefer referencing file paths over embedding long code.
- If behavior is uncertain, mark TODO and ask the user rather than guessing.

## Expected Outputs
- Updated `info_*.md` / `SKILL.md` near the code.
- Updated `developer/APP_MAP.MD` pointers when needed.
