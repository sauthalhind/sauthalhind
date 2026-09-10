"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { translateCategory } from '@/lib/news-store';
import ArticleBody from '@/components/article-body';

type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  cover_image?: string | null;
  status: string;
  created_at: string;
};

export default function ClientArticleFallback({ slug }: { slug: string }) {
  const [article, setArticle] = useState<NewsRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const decodedSlug = decodeURIComponent(slug);
      const local = JSON.parse(window.localStorage.getItem('sawt-al-hind-admin-news') || '[]') as NewsRecord[];
      const match = local.find(
        (item) => item.slug === slug || item.slug === decodedSlug || (item.title && item.title.includes(decodedSlug))
      );
      if (match) {
        setArticle(match);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4" dir="rtl">
        <div className="text-gray-500 font-bold text-sm animate-pulse">جاري تحميل المقال...</div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f6f6f6] flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="bg-white border border-gray-200 p-8 max-w-md shadow-sm rounded-sm">
          <div className="text-4xl mb-4">📰</div>
          <h1 className="text-xl font-bold text-black mb-2">المقال غير موجود</h1>
          <p className="text-sm text-gray-500 mb-6">
            تعذر العثور على هذا المقال، أو قد يكون قيد المزامنة في قاعدة البيانات.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#bb1919] hover:bg-[#901414] text-white text-sm font-bold px-6 py-2.5 rounded transition"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </main>
    );
  }

  const publishedDate = article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString();
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://sauthalhind.com/news/${article.slug}`;

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Responsive Header */}
      <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white p-1 rounded-sm flex items-center justify-center shrink-0">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg leading-none tracking-tight">صوت الهند</span>
                <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest hidden sm:inline">SAUTHALHIND</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded transition"
            >
              <span>الرئيسية</span>
              <span className="text-xs">←</span>
            </Link>
            <Link
              href="/search"
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded transition"
              aria-label="بحث"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <Container className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <article className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
              <div className="p-4 sm:p-7 md:p-10">
                <div className="mb-3 sm:mb-4">
                  <Link 
                    href={`/category/${encodeURIComponent(article.category)}`}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#bb1919] hover:underline bg-[#bb1919]/5 px-2.5 py-1 rounded"
                  >
                    <span>{translateCategory(article.category)}</span>
                  </Link>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-snug sm:leading-tight mb-4 sm:mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-gray-200/80 py-3 mb-6 gap-3">
                  <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-gray-900">{article.author || 'قسم التحرير'}</span>
                    <span className="text-gray-300">•</span>
                    <time dateTime={publishedDate} className="text-gray-500">
                      {new Date(publishedDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <ShareBar title={article.title} url={pageUrl} description={article.title} />
                </div>

                {article.cover_image && (
                  <div className="mb-6 relative w-full overflow-hidden rounded-sm bg-black/5">
                    <img 
                      src={article.cover_image} 
                      alt={article.title} 
                      onError={(e) => {
                        (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('display', 'none');
                      }}
                      className="w-full h-auto max-h-[550px] object-cover" 
                    />
                  </div>
                )}

                <div className="text-gray-900 font-sans">
                  <ArticleBody content={article.body || 'لا يوجد محتوى في هذا المقال.'} />
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-2">شارك هذا الخبر:</div>
                  <ShareBar title={article.title} url={pageUrl} description={article.title} />
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 p-5 sm:p-6 shadow-sm rounded-sm sticky top-20">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900">جريدة صوت الهند</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                منصة إخبارية عربية مستقلة تقدم تغطية فورية وشاملة للأحداث الهندية والدولية.
              </p>
              <Link href="/" className="text-xs font-bold text-[#bb1919] hover:underline flex items-center gap-1">
                <span>تصفح جميع الأخبار</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}