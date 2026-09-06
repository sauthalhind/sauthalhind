"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { translateCategory } from '@/lib/news-store';

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
      {/* BBC Style Brand Header */}
      <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">صوت الهند</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link href="/" className="hover:text-gray-200">الرئيسية</Link>
            <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:text-gray-200">{translateCategory(article.category)}</Link>
          </nav>
        </div>
      </header>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 md:p-10">
                <div className="mb-4 text-sm font-bold text-[#bb1919]">
                  <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:underline">
                    {translateCategory(article.category)}
                  </Link>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{article.author || 'قسم التحرير'}</span>
                    <span className="mx-2">|</span>
                    <span>{new Date(publishedDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <ShareBar title={article.title} url={pageUrl} description={article.title} />
                </div>

                {article.cover_image && (
                  <div className="mb-8 relative w-full overflow-hidden rounded-sm bg-black/5">
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

                <div className="whitespace-pre-wrap text-lg md:text-xl leading-loose text-gray-800 break-words">
                  {article.body || 'لا يوجد محتوى في هذا المقال.'}
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-24">
              <div className="border-r-4 border-[#bb1919] pr-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900">جريدة صوت الهند</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
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