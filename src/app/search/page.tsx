import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import Footer from '@/components/footer';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Search | Sawt Al-Hind News',
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
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-4 text-white">
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
            <Link href="/category/Breaking%20News" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">أخبار عاجلة</Link>
            <Link href="/category/World" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">أخبار العالم</Link>
            <Link href="/category/Economy" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">مال وأعمال</Link>
            <Link href="/category/Culture" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">ثقافة وفنون</Link>
            <Link href="/category/Sports" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">الرياضة</Link>
          </nav>
        </div>
      </div>

      <Container className="py-8">
        <div className="mb-8 border-r-4 border-[#bb1919] pr-4">
          <h1 className="text-3xl font-bold text-black">البحث في الأخبار</h1>
          <p className="mt-2 text-sm text-gray-500">ابحث عن التقارير، المقالات، والأخبار المنشورة.</p>
        </div>

        <form className="mb-10 flex gap-2 max-w-2xl">
          <input 
            name="q" 
            defaultValue={query} 
            className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#bb1919] text-black" 
            placeholder="ابحث عن العناوين، الأقسام، أو الكلمات المفتاحية..." 
          />
          <button className="bg-[#bb1919] hover:bg-[#901414] px-6 py-3 font-bold text-white transition">
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
                <div className="text-[11px] font-bold text-[#bb1919] mb-1">{item.category}</div>
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
