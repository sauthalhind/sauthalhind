import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { listNews } from '@/lib/news-store';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Helper to translate common categories for the nav ribbon and page title
function translateCategory(cat: string): string {
  const mapping: Record<string, string> = {
    'religion': 'شؤون دينية',
    'economy': 'الاقتصاد',
    'world': 'أخبار العالم',
    'sports': 'الرياضة',
    'culture': 'ثقافة وفنون',
    'breaking news': 'أخبار عاجلة',
    'politics': 'سياسة'
  };
  return mapping[cat.toLowerCase()] || cat;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const title = translateCategory(decodedSlug);
  return {
    title: `${title} | Sauthalhind`,
    description: `Latest news for ${title}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categoryTitle = translateCategory(decodedSlug);

  const result = await listNews();
  const allItems = result.ok ? result.items.filter((item) => item.status === 'published') : [];
  const items = allItems.filter((item) => item.category.toLowerCase() === decodedSlug.toLowerCase());

  // Hardcoded categories for the ribbon
  const navCategories = ['Breaking News', 'World', 'Economy', 'Culture', 'Sports'];

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
                href="/search"
                className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded transition"
                aria-label="بحث"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
            {navCategories.map((cat) => {
              const isActive = cat.toLowerCase() === decodedSlug.toLowerCase();
              return (
                <Link 
                  key={cat} 
                  href={`/category/${encodeURIComponent(cat)}`} 
                  className={`px-2.5 py-1 rounded transition ${isActive ? 'bg-white text-[#901414] font-bold shadow-sm' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                >
                  {translateCategory(cat)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <Container className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        {/* Category Title */}
        <div className="mb-6 sm:mb-8 border-b-2 sm:border-b-4 border-[#bb1919] pb-3 sm:pb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#bb1919] uppercase tracking-wider block mb-1">قسم الأخبار</span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{categoryTitle}</h1>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-200/80 px-2.5 py-1 rounded-full">{items.length} مقال</span>
        </div>

        {/* News Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? items.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="bg-white group overflow-hidden flex flex-col justify-start border border-gray-200 shadow-sm hover:shadow-md transition rounded-sm">
              <div className="overflow-hidden bg-gray-100 aspect-[16/10] sm:aspect-video w-full relative">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">بدون صورة</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#bb1919] block mb-1.5">{translateCategory(item.category)}</span>
                  <h2 className="font-bold text-base sm:text-lg leading-snug text-gray-900 group-hover:text-[#bb1919] transition line-clamp-2">
                    {item.title}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-medium text-gray-400">
                  {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-16 text-center text-gray-500 text-base">
              لا توجد أخبار في هذا القسم حالياً.
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
