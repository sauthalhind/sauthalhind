import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import { listNews, translateCategory, getArticleExcerpt } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'البحث في الأخبار | Sauthalhind',
  description: 'ابحث عن الأخبار، المقالات، والتقارير الصحفية.',
  alternates: { canonical: '/search' }
};

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string | string[] }> }) {
  const params = (await searchParams) ?? {};
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? '').trim().toLowerCase();
  const result = await listNews();
  const items = result.ok ? result.items.filter((item) => item.status === 'published') : [];
  const filtered = query ? items.filter((item) => `${item.title} ${item.category} ${item.body}`.toLowerCase().includes(query)) : items.slice(0, 20);

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Unified Responsive Header */}
      <Header />

      <Container className="py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 border-r-4 border-[#bb1919] pr-3 sm:pr-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">البحث في الأخبار</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">ابحث عن التقارير، المقالات، والأخبار المنشورة.</p>
        </div>

        <form method="GET" action="/search" className="mb-8 sm:mb-10 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input 
            name="q" 
            defaultValue={query} 
            className="w-full border border-gray-300 bg-white px-4 py-2.5 sm:py-3 outline-none focus:border-[#bb1919] text-black text-sm rounded-sm min-h-[44px]" 
            placeholder="ابحث عن العناوين، الأقسام، أو الكلمات المفتاحية..." 
          />
          <button type="submit" className="bg-[#bb1919] hover:bg-[#901414] px-6 py-2.5 sm:py-3 font-bold text-white transition rounded-sm shrink-0 min-h-[44px]">
            بحث
          </button>
        </form>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? filtered.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow transition flex flex-col justify-between group rounded-sm min-w-0">
              <div>
                {item.cover_image && (
                  <div className="overflow-hidden mb-3 bg-gray-100 aspect-video w-full rounded-sm">
                    <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="text-[11px] font-bold text-[#bb1919] mb-1">{translateCategory(item.category)}</div>
                <h2 dir="auto" className="font-bold text-base sm:text-lg leading-snug text-gray-900 line-clamp-3 group-hover:text-[#bb1919] transition break-words [overflow-wrap:anywhere]">
                  {item.title}
                </h2>
                <p dir="auto" className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 break-words">
                  {getArticleExcerpt(item.body, 120) || 'لا توجد تفاصيل.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Link>
          )) : (
            <div className="col-span-full bg-white border border-dashed border-gray-300 p-8 text-center text-gray-500 rounded-sm">
              لا توجد أخبار مطابقة لبحثك.
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
