import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Arabic News Portal',
  description: 'Clean Arabic news portal shell ready for live content.',
  alternates: { canonical: '/' }
};

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b border-black/8 pb-3">
      <h2 className="font-headline-md text-[20px] font-semibold tracking-[-0.01em] text-brand-onSurface">{title}</h2>
      {action ? <span className="text-sm font-medium text-brand-primary">{action}</span> : null}
    </div>
  );
}

export default async function HomePage() {
  const newsResult = await listNews();
  const publishedNews = newsResult.ok ? newsResult.items.filter((item) => item.status === 'published') : [];
  const liveNews = (publishedNews.length > 0 ? publishedNews : newsResult.ok ? newsResult.items : []).slice(0, 6);
  const heroStory = liveNews[0];
  const latestNews = liveNews.slice(1, 5);
  const categories = Array.from(new Set(liveNews.map((item) => item.category))).slice(0, 6);

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurfaceVariant shadow-sm sm:hidden">Menu</button>
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-12 w-12 object-contain shadow-sm" />
              <div>
                <div className="font-headline-md text-[18px] font-semibold tracking-[-0.02em] text-brand-primary sm:text-[22px]">جريدة صوت الهند</div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/35">Sawt Al-Hind News</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/en" className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm font-medium text-brand-onSurfaceVariant shadow-sm">EN</Link>
              <Link href="/search" aria-label="Search" className="rounded-full border border-black/8 bg-white p-2 text-brand-onSurfaceVariant shadow-sm">⌕</Link>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-6 sm:py-8 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.06)] sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">Live newsroom shell</div>
            {heroStory?.cover_image ? (
              <div className="mt-4 overflow-hidden rounded-[26px] border border-black/6 bg-black/5">
                <img src={heroStory.cover_image} alt={heroStory.title} className="h-64 w-full object-cover sm:h-80" />
              </div>
            ) : null}
            <h1 className="mt-3 max-w-2xl font-headline-xl-mobile text-[30px] leading-[1.28] tracking-[-0.03em] text-brand-onSurface sm:text-[42px] sm:leading-[1.15]">
              {heroStory?.title ?? 'Publish your first live story from the admin portal'}
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-brand-onSurfaceVariant sm:text-[18px]">
              {heroStory
                ? heroStory.body || 'Latest story loaded from Supabase and ready for your audience.'
                : 'No live news yet. After publishing from admin, the latest story will show here automatically.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Add live news</Link>
              <Link href="/admin" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Connect CMS</Link>
            </div>
          </div>

          <aside className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.06)] sm:p-8">
            <SectionTitle title="Trending" action={liveNews.length > 0 ? 'Live' : 'Empty'} />
            {liveNews.length > 0 ? (
              <div className="space-y-3">
                {liveNews.slice(0, 3).map((item, index) => (
                  <div key={item.id} className="rounded-[22px] border border-black/8 bg-brand-surfaceLow p-4">
                    <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                    {item.cover_image ? <img src={item.cover_image} alt={item.title} className="mt-3 h-28 w-full rounded-2xl object-cover" /> : null}
                    <div className="mt-1 text-[15px] font-semibold leading-7 text-brand-onSurface">{item.title}</div>
                    <div className="mt-1 text-xs text-brand-onSurfaceVariant">#{index + 1}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">
                No trending stories yet. Publish your first article to populate this rail.
              </div>
            )}
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="Latest news" action={latestNews.length > 0 ? 'Live' : 'Empty'} />
            {latestNews.length > 0 ? (
              <div className="space-y-3">
                {latestNews.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-black/8 p-4">
                    <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                    {item.cover_image ? <img src={item.cover_image} alt={item.title} className="mt-3 h-24 w-full rounded-2xl object-cover" /> : null}
                    <div className="mt-1 text-[15px] font-semibold leading-7 text-brand-onSurface">{item.title}</div>
                    <div className="mt-1 text-xs text-brand-onSurfaceVariant">{item.status} • {item.created_at}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">
                No live news items yet. Use the admin portal to publish your first article.
              </div>
            )}
          </div>

          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="Categories" action={categories.length > 0 ? 'Live' : 'Empty'} />
            {categories.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((item) => (
                  <div key={item} className="rounded-[22px] border border-dashed border-black/10 bg-brand-surfaceLow p-4">
                    <div className="text-sm font-semibold text-brand-onSurface">{item}</div>
                    <div className="mt-1 text-xs text-brand-onSurfaceVariant">Connected to live posts</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">
                Categories will appear automatically after publishing news.
              </div>
            )}
          </div>
        </section>
      </Container>

      <footer className="mt-8 border-t border-black/6 bg-white">
        <Container className="py-8">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-12 w-12 object-contain" />
                <div className="font-headline-md text-[22px] font-semibold text-brand-primary">جريدة صوت الهند</div>
              </div>
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-onSurfaceVariant">
                Live news portal connected to Supabase. Publish articles from the admin portal and they appear here.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-onSurface">Quick links</div>
              <div className="mt-3 space-y-2 text-sm text-brand-onSurfaceVariant">
                <div>About</div>
                <div>Privacy</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-onSurface">Newsletter</div>
              <div className="mt-3 flex gap-2">
                <input className="w-full rounded-full border border-black/8 bg-white px-4 py-3 text-sm outline-none" placeholder="Your email" />
                <button className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Subscribe</button>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
