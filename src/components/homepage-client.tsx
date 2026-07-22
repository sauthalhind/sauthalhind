"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/ui';
import { translateCategory } from '@/lib/news-store';

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
    });

    return Array.from(map.values()).slice(0, 12);
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
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'جريدة صوت الهند | Sawt Al-Hind News',
              alternateName: 'Sawt Al-Hind',
              url: 'https://sauthalhind.com',
              logo: 'https://sauthalhind.com/sauthalhind.png',
              sameAs: [
                'https://www.facebook.com/sawtalhind',
                'https://twitter.com/sawtalhind'
              ],
              publishingPrinciples: 'https://sauthalhind.com/about',
              unnamedSourcesPolicy: 'https://sauthalhind.com/privacy'
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'جريدة صوت الهند',
              url: 'https://sauthalhind.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://sauthalhind.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }
          ])
        }}
      />
      
      {/* BBC Arabic Style Red Header Banner */}
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-10 w-10 brightness-0 invert" />
              <div>
                <span className="font-bold text-xl sm:text-2xl tracking-tight">جريدة صوت الهند</span>
                <span className="text-[10px] opacity-75 mr-2 tracking-widest hidden sm:inline uppercase">Sawt Al-Hind News</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/en" className="hover:bg-white/10 px-3 py-1.5 rounded transition">English</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Navigation Ribbon */}
      <div className="bg-[#901414] text-white sticky top-0 z-50 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 overflow-x-auto py-3 text-sm font-semibold whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-gray-200 border-b-2 border-white pb-0.5">الرئيسية</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className="hover:text-gray-200 opacity-90 hover:opacity-100 transition"
              >
                {translateCategory(cat)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {news.length > 0 && (
        <div className="border-b border-black/5 bg-[#ffebeb] text-[#bb1919] py-2.5 overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <span className="shrink-0 bg-[#bb1919] text-white font-bold text-xs px-3 py-1 rounded flex items-center gap-1.5 shadow-sm animate-pulse">
              عاجل
            </span>
            <div className="relative overflow-hidden w-full h-5" dir="ltr">
              <div className="absolute flex gap-12 whitespace-nowrap animate-ticker-rtl hover:[animation-play-state:paused] -right-full">
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-sm transition flex items-center gap-2"
                  >
                    <span className="text-[#bb1919]">✦</span>
                    <span dir="rtl">{item.title}</span>
                  </Link>
                ))}
                {/* Repeat to loop seamlessly */}
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-dup-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-sm transition flex items-center gap-2"
                  >
                    <span className="text-[#bb1919]">✦</span>
                    <span dir="rtl">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main BBC Arabic Style Grid Layout */}
      <Container className="py-6 sm:py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          
          {/* Main Content Area (Right Side) */}
          <div className="space-y-8">
            
            {/* Hero Main Story Card */}
            {heroStory ? (
              <div className="bg-white border border-black/5 p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                <div className="text-xs font-bold text-[#bb1919] mb-2">{translateCategory(heroStory.category)}</div>
                {heroStory.cover_image ? (
                  <div className="overflow-hidden bg-black/5 mb-4">
                    <img
                      src={heroStory.cover_image}
                      alt={heroStory.title}
                      className="h-64 w-full object-cover sm:h-96 transition duration-500 hover:scale-105"
                    />
                  </div>
                ) : null}
                <Link href={`/news/${heroStory.slug}`} className="block group">
                  <h1 className="font-bold text-[24px] sm:text-[34px] leading-tight text-gray-900 group-hover:text-[#bb1919] transition">
                    {heroStory.title}
                  </h1>
                </Link>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                  {heroStory.body ? heroStory.body.slice(0, 240) + '...' : 'اقرأ تفاصيل الخبر كاملة لمعرفة آخر المستجدات والتغطيات الحية.'}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>بواسطة: {heroStory.author || 'التحرير'}</span>
                  <span>المصدر: {sourceLabel === 'fallback' ? 'أرشيف صوت الهند' : 'تغطية حية'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 border border-dashed border-gray-300 text-center text-gray-500">
                لا توجد أخبار منشورة حالياً في الصفحة الرئيسية.
              </div>
            )}

            {/* Secondary Stories Grid */}
            {latestNews.length > 0 && (
              <div>
                <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                  <h2 className="text-lg font-bold text-gray-900">آخر التغطيات والتقارير</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {latestNews.map((item) => (
                    <div key={item.id} className="bg-white border border-black/5 p-4 shadow-sm hover:shadow transition flex flex-col justify-between">
                      <div>
                        {item.cover_image ? (
                          <div className="overflow-hidden mb-3">
                            <img src={item.cover_image} alt={item.title} className="h-40 w-full object-cover" />
                          </div>
                        ) : null}
                        <div className="text-[11px] font-bold text-[#bb1919] mb-1">{translateCategory(item.category)}</div>
                        <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] transition">
                          <h3 className="font-bold text-base leading-snug text-gray-900 line-clamp-3">
                            {item.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (Left Side) */}
          <div className="space-y-8">
            
            {/* Trending / Most Read Widget */}
            <div className="bg-white border border-black/5 p-5 shadow-sm">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#bb1919] animate-ping"></span>
                  أهم الأخبار
                </h2>
              </div>
              
              {news.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {news.slice(0, 5).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0">
                      <span className="text-[36px] font-bold leading-none text-[#bb1919]/20 font-serif">
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-[#bb1919]">{translateCategory(item.category)}</div>
                        <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] font-semibold text-xs sm:text-sm text-gray-800 leading-snug block transition">
                          {item.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">لا تتوفر إحصائيات القراءة حالياً.</p>
              )}
            </div>

            {/* Department Tags Category Map */}
            <div className="bg-white border border-black/5 p-5 shadow-sm">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-base font-bold text-gray-900">الأقسام الإخبارية</h2>
              </div>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${encodeURIComponent(item)}`}
                      className="px-3 py-1.5 bg-[#f6f6f6] hover:bg-[#bb1919] hover:text-white transition text-xs font-semibold text-gray-700"
                    >
                      {translateCategory(item)}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">سيتم رصد الأقسام بمجرد نشر مقالات جديدة.</p>
              )}
            </div>
          </div>
          
        </div>
      </Container>

      {/* Premium Footer */}
      <footer className="border-t-4 border-[#bb1919] bg-[#0f1d25] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-10 w-10 brightness-0 invert" />
                <span className="font-bold text-xl">صوت الهند إخبارية</span>
              </div>
              <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-gray-400">
                منصة صوت الهند الإخبارية تقدم تغطية إخبارية مستقلة ومباشرة على مدار الساعة للأحداث والقضايا الثقافية والسياسية في شبه القارة الهندية والعالم العربي.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-white mb-3">شروط الاستخدام</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition">سياسة الخصوصية</Link></li>
                <li><Link href="/" className="hover:text-white transition">من نحن</Link></li>
                <li><Link href="/" className="hover:text-white transition">اتصل بنا</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3">الاشتراك الإخباري</h3>
              <p className="text-xs text-gray-400 mb-3">اشترك في القائمة البريدية لتلقي آخر العناوين العاجلة.</p>
              <div className="flex gap-2">
                <input
                  className="w-full bg-[#1b2f3a] text-white px-3.5 py-2 text-xs outline-none border border-transparent focus:border-[#bb1919]"
                  placeholder="البريد الإلكتروني"
                />
                <button className="bg-[#bb1919] hover:bg-[#901414] px-4 py-2 text-xs font-bold transition text-white">
                  اشترك
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-[11px] text-gray-500">
            &copy; {new Date().getFullYear()} صوت الهند. جميع الحقوق محفوظة. لا يجوز إعادة نشر المواد دون إذن مسبق.
          </div>
        </div>
      </footer>
    </main>
  );
}