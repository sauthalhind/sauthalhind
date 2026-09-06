"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { ShareBar } from '@/components/share-bar';
import { ArticleBody } from '@/components/article-body';
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

const localNewsKey = 'sawt-al-hind-admin-news';

export function ArticleFallbackReader({ slug, initialArticle }: { slug: string; initialArticle?: NewsItem | null }) {
  const [mounted, setMounted] = useState(false);
  const [article, setArticle] = useState<NewsItem | null>(initialArticle || null);

  useEffect(() => {
    setMounted(true);
    const cleanSlug = (slug || '').trim().toLowerCase();
    const cleanDecoded = decodeURIComponent(slug || '').trim().toLowerCase();

    // 1. First priority: Check local storage (user's edited/new articles)
    try {
      const raw = window.localStorage.getItem(localNewsKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const found = parsed.find((item: NewsItem) => {
            const itemSlug = (item.slug || '').trim().toLowerCase();
            const itemId = (item.id || '').trim().toLowerCase();
            return (
              itemSlug === cleanSlug ||
              itemSlug === cleanDecoded ||
              itemId === cleanSlug ||
              itemId === cleanDecoded ||
              encodeURIComponent(itemSlug) === cleanSlug ||
              encodeURIComponent(itemSlug) === cleanDecoded
            );
          });
          if (found) {
            setArticle(found);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    // 2. Second priority: Initial non-seed article passed from server
    if (initialArticle && !initialArticle.id.startsWith('seed-')) {
      setArticle(initialArticle);
      return;
    }

    // 3. Third priority: Try fetching live from API
    const fetchFromApi = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const json = await res.json();
          if (json.ok && Array.isArray(json.items)) {
            const found = json.items.find((item: NewsItem) => {
              const itemSlug = (item.slug || '').trim().toLowerCase();
              const itemId = (item.id || '').trim().toLowerCase();
              return (
                itemSlug === cleanSlug ||
                itemSlug === cleanDecoded ||
                itemId === cleanSlug ||
                itemId === cleanDecoded
              );
            });
            if (found) {
              setArticle(found);
              return;
            }
          }
        }
      } catch {
        // ignore
      }

      // If initial article exists and nothing else matched, use it as fallback
      if (initialArticle) {
        setArticle(initialArticle);
      }
    };

    void fetchFromApi();
  }, [slug, initialArticle]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f6f6f6]" dir="rtl">
        <Header />
        <Container className="py-12">
          <div className="bg-white p-8 border border-gray-200 animate-pulse space-y-4 max-w-4xl mx-auto rounded-sm">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-64 bg-gray-200 rounded w-full" />
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f6f6f6] text-gray-800" dir="rtl">
        <Header />
        <Container className="py-16 sm:py-24 text-center">
          <div className="max-w-md mx-auto bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
            <span className="text-4xl mb-4 block">📰</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">المقال غير موجود</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              عذراً، لم نتمكن من العثور على المقال المطلوب. قد يكون قد تم نقله أو حذفه.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#bb1919] hover:bg-black text-white px-6 py-2.5 text-sm font-bold rounded-sm transition"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </Container>
        <Footer />
      </main>
    );
  }

  const publishedDate = article.created_at || new Date().toISOString();
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://sauthalhind.com/news/${article.slug}`;

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      <Header currentCategory={article.category} />

      <Container className="py-4 sm:py-8">
        <div className="max-w-4xl mx-auto min-w-0">
          <article className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <div className="p-4 sm:p-6 md:p-10">
              <div className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-[#bb1919]">
                <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:underline">
                  {translateCategory(article.category)}
                </Link>
              </div>

              <h1
                dir="auto"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 leading-snug sm:leading-tight mb-4 sm:mb-6 break-words [overflow-wrap:anywhere]"
              >
                {article.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-gray-800">{article.author || 'صوت الهند'}</span>
                  <span className="text-gray-300">|</span>
                  <span>
                    {new Date(publishedDate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <ShareBar title={article.title} url={pageUrl} description={article.title} />
              </div>

              {article.cover_image && article.cover_image.trim() ? (
                <div className="mb-6 sm:mb-8 w-full overflow-hidden rounded-sm bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center">
                  <img
                    src={article.cover_image.trim()}
                    alt={article.title}
                    className="w-full h-auto max-h-[650px] object-contain mx-auto"
                  />
                </div>
              ) : null}

              <ArticleBody content={article.body || ''} />
            </div>
          </article>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
