type NewsItem = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  status: 'draft' | 'published' | 'review' | 'scheduled';
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __newsStore: NewsItem[] | undefined;
}

const store = globalThis.__newsStore ?? [];
globalThis.__newsStore = store;

export async function GET() {
  return Response.json({ ok: true, items: store.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<NewsItem>;

  if (!payload.title || !payload.slug || !payload.category) {
    return Response.json({ ok: false, error: 'title, slug, and category are required' }, { status: 400 });
  }

  const item: NewsItem = {
    id: crypto.randomUUID(),
    title: payload.title,
    slug: payload.slug,
    author: payload.author ?? 'Editorial',
    category: payload.category,
    body: payload.body ?? '',
    status: payload.status ?? 'draft',
    createdAt: new Date().toISOString()
  };

  store.unshift(item);

  return Response.json({ ok: true, item }, { status: 201 });
}
