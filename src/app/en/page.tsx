import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Sawt Al-Hind News | English',
  description: 'English view of the news portal.',
  alternates: { canonical: '/en' }
};

export default async function EnglishHome() {
  const result = await listNews();
  const news = result.ok ? result.items.filter((item) => item.status === 'published').slice(0, 5) : [];

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <header className="border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-12 w-12 object-contain" />
              <div>
                <div className="font-headline-md text-[18px] font-semibold tracking-[-0.02em] text-brand-primary sm:text-[22px]">Sawt Al-Hind News</div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/35">English edition</div>
              </div>
            </div>
            <Link href="/" className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold">AR</Link>
          </div>
        </Container>
      </header>
      <Container className="py-8">
        <h1 className="text-4xl font-bold tracking-[-0.03em]">English news view</h1>
        <p className="mt-3 max-w-2xl text-brand-onSurfaceVariant">This is the English landing page for your portal. Published Arabic news still appears here as live content.</p>
        <div className="mt-6 space-y-3">
          {news.length > 0 ? news.map((item) => (
            <article key={item.id} className="rounded-[24px] border border-black/8 bg-white p-5">
              <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
              <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-brand-onSurfaceVariant">{item.body || 'Live story from Supabase.'}</p>
            </article>
          )) : (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-white p-5 text-sm text-brand-onSurfaceVariant">No published stories yet.</div>
          )}
        </div>
      </Container>
    </main>
  );
}
