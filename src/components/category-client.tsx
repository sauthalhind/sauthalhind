"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
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

export function CategoryClient({
  initialItems = [],
  category,
  categoryTitle
}: {
  initialItems: NewsItem[];
  category: string;
  categoryTitle: string;
}) {
  const [localItems, setLocalItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const sync = () => {
      const all = readLocalNews();
      const normCat = category.toLowerCase().trim();
      const matched = all.filter(
        (i) =>
          (i.status === 'published' || !i.status) &&
          (i.category.toLowerCase().trim() === normCat ||
            translateCategory(i.category) === categoryTitle)
      );
      setLocalItems(matched);
    };
    sync();

    window.addEventListener('storage', sync);
    window.addEventListener('news-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('news-updated', sync);
    };
  }, [category, categoryTitle]);

  const items = useMemo(() => {
    const map = new Map<string, NewsItem>();
    initialItems.forEach((i) => map.set(i.slug || i.id, i));
    localItems.forEach((i) => map.set(i.slug || i.id, i));
    const list = Array.from(map.values());
    list.sort(
      (a, b) =>
        new Date(b.created_at || Date.now()).getTime() -
        new Date(a.created_at || Date.now()).getTime()
    );
    return list;
  }, [initialItems, localItems]);

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      <Header currentCategory={category} />

      <Container className="py-6 sm:py-10">
        <div className="mb-6 sm:mb-10 border-b-4 border-gray-900 pb-3 sm:pb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 break-words [overflow-wrap:anywhere]">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            تغطية خاصة ومستمرة لآخر المستجدات في قسم {categoryTitle}.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="bg-white group overflow-hidden flex flex-col justify-between border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition min-w-0"
              >
                <div className="overflow-hidden bg-gray-100 aspect-video w-full relative">
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">
                      بدون صورة
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between min-w-0">
                  <div>
                    <span className="text-[11px] font-bold text-[#bb1919] block mb-1">
                      {translateCategory(item.category)}
                    </span>
                    <h2
                      dir="auto"
                      className="font-bold text-base sm:text-lg leading-snug text-gray-900 group-hover:text-[#bb1919] transition break-words [overflow-wrap:anywhere] line-clamp-3"
                    >
                      {item.title}
                    </h2>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-400">
                    {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 bg-white border border-dashed border-gray-300 rounded-sm text-center text-gray-500 text-base">
              لا توجد أخبار منشورة في قسم {categoryTitle} حالياً.
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
