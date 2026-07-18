# AI Context

This file is the fast handoff summary for future AI tools.

## Product goal

Build a professional Arabic news portal similar in feel to large regional news sites, with a strong mobile-first public homepage and a usable admin CMS.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase for storage and database

## Important routes

- `/` public homepage
- `/admin` newsroom CMS
- `/news/[slug]` article page
- `/category/[slug]` category page
- `/search` search page
- `/en` English landing page
- `/about`, `/contact`, `/privacy`, `/terms`

## Data flow

- Admin saves to `/api/news`
- Homepage reads from `/api/news`
- Uploads go through `/api/upload`
- Debug endpoint: `/api/debug`

## Important behavior

- Published stories are what should appear on the homepage.
- Drafts should stay in admin only.
- Admin and homepage both use a local cache for resilience, but Supabase is the long-term source of truth.
- Any new work should preserve RTL layout and the existing visual language.

## Working notes for future AI

- Do not rebuild the app from scratch.
- Keep current routes and reuse existing components.
- Prefer small targeted patches over broad rewrites.
- Preserve live refresh behavior between admin and homepage.