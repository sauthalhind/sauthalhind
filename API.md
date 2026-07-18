# API

## `/api/news`

### GET

- Returns news items from Supabase
- Response shape:

```json
{ "ok": true, "items": [], "source": "supabase" }
```

### POST

- Creates a news item
- Required fields:
  - `title`
  - `slug`
  - `category`
- Optional fields:
  - `author`
  - `body`
  - `cover_image`
  - `status`

### PATCH

- Updates an existing news item
- Requires `id`

### DELETE

- Deletes a news item by query param `id`

## `/api/upload`

- Accepts multipart form data
- Uploads selected files to Supabase Storage
- Returns public URLs

## `/api/debug`

- Reports whether Supabase is configured
- Returns current news source and count

## `/api/health`

- Lightweight health check endpoint

## Notes

- The UI uses these routes directly.
- Any data model change must be reflected in both admin and homepage flows.