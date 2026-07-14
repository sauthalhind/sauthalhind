import { createNews, listNews } from '@/lib/news-store';

export async function GET() {
  const result = await listNews();

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  return Response.json({ ok: true, items: result.items, source: result.source });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.title || !payload.slug || !payload.category) {
    return Response.json({ ok: false, error: 'title, slug, and category are required' }, { status: 400 });
  }

  const result = await createNews({
    title: String(payload.title),
    slug: String(payload.slug),
    author: String(payload.author ?? 'Editorial'),
    category: String(payload.category),
    body: String(payload.body ?? ''),
    status: (payload.status ?? 'draft') as 'draft' | 'published' | 'review' | 'scheduled'
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  return Response.json({ ok: true, item: result.item }, { status: 201 });
}
