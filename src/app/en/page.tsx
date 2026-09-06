import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import { listNews, getArticleExcerpt } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Sauthalhind | English Edition',
  description: 'English edition of Sauthalhind News Portal.',
  alternates: { canonical: '/en' }
};

export default async function EnglishHome() {
  const result = await listNews();
  const news = result.ok ? result.items.filter((item) => item.status === 'published').slice(0, 5) : [];

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="ltr">
      {/* Unified Responsive Header */}
      <Header lang="en" />

      <Container className="py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 border-l-4 border-[#bb1919] pl-3 sm:pl-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Latest News</h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">Top stories and live coverage curated for the English edition.</p>
        </div>
        
        {news.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, i) => (
              <article key={item.id} className={`bg-white border border-gray-200 shadow-sm hover:shadow transition flex flex-col rounded-sm overflow-hidden min-w-0 ${i === 0 ? 'md:col-span-2 lg:col-span-3 lg:flex-row' : ''}`}>
                {item.cover_image && (
                  <div className={`overflow-hidden bg-gray-100 ${i === 0 ? 'lg:w-2/3 aspect-video sm:aspect-[16/9]' : 'w-full aspect-video'}`}>
                    <img src={item.cover_image} alt={item.title} className="object-cover w-full h-full transition duration-500 hover:scale-105" loading={i === 0 ? 'eager' : 'lazy'} />
                  </div>
                )}
                <div className={`p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0 ${i === 0 ? 'lg:w-1/3' : ''}`}>
                  <div>
                    <div className="text-xs font-bold text-[#bb1919] uppercase tracking-wider mb-2">
                      {item.category}
                    </div>
                    <Link href={`/news/${item.slug}`} className="block group">
                      <h2 className={`font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-snug break-words [overflow-wrap:anywhere] ${i === 0 ? 'text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4' : 'text-base sm:text-lg mb-2'}`}>
                        {item.title}
                      </h2>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 break-words">
                      {getArticleExcerpt(item.body, 140) || 'Live coverage.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 p-8 text-center text-gray-500 rounded-sm">
            No published stories available in the English edition yet.
          </div>
        )}
      </Container>
      <Footer />
    </main>
  );
}
