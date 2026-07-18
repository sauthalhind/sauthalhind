# Project Structure

## Root

- `src/` application source
- `public/` static assets
- `.env.local` local secrets
- `.env.example` sample environment file
- `README.md` top-level overview

## `src/app`

- `page.tsx` public homepage wrapper
- `admin/page.tsx` admin CMS
- `news/[slug]/page.tsx` article detail page
- `category/[slug]/page.tsx` category page
- `search/page.tsx` search page
- `en/page.tsx` English landing page
- `api/news/route.ts` news CRUD API
- `api/upload/route.ts` upload API
- `api/debug/route.ts` diagnostics API
- `feed.xml/route.ts` feed output
- `robots.ts` robots file
- `sitemap.ts` sitemap generator

## `src/components`

- `homepage-client.tsx` live homepage UI
- `share-bar.tsx` social sharing actions
- `ui.tsx` small shared UI helpers

## `src/lib`

- `supabase.ts` Supabase client creation
- `news-store.ts` database access helpers
- `cn.ts` className utility

## `src/data`

- `site.ts` editorial text, sample content, and navigation data

## Static assets

- `public/sauthalhind.png` site logo