import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Search | Sawt Al-Hind News',
  description: 'Search live news articles.',
  alternates: { canonical: '/search' }
};

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string | string[] }> }) {
  const params = (await searchParams) ?? {};
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? '').trim().toLowerCase();
  const result = await listNews();
  const items = result.ok ? result.items.filter((item) => item.status === 'published') : [];
  const filtered = query ? items.filter((item) => `${item.title} ${item.category} ${item.body}`.toLowerCase().includes(query)) : items.slice(0, 20);

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <Container className="py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.03em]">Search news</h1>
            <p className="mt-2 text-brand-onSurfaceVariant">Search your published stories.</p>
          </div>
          <Link href="/" className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold">Home</Link>
        </div>

        <form className="mt-6 flex gap-2">
          <input name="q" defaultValue={query} className="w-full rounded-full border border-black/8 bg-white px-4 py-3 outline-none" placeholder="Search titles, categories, stories..." />
          <button className="rounded-full bg-brand-primary px-5 py-3 font-semibold text-white">Search</button>
        </form>

        <div className="mt-6 space-y-3">
          {filtered.length > 0 ? filtered.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="block rounded-[24px] border border-black/8 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
              <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-brand-onSurfaceVariant">{item.body || 'Live story from Supabase.'}</p>
            </Link>
          )) : (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-white p-5 text-sm text-brand-onSurfaceVariant">No matching news found.</div>
          )}
        </div>
      </Container>
    </main>
  );
}
