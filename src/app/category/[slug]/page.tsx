import type { Metadata } from 'next';
import Link from 'next/link';
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
    title: `${title} | Sawt Al-Hind News`,
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
      {/* Header */}
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <Link href="/">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-10 w-10 brightness-0 invert" />
              </Link>
              <div>
                <Link href="/">
                  <span className="font-bold text-xl sm:text-2xl tracking-tight">جريدة صوت الهند</span>
                </Link>
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
            <Link href="/" className="hover:text-gray-200 opacity-90 hover:opacity-100 transition">الرئيسية</Link>
            {navCategories.map((cat) => {
              const isActive = cat.toLowerCase() === decodedSlug.toLowerCase();
              return (
                <Link 
                  key={cat} 
                  href={`/category/${encodeURIComponent(cat)}`} 
                  className={`transition ${isActive ? 'border-b-2 border-white pb-0.5 font-bold' : 'hover:text-gray-200 opacity-90 hover:opacity-100'}`}
                >
                  {translateCategory(cat)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <Container className="py-12">
        {/* Massive Category Title (BBC Style) */}
        <div className="mb-12 border-b-4 border-gray-900 pb-4">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-2">{categoryTitle}</h1>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? items.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="bg-white group overflow-hidden flex flex-col justify-start border border-gray-200">
              <div className="overflow-hidden bg-gray-100 aspect-video w-full">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                   <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">بدون صورة</div>
                )}
              </div>
              <div className="p-4 pt-4 flex flex-col flex-1">
                <h2 className="font-bold text-xl leading-tight text-gray-900 group-hover:text-[#bb1919] transition">
                  {item.title}
                </h2>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs font-bold text-gray-400">
                  {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500 text-lg">
              لا توجد أخبار في هذا القسم حالياً.
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
