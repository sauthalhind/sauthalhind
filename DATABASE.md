# Database

## Supabase setup

- The app uses Supabase for news content and uploads.
- Server-side access uses the service role key.
- Client-side access uses the anon/publishable key.

## Expected news table

`news`

Recommended columns:

- `id` uuid or text primary key
- `title` text
- `slug` text unique
- `author` text
- `category` text
- `body` text
- `cover_image` text nullable
- `status` text (`draft`, `published`, `review`, `scheduled`)
- `created_at` timestamptz

## Storage

- Bucket name used by the app: `news-media`
- Uploaded images should be public so the homepage can render them

## Behavior

- Homepage should show only `published` stories
- Admin may still keep drafts locally for editing workflow
- When Supabase is unavailable, the app can fall back to local browser cache or seed data

## Troubleshooting

- If homepage shows fallback, check:
  - env vars
  - `news` table exists
  - `published` rows exist
  - bucket permissions for uploads
  - row level security policies