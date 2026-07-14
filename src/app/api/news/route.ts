import { createNews, deleteNews, listNews, updateNews } from '@/lib/news-store';

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
    cover_image: typeof payload.cover_image === 'string' ? payload.cover_image : null,
    status: (payload.status ?? 'draft') as 'draft' | 'published' | 'review' | 'scheduled'
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  return Response.json({ ok: true, item: result.item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = await request.json();

  if (!payload.id) {
    return Response.json({ ok: false, error: 'id is required' }, { status: 400 });
  }

  const result = await updateNews({
    id: String(payload.id),
    title: typeof payload.title === 'string' ? String(payload.title) : undefined,
    slug: typeof payload.slug === 'string' ? String(payload.slug) : undefined,
    author: typeof payload.author === 'string' ? String(payload.author) : undefined,
    category: typeof payload.category === 'string' ? String(payload.category) : undefined,
    body: typeof payload.body === 'string' ? String(payload.body) : undefined,
    cover_image: typeof payload.cover_image === 'string' ? payload.cover_image : payload.cover_image === null ? null : undefined,
    status: (payload.status ?? undefined) as 'draft' | 'published' | 'review' | 'scheduled' | undefined
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  return Response.json({ ok: true, item: result.item });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return Response.json({ ok: false, error: 'id is required' }, { status: 400 });
  }

  const result = await deleteNews(id);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 500 });
  }

  return Response.json({ ok: true });
}
