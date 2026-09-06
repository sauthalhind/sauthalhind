"use client";

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import { translateCategory, getArticleExcerpt, SEED_NEWS } from '@/lib/news-store';

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

const localNewsKey = 'sawt-al-hind-admin-news';

function readLocalNews(): NewsItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(localNewsKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HomePageClient({ news: initialNews = [] }: { news?: NewsItem[] }) {
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [apiNews, setApiNews] = useState<NewsItem[]>(initialNews.length > 0 ? initialNews : SEED_NEWS);

  // Sync with browser localStorage and live updates
  useEffect(() => {
    const syncLocal = () => {
      const items = readLocalNews();
      setLocalNews(items.filter((item) => item.status === 'published' || !item.status));
    };
    syncLocal();

    window.addEventListener('storage', syncLocal);
    window.addEventListener('news-updated', syncLocal);

    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sawt-al-hind-news') : null;
    channel?.addEventListener('message', syncLocal);

    // Also poll /api/news to catch freshly published news from server
    const pollApi = async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
            setApiNews(data.items.filter((i: NewsItem) => i.status === 'published'));
          }
        }
      } catch {
        // ignore
      }
    };
    pollApi();
    const interval = window.setInterval(pollApi, 10000);

    return () => {
      window.removeEventListener('storage', syncLocal);
      window.removeEventListener('news-updated', syncLocal);
      channel?.close();
      window.clearInterval(interval);
    };
  }, []);

  // Compute merged news: local admin-created articles + server articles + fallback seed articles
  const news = useMemo(() => {
    const map = new Map<string, NewsItem>();

    // Add API/Server news first
    apiNews.forEach((item) => {
      map.set(item.slug || item.id, item);
    });

    // Then overlay/prepend local user-created news from admin
    localNews.forEach((item) => {
      map.set(item.slug || item.id, item);
    });

    const list = Array.from(map.values());
    if (list.length === 0) {
      return SEED_NEWS;
    }

    list.sort((a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime());
    return list;
  }, [apiNews, localNews]);

  const heroStory = news[0];
  const latestNews = news.slice(1, 5);

  // Extract categories with reliable defaults
  const categories = useMemo(() => {
    const extracted = Array.from(new Set(news.map((item) => item.category).filter(Boolean)));
    const defaults = ['Breaking News', 'World', 'Economy', 'Culture', 'Sports', 'Religion'];
    return Array.from(new Set([...extracted, ...defaults])).slice(0, 7);
  }, [news]);

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'جريدة صوت الهند | Sauthalhind',
              alternateName: 'Sauthalhind',
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
      
      {/* Unified Responsive Header */}
      <Header categories={categories} />

      {/* Breaking News Ticker */}
      {news.length > 0 && (
        <div className="border-b border-black/5 bg-[#ffebeb] text-[#bb1919] py-2 sm:py-2.5 overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
            <span className="shrink-0 bg-[#bb1919] text-white font-bold text-xs px-2.5 sm:px-3 py-1 rounded flex items-center gap-1.5 shadow-sm animate-pulse">
              عاجل
            </span>
            <div className="relative overflow-hidden w-full min-h-[24px] flex items-center" dir="ltr">
              <div className="absolute flex gap-8 sm:gap-12 whitespace-nowrap animate-ticker-rtl hover:[animation-play-state:paused] active:[animation-play-state:paused] -right-full">
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <span className="text-[#bb1919]">✦</span>
                    <span dir="auto">{item.title}</span>
                  </Link>
                ))}
                {/* Repeat to loop seamlessly */}
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-dup-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <span className="text-[#bb1919]">✦</span>
                    <span dir="auto">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main BBC Arabic Style Grid Layout */}
      <Container className="py-5 sm:py-8 lg:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
          
          {/* Main Content Area (Right Side) */}
          <div className="space-y-6 sm:space-y-8 min-w-0">
            
            {/* Hero Main Story Card */}
            {heroStory ? (
              <article className="bg-white border border-black/5 p-4 sm:p-6 shadow-sm hover:shadow-md transition rounded-sm overflow-hidden">
                <div className="text-xs font-bold text-[#bb1919] mb-2">{translateCategory(heroStory.category)}</div>
                {heroStory.cover_image ? (
                  <div className="overflow-hidden bg-black/5 mb-4 rounded-sm">
                    <img
                      src={heroStory.cover_image}
                      alt={heroStory.title}
                      className="aspect-video sm:aspect-[16/9] w-full max-h-[460px] object-cover transition duration-500 hover:scale-105"
                      loading="eager"
                    />
                  </div>
                ) : null}
                <Link href={`/news/${heroStory.slug}`} className="block group">
                  <h1
                    dir="auto"
                    className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug sm:leading-tight text-gray-900 group-hover:text-[#bb1919] transition break-words [overflow-wrap:anywhere]"
                  >
                    {heroStory.title}
                  </h1>
                </Link>
                <p
                  dir="auto"
                  className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 break-words [overflow-wrap:anywhere]"
                >
                  {getArticleExcerpt(heroStory.body, 240) || 'اقرأ تفاصيل الخبر كاملة لمعرفة آخر المستجدات والتغطيات الحية.'}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>بواسطة: {heroStory.author || 'التحرير'}</span>
                  <span>المصدر: تغطية حية</span>
                </div>
              </article>
            ) : (
              <div className="bg-white p-6 border border-dashed border-gray-300 text-center text-gray-500 rounded-sm">
                لا توجد أخبار منشورة حالياً في الصفحة الرئيسية.
              </div>
            )}

            {/* Secondary Stories Grid */}
            {latestNews.length > 0 && (
              <div>
                <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">آخر التغطيات والتقارير</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {latestNews.map((item) => (
                    <article key={item.id} className="bg-white border border-black/5 p-4 shadow-sm hover:shadow transition flex flex-col justify-between rounded-sm min-w-0">
                      <div>
                        {item.cover_image ? (
                          <div className="overflow-hidden mb-3 bg-gray-100 rounded-sm aspect-video w-full">
                            <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover transition duration-300 hover:scale-105" loading="lazy" />
                          </div>
                        ) : null}
                        <div className="text-[11px] font-bold text-[#bb1919] mb-1">{translateCategory(item.category)}</div>
                        <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] transition block">
                          <h3 dir="auto" className="font-bold text-sm sm:text-base leading-snug text-gray-900 line-clamp-3 break-words">
                            {item.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : ''}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (Left Side) */}
          <div className="space-y-6 sm:space-y-8 min-w-0">
            
            {/* Trending / Most Read Widget */}
            <div className="bg-white border border-black/5 p-4 sm:p-5 shadow-sm rounded-sm">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#bb1919] animate-ping"></span>
                  أهم الأخبار
                </h2>
              </div>
              
              {news.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {news.slice(0, 5).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="py-3 sm:py-4 flex gap-3 sm:gap-4 items-start first:pt-0 last:pb-0 min-w-0">
                      <span className="text-2xl sm:text-3xl font-bold leading-none text-[#bb1919]/25 font-serif shrink-0 w-6 text-center">
                        {index + 1}
                      </span>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-[#bb1919]">{translateCategory(item.category)}</div>
                        <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] font-semibold text-xs sm:text-sm text-gray-800 leading-snug block transition line-clamp-2 break-words">
                          <span dir="auto">{item.title}</span>
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
            <div className="bg-white border border-black/5 p-4 sm:p-5 shadow-sm rounded-sm">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-base font-bold text-gray-900">الأقسام الإخبارية</h2>
              </div>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${encodeURIComponent(item)}`}
                      className="px-3 py-2 bg-[#f6f6f6] hover:bg-[#bb1919] hover:text-white transition text-xs font-semibold text-gray-700 rounded-sm min-h-[36px] flex items-center"
                    >
                      {translateCategory(item)}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">سيتم رصد الأقسام بمجرد نشر مقالات جديدة.</p>
              )}
            </div>

            {/* More News Sidebar Widget */}
            <div className="bg-white border border-black/5 p-4 sm:p-5 shadow-sm rounded-sm hidden lg:block">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-900">
                <span className="text-xl">📰</span>
                <h2 className="text-base font-bold text-gray-900">المزيد من الأخبار</h2>
              </div>
              <div className="space-y-4">
                {news.slice(1, 6).map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-3 group pb-3 border-b border-gray-100 last:border-b-0 last:pb-0 min-w-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">{translateCategory(item.category)}</span>
                      <h3 dir="auto" className="font-bold text-xs sm:text-sm text-gray-900 leading-snug group-hover:text-[#bb1919] transition line-clamp-3 break-words">
                        {item.title}
                      </h3>
                    </div>
                    {item.cover_image && (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 overflow-hidden shrink-0 rounded-sm">
                        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Latest News Grid Below */}
        {news.length > 0 && (
          <section className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-r-4 border-gray-900 pr-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">أخبار أخرى</h2>
              <Link href="/search" className="text-xs font-bold text-[#bb1919] hover:underline">عرض الكل &larr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {news.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col min-w-0 rounded-sm">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">بدون صورة</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <span className="text-[11px] font-bold text-[#bb1919] block mb-1">{translateCategory(item.category)}</span>
                      <h3 dir="auto" className="font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-snug line-clamp-2 text-sm break-words">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-3 block">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Shared Responsive Footer */}
      <Footer />
    </main>
  );
}