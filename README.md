# Sawt Al-Hind News

Arabic news portal built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

## Quick start

```bash
npm install
npm run dev
```

## What this project includes

- RTL-first public newsroom
- Admin CMS for stories, categories, media, and workflow
- Supabase-backed API routes for news and uploads
- SEO pages, sitemap, robots, RSS/feed support
- Live refresh between admin and homepage

## Documentation

- [AI_CONTEXT.md](./AI_CONTEXT.md)
- [AGENTS.md](./AGENTS.md)
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [FEATURES.md](./FEATURES.md)
- [API.md](./API.md)
- [DATABASE.md](./DATABASE.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [.env.example](./.env.example)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

## Notes

- The public homepage reads live published news from Supabase and refreshes automatically.
- The admin panel persists a browser cache for resilience and also writes to Supabase when configured.