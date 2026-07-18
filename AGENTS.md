# AGENTS.md

## How to work on this repository

1. Read the current route/component structure first.
2. Check `src/app/admin/page.tsx`, `src/components/homepage-client.tsx`, `src/lib/news-store.ts`, and `src/lib/supabase.ts` before changing behavior.
3. Prefer targeted fixes over visual rewrites unless the user explicitly asks for a redesign.
4. Keep the public site and admin CMS in sync through `/api/news`.
5. Verify with `npm run build` before pushing.

## Coding style

- TypeScript first
- Functional React components
- Use App Router patterns
- Keep Tailwind class usage consistent with the existing design system

## Do not

- Hardcode secrets
- Remove live routes that already work
- Replace Supabase integrations with mock data unless the user explicitly asks for offline mode
- Break RTL layout

## Recommended workflow

- Inspect files
- Make a small patch
- Build
- Test the browser flow
- Commit and push