"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/ui';

type NewsItem = {
  id: string;
  title: string;
  slug?: string;
  category: string;
  status: string;
  created_at: string;
  cover_image?: string | null;
  body?: string;
  author?: string;
};

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b border-black/8 pb-3">
      <h2 className="font-headline-md text-[20px] font-semibold tracking-[-0.01em] text-brand-onSurface">{title}</h2>
      {action ? <span className="text-sm font-medium text-brand-primary">{action}</span> : null}
    </div>
  );
}

function normalizeNewsItem(item: NewsItem) {
  return { ...item, slug: item.slug ?? item.title.toLowerCase().replace(/\s+/g, '-') };
}
const localNewsKey = 'sawt-al-hind-admin-news';

function readLocalNews(): NewsItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(localNewsKey) ?? '[]') as NewsItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HomePageClient() {
  const [apiNews, setApiNews] = useState<NewsItem[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [sourceState, setSourceState] = useState<'loading' | 'supabase' | 'fallback' | 'error'>('loading');
  const [message, setMessage] = useState('Loading live newsroom...');
  const [lastSync, setLastSync] = useState('');

  useEffect(() => {
    const syncLocal = () => setLocalNews(readLocalNews());
    syncLocal();
    window.addEventListener('storage', syncLocal);
    const interval = window.setInterval(syncLocal, 2000);
    return () => {
      window.removeEventListener('storage', syncLocal);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        const response = await fetch('/api/news', { cache: 'no-store' });
        const result = (await response.json()) as
          | { ok: true; items: NewsItem[]; source?: string }
          | { ok: false; error?: string };

        if (!mounted) return;

        if (response.ok && result.ok) {
          const published = result.items.map(normalizeNewsItem).filter((item) => item.status === 'published');
          setApiNews(published);
          setSourceState(result.source === 'fallback' ? 'fallback' : 'supabase');
          setMessage(result.source === 'fallback' ? 'Using fallback data' : 'Connected to Supabase live data');
          setLastSync(new Date().toISOString());
        } else {
          setApiNews([]);
          setSourceState('fallback');
          setMessage('No published stories available yet');
        }
      } catch {
        if (!mounted) return;
        setApiNews([]);
        setSourceState('error');
        setMessage('Unable to load live news');
      }
    };

    const refresh = () => void loadNews();
    const interval = window.setInterval(refresh, 15000);
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sawt-al-hind-news') : null;

    window.addEventListener('news-updated', refresh as EventListener);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    channel?.addEventListener('message', refresh as EventListener);

    refresh();

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener('news-updated', refresh as EventListener);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      channel?.removeEventListener('message', refresh as EventListener);
      channel?.close();
    };
  }, []);

  const news = useMemo(() => {
    const publishedApi = apiNews.filter((item) => item.status === 'published');
    const publishedLocal = localNews.filter((item) => item.status === 'published');
    const map = new Map<string, NewsItem>();

    [...publishedApi, ...publishedLocal].forEach((item) => {
      map.set(item.id, item);
      if (item.slug) {
        map.set(item.slug, item);
      }
    });

    return Array.from(map.values()).filter((item) => item.id === map.get(item.id)?.id).slice(0, 12);
  }, [apiNews, localNews]);

  const heroStory = news[0];
  const latestNews = news.slice(1, 5);
  const categories = Array.from(new Set(news.map((item) => item.category))).slice(0, 6);

  const sourceLabel = useMemo(() => {
    if (sourceState === 'loading') return 'loading';
    if (sourceState === 'supabase') return 'supabase';
    if (sourceState === 'fallback') return 'fallback';
    return 'error';
  }, [sourceState]);

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'جريدة صوت الهند | Sawt Al-Hind News',
              alternateName: 'Sawt Al-Hind',
              url: 'https://sawtalhind.news',
              logo: 'https://sawtalhind.news/sauthalhind.png',
              sameAs: [
                'https://www.facebook.com/sawtalhind',
                'https://twitter.com/sawtalhind'
              ],
              publishingPrinciples: 'https://sawtalhind.news/about',
              unnamedSourcesPolicy: 'https://sawtalhind.news/privacy'
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'جريدة صوت الهند',
              url: 'https://sawtalhind.news',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://sawtalhind.news/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }
          ])
        }}
      />
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

      {/* Breaking News Ticker */}
      {news.length > 0 && (
        <div className="border-b border-brand-primary/10 bg-brand-primary text-white py-2.5 overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <span className="shrink-0 bg-gold text-brand-onSurface font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              عاجل
            </span>
            <div className="relative overflow-hidden w-full h-5" dir="ltr">
              <div className="absolute flex gap-12 whitespace-nowrap animate-ticker-rtl hover:[animation-play-state:paused] -right-full">
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:text-gold font-medium text-sm transition flex items-center gap-2"
                  >
                    <span className="text-gold">✦</span>
                    <span dir="rtl">{item.title}</span>
                  </Link>
                ))}
                {/* Repeat to loop seamlessly */}
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-dup-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:text-gold font-medium text-sm transition flex items-center gap-2"
                  >
                    <span className="text-gold">✦</span>
                    <span dir="rtl">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Container className="py-6 sm:py-8 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.06)] sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">Live newsroom shell</div>
            <div className="mt-2 inline-flex rounded-full bg-brand-surfaceLow px-3 py-1 text-xs font-semibold text-brand-onSurfaceVariant">Data source: {sourceLabel}</div>
            <p className="mt-2 text-xs text-brand-onSurfaceVariant">{message}</p>
            {lastSync ? <p className="mt-1 text-[11px] text-black/40">Last sync: {lastSync}</p> : null}
            {heroStory?.cover_image ? (
              <div className="mt-4 overflow-hidden rounded-[26px] border border-black/6 bg-black/5">
                <img src={heroStory.cover_image} alt={heroStory.title} className="h-64 w-full object-cover sm:h-80" />
              </div>
            ) : null}
            <h1 className="mt-3 max-w-2xl font-headline-xl-mobile text-[30px] leading-[1.28] tracking-[-0.03em] text-brand-onSurface sm:text-[42px] sm:leading-[1.15]">{heroStory?.title ?? 'Publish your first live story from the admin portal'}</h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-brand-onSurfaceVariant sm:text-[18px]">
              {heroStory ? heroStory.body || 'Latest story loaded from Supabase and ready for your audience.' : 'No live news yet. After publishing from admin, the latest story will show here automatically.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">Add live news</Link>
              <Link href="/admin" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Connect CMS</Link>
            </div>
          </div>

          <aside className="rounded-[32px] border border-black/6 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.06)] sm:p-8">
            <SectionTitle title="Trending" action={news.length > 0 ? 'Live' : 'Empty'} />
            {news.length > 0 ? (
              <div className="space-y-3">
                {news.slice(0, 3).map((item, index) => (
                  <div key={`${item.id}-${index}`} className="rounded-[22px] border border-black/8 bg-brand-surfaceLow p-4">
                    <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                    {item.cover_image ? <img src={item.cover_image} alt={item.title} className="mt-3 h-28 w-full rounded-2xl object-cover" /> : null}
                    <div className="mt-1 text-[15px] font-semibold leading-7 text-brand-onSurface">{item.title}</div>
                    <div className="mt-1 text-xs text-brand-onSurfaceVariant">#{index + 1}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">No trending stories yet. Publish your first article to populate this rail.</div>
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
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">No live news items yet. Use the admin portal to publish your first article.</div>
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
              <div className="rounded-[26px] border border-dashed border-black/10 bg-white p-6 text-sm text-brand-onSurfaceVariant">Categories will appear automatically after publishing news.</div>
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
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-onSurfaceVariant">Live news portal connected to Supabase. Publish articles from the admin portal and they appear here.</p>
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