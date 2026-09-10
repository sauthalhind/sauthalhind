"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function HomePageClient({ news: initialNews }: { news: NewsItem[] }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    try {
      const local = JSON.parse(window.localStorage.getItem('sawt-al-hind-admin-news') || '[]') as NewsItem[];
      if (Array.isArray(local) && local.length > 0) {
        const publishedLocal = local.filter((item) => item.status === 'published');
        const map = new Map<string, NewsItem>();
        initialNews.forEach((item) => map.set(item.id, item));
        publishedLocal.forEach((item) => map.set(item.id, item));
        const merged = Array.from(map.values());
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNews(merged);
      }
    } catch {
      // ignore
    }
  }, [initialNews]);

  const heroStory = news[0];
  const latestNews = news.slice(1, 5);
  // Extract unique categories, max 6
  const categories = Array.from(new Set(news.map((item) => item.category).filter(Boolean))).slice(0, 6);
  
  const sourceLabel = 'supabase'; // Assuming it's server-rendered successfully if props exist

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
      
      {/* BBC Arabic Style Red Header Banner */}
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-8 w-8 sm:h-10 sm:w-10 brightness-0 invert" />
              <div>
                <span className="font-bold text-lg sm:text-2xl tracking-tight">جريدة صوت الهند</span>
                <span className="text-[10px] opacity-75 mr-2 tracking-widest hidden sm:inline uppercase">Sauthalhind</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
              <Link 
                href="/search" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
                title="بحث"
                aria-label="البحث في الأخبار"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/en" className="bg-white/10 hover:bg-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition text-[11px] sm:text-xs">English</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Navigation Ribbon */}
      <div className="bg-[#901414] text-white sticky top-0 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <nav className="flex gap-1.5 sm:gap-3 overflow-x-auto py-2 sm:py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap scrollbar-none items-center">
            <Link href="/" className="bg-white/20 text-white px-3 py-1 rounded-full">الرئيسية</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-1 rounded-full transition"
              >
                {translateCategory(cat)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {news.length > 0 && (
        <div className="border-b border-black/5 bg-[#ffebeb] text-[#bb1919] py-1.5 sm:py-2 overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            <span className="shrink-0 bg-[#bb1919] text-white font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded shadow-xs animate-pulse">
              عاجل
            </span>
            <div className="relative overflow-hidden w-full h-5" dir="ltr">
              <div className="absolute flex gap-10 whitespace-nowrap animate-ticker-rtl hover:[animation-play-state:paused] -right-full">
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <span className="text-[#bb1919]">✦</span>
                    <span dir="rtl">{item.title}</span>
                  </Link>
                ))}
                {news.slice(0, 6).map((item) => (
                  <Link
                    key={`ticker-dup-${item.id}`}
                    href={`/news/${item.slug}`}
                    className="hover:underline font-medium text-xs sm:text-sm transition flex items-center gap-2"
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
      <Container className="py-4 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[2fr_1fr]">
          
          {/* Main Content Area (Right Side) */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Hero Main Story Card */}
            {heroStory ? (
              <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-xs hover:shadow-md transition overflow-hidden">
                <div className="text-xs font-bold text-[#bb1919] mb-2">{translateCategory(heroStory.category)}</div>
                {heroStory.cover_image && !failedImages[heroStory.id] ? (
                  <div className="overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 mb-3 sm:mb-4">
                    <img
                      src={heroStory.cover_image}
                      alt={heroStory.title}
                      onError={() => handleImageError(heroStory.id)}
                      className="w-full aspect-[16/10] sm:aspect-video object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ) : null}
                <Link href={`/news/${heroStory.slug}`} className="block group">
                  <h1 className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug sm:leading-tight text-gray-900 group-hover:text-[#bb1919] transition">
                    {heroStory.title}
                  </h1>
                </Link>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-gray-600 line-clamp-3 sm:line-clamp-4">
                  {heroStory.body ? heroStory.body.slice(0, 240) + '...' : 'اقرأ تفاصيل الخبر كاملة لمعرفة آخر المستجدات والتغطيات الحية.'}
                </p>
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                  <span>بواسطة: {heroStory.author || 'التحرير'}</span>
                  <span>{heroStory.created_at ? new Date(heroStory.created_at).toLocaleDateString('ar-EG') : 'تغطية حية'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 border border-dashed border-gray-300 text-center text-gray-500 rounded-xl">
                لا توجد أخبار منشورة حالياً في الصفحة الرئيسية.
              </div>
            )}

            {/* Secondary Stories Grid */}
            {latestNews.length > 0 && (
              <div>
                <div className="border-r-4 border-[#bb1919] pr-3 mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">آخر التغطيات والتقارير</h2>
                </div>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  {latestNews.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-4 shadow-xs hover:shadow transition flex flex-row sm:flex-col justify-between gap-3 sm:gap-0"
                    >
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-[#bb1919] mb-1">{translateCategory(item.category)}</div>
                          <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] transition">
                            <h3 className="font-bold text-sm sm:text-base leading-snug text-gray-900 line-clamp-2 sm:line-clamp-3">
                              {item.title}
                            </h3>
                          </Link>
                        </div>
                        <div className="mt-2 sm:mt-4 sm:pt-2 sm:border-t sm:border-gray-100 text-[10px] text-gray-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : ''}
                        </div>
                      </div>
                      {item.cover_image && !failedImages[item.id] ? (
                        <div className="w-24 h-20 sm:w-full sm:h-40 overflow-hidden rounded-lg shrink-0 bg-gray-100 sm:mb-3 order-first sm:order-none">
                          <img
                            src={item.cover_image}
                            alt={item.title}
                            onError={() => handleImageError(item.id)}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (Left Side) */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Trending / Most Read Widget */}
            <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#bb1919] animate-ping"></span>
                  أهم الأخبار
                </h2>
              </div>
              
              {news.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {news.slice(0, 5).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="py-3 sm:py-3.5 flex gap-3 sm:gap-4 items-start first:pt-0 last:pb-0">
                      <span className="text-2xl sm:text-3xl font-extrabold leading-none text-[#bb1919]/30 font-serif w-6 text-center">
                        {index + 1}
                      </span>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-[#bb1919]">{translateCategory(item.category)}</div>
                        <Link href={`/news/${item.slug}`} className="hover:text-[#bb1919] font-semibold text-xs sm:text-sm text-gray-800 leading-snug block transition line-clamp-2">
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
            <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-base font-bold text-gray-900">الأقسام الإخبارية</h2>
              </div>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {categories.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${encodeURIComponent(item)}`}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-[#bb1919] hover:text-white transition text-[11px] sm:text-xs font-semibold text-gray-700 rounded-full active:scale-95"
                    >
                      {translateCategory(item)}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">سيتم رصد الأقسام بمجرد نشر مقالات جديدة.</p>
              )}
            </div>

            {/* More News Sidebar Widget (Desktop only) */}
            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs hidden lg:block">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-900">
                <span className="text-xl">📰</span>
                <h2 className="text-base font-bold text-gray-900">المزيد من الأخبار</h2>
              </div>
              <div className="space-y-4">
                {news.slice(1, 6).map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-3 group pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">{translateCategory(item.category)}</span>
                      <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#bb1919] transition line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    {item.cover_image && !failedImages[item.id] && (
                      <div className="w-16 h-16 bg-gray-100 overflow-hidden shrink-0 rounded-lg">
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          onError={() => handleImageError(item.id)}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
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
          <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-r-4 border-gray-900 pr-3">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">أخبار أخرى</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {news.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white border border-gray-200/80 rounded-xl shadow-xs hover:shadow-md transition overflow-hidden flex flex-row sm:flex-col">
                  <div className="w-28 h-24 sm:w-full sm:aspect-video overflow-hidden bg-gray-100 relative shrink-0">
                    {item.cover_image && !failedImages[item.id] ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        onError={() => handleImageError(item.id)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center p-3">
                        <img src="/sauthalhind.png" alt="Sauthalhind" className="h-7 opacity-30 object-contain" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#bb1919] block mb-1">{translateCategory(item.category)}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-snug line-clamp-2 text-xs sm:text-sm">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-400 mt-2 block">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Premium Mobile-Optimized Footer */}
      <footer className="border-t-4 border-[#bb1919] bg-[#0f1d25] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-9 w-9 brightness-0 invert" />
                <span className="font-bold text-lg sm:text-xl">جريدة صوت الهند</span>
              </div>
              <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-gray-400">
                منصة صوت الهند الإخبارية تقدم تغطية إخبارية مستقلة ومباشرة على مدار الساعة للأحداث والقضايا الثقافية والسياسية في شبه القارة الهندية والعالم العربي.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-white mb-3">روابط هامة</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">من نحن</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">شروط الاستخدام</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3">البحث والاشتراك</h3>
              <p className="text-xs text-gray-400 mb-3">تصفح الأخبار بكل سهولة عبر محرك البحث.</p>
              <Link 
                href="/search"
                className="inline-flex items-center gap-2 bg-[#bb1919] hover:bg-[#901414] px-4 py-2 text-xs font-bold transition text-white rounded-md"
              >
                <span>🔍 البحث في الأخبار</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-[11px] text-gray-500">
            &copy; {new Date().getFullYear()} جريدة صوت الهند. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </main>
  );
}