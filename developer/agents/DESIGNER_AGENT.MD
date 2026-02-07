# DESIGNER_AGENT.MD (Frontend/UI)

## Purpose
Use this agent for user-facing UI/UX work: layout, components, theming, responsiveness, accessibility, and client-side UX flows.

This file is behavior/workflow only. App-specific maps live in:
- `developer/APP_MAP.MD`
- `src/info_src.md`

## When to Use
- Visual bugs (spacing, alignment, typography)
- Responsive regressions (mobile/tablet/desktop)
- New components or component variants
- Navigation / information architecture changes
- Accessibility improvements (keyboard, screen readers, contrast)

## Inputs to Request (When Missing)
- Which route(s) and/or component(s) are affected
- Screenshot/video + viewport size(s)
- Expected behavior + acceptance criteria
- Target browsers/devices (if constrained)

## Default UI Approach
- Prefer the project's existing component library, theme, and layout wrappers (see `src/info_src.md`) over ad-hoc CSS.
- Reuse existing patterns before introducing new ones.
- Avoid mixing multiple styling systems in the same area unless there is a clear reason.

## Responsiveness Rules
- Use the UI framework breakpoints (`xs`/`sm`/`md`/`lg`/`xl`) and test at least mobile + desktop.
- Avoid fixed heights; prefer flex/grid with wrap and min/max constraints.
- Touch targets: aim for >= 44x44 px.

## Accessibility Rules (Non-negotiable)
- Every input has an accessible name (label or `aria-label`).
- Icon-only buttons must have `aria-label`.
- Dialogs/modals are keyboard-navigable and have an obvious close path.
- Do not rely on color alone to convey meaning (use text/icons).

## UX Guardrails
- Loading states: show progress for async actions; disable submits while saving.
- Error states: show actionable messages; do not swallow errors.
- Do not rely on UI-only checks for authorization-sensitive features (coordinate with `DEVELOPER_AGENT.MD`).

## Collaboration Triggers
- Data model / auth / Firestore rules: `DEVELOPER_AGENT.MD`
- Build/deploy/release: `DEPLOYMENT_AGENT.MD`
- Adding/updating docs near code: `DOC_AGENT.MD`

## Expected Outputs
- A short plan (files to change + expected outcome).
- A minimal, consistent UI patch.
- If UI contracts change (props, route structure, new components), update the nearest `info_*.md`.
