# `scripts/` - Build/SEO Scripts

## Purpose
Document build-time scripts and deployment-adjacent config that lives in the repository.

## Script Index
- `scripts/generate-sitemap.js`: generates `public/sitemap.xml` and `public/robots.txt`.

## `scripts/generate-sitemap.js`
What it does:
- Generates an XML sitemap for a fixed set of routes.
- Adds language alternates via `?lang=<code>` for each route.
- Writes outputs into `public/`:
  - `public/sitemap.xml`
  - `public/robots.txt`

How it runs:
- `package.json` runs it as `prebuild` (and also via `npm run generate-sitemap`).
- The script is designed to be non-blocking:
  - it catches errors internally
  - the npm script is `node scripts/generate-sitemap.js || exit 0`

When to update it:
- Add/remove top-level routes from the sitemap route list.
- Change the base domain used in `<loc>` / `Sitemap:` lines.
- Add/remove supported languages in the alternates list.

## SPA routing / host rewrites (Pointers)
PokerPal uses client-side routing, so hosting must rewrite unknown paths to `index.html`.

Configs currently in the repo:
- `vercel.json`: Vercel rewrites for SPA routing (and response headers).
- `public/_redirects`: Netlify-style rewrite rule.
- `.github/workflows/deploy.yml`: GitHub Pages deploy (builds and publishes `build/`).
- `vercel-build.sh`: Vercel build helper script (builds and copies `public/images` into `build/images`).

Keep the source of truth for the exact current settings in those files. This doc is a map + intent.

