import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import Footer from '@/components/footer';
import { listNews, translateCategory } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Search | Sauthalhind',
  description: 'Search live news articles.',
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
      {/* Responsive Brand Header */}
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white p-1 rounded-sm flex items-center justify-center shrink-0">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg leading-none tracking-tight">صوت الهند</span>
                <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest hidden sm:inline">SAUTHALHIND</span>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <Link
                href="/"
                className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded transition"
              >
                <span>الرئيسية</span>
                <span className="text-xs">←</span>
              </Link>
              <Link href="/en" className="hover:bg-white/10 px-2.5 py-1.5 rounded transition">English</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Navigation Ribbon */}
      <div className="bg-[#901414] text-white sticky top-0 z-50 shadow-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <nav className="flex gap-2 sm:gap-3 overflow-x-auto py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap scrollbar-none">
            <Link href="/" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">الرئيسية</Link>
            <Link href="/category/Breaking%20News" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">أخبار عاجلة</Link>
            <Link href="/category/World" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">أخبار العالم</Link>
            <Link href="/category/Economy" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">مال وأعمال</Link>
            <Link href="/category/Culture" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">ثقافة وفنون</Link>
            <Link href="/category/Sports" className="px-2.5 py-1 rounded hover:bg-white/10 text-white/90 transition">الرياضة</Link>
          </nav>
        </div>
      </div>

      <Container className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 border-r-4 border-[#bb1919] pr-3 sm:pr-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">البحث في الأخبار</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">ابحث عن التقارير، المقالات، والأخبار المنشورة.</p>
        </div>

        <form className="mb-8 sm:mb-10 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input 
            name="q" 
            defaultValue={query} 
            className="w-full border border-gray-300 rounded-sm bg-white px-4 py-2.5 sm:py-3 outline-none focus:border-[#bb1919] text-black text-sm" 
            placeholder="ابحث عن العناوين، الأقسام، أو الكلمات المفتاحية..." 
          />
          <button className="bg-[#bb1919] hover:bg-[#901414] px-6 py-2.5 sm:py-3 font-bold text-white text-sm rounded-sm transition shrink-0">
            بحث
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? filtered.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow transition flex flex-col justify-between group">
              <div>
                {item.cover_image && (
                  <div className="overflow-hidden mb-3 bg-gray-100 h-40">
                    <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="text-[11px] font-bold text-[#bb1919] mb-1">{translateCategory(item.category)}</div>
                <h2 className="font-bold text-lg leading-snug text-gray-900 line-clamp-3 group-hover:text-[#bb1919] transition">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.body || 'لا يوجد تفاصيل.'}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Link>
          )) : (
            <div className="col-span-full bg-white border border-dashed border-gray-300 p-8 text-center text-gray-500">
              لا توجد أخبار مطابقة لبحثك.
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
