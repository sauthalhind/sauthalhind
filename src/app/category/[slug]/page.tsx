import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/footer';
import { Header } from '@/components/header';
import { Container } from '@/components/ui';
import { listNews, translateCategory } from '@/lib/news-store';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

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

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Unified Responsive Header */}
      <Header currentCategory={decodedSlug} />

      <Container className="py-6 sm:py-10">
        {/* Category Header Banner */}
        <div className="mb-6 sm:mb-10 border-b-4 border-gray-900 pb-3 sm:pb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 break-words [overflow-wrap:anywhere]">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">تغطية خاصة ومستمرة لآخر المستجدات في قسم {categoryTitle}.</p>
        </div>

        {/* News Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? items.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="bg-white group overflow-hidden flex flex-col justify-between border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition min-w-0">
              <div className="overflow-hidden bg-gray-100 aspect-video w-full">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                   <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">بدون صورة</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between min-w-0">
                <div>
                  <span className="text-[11px] font-bold text-[#bb1919] block mb-1">{translateCategory(item.category)}</span>
                  <h2 dir="auto" className="font-bold text-base sm:text-lg leading-snug text-gray-900 group-hover:text-[#bb1919] transition break-words [overflow-wrap:anywhere] line-clamp-3">
                    {item.title}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-400">
                  {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </Link>
          )) : (
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
