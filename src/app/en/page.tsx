import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'Sawt Al-Hind News | English',
  description: 'English view of the news portal.',
  alternates: { canonical: '/en' }
};

export default async function EnglishHome() {
  const result = await listNews();
  const news = result.ok ? result.items.filter((item) => item.status === 'published').slice(0, 5) : [];

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="ltr">
      <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Sawt Al-Hind</span>
              <span className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">News</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link href="/" className="hover:text-gray-200 bg-black/20 px-3 py-1.5 rounded transition">
              العربية (AR)
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-[#901414] text-white">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center">
          <span className="text-xs font-bold tracking-widest uppercase">English Edition</span>
        </div>
      </div>

      <Container className="py-8">
        <div className="mb-8 border-l-4 border-[#bb1919] pl-3">
          <h1 className="text-3xl font-bold text-black">Latest News</h1>
          <p className="text-gray-500 mt-1 text-sm">Top stories translated and curated for the English edition.</p>
        </div>
        
        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, i) => (
              <article key={item.id} className={`bg-white border border-gray-200 shadow-sm hover:shadow transition flex flex-col ${i === 0 ? 'md:col-span-2 lg:col-span-3 lg:flex-row' : ''}`}>
                {item.cover_image && (
                  <div className={`overflow-hidden bg-gray-100 ${i === 0 ? 'lg:w-2/3' : 'w-full'}`}>
                    <img src={item.cover_image} alt={item.title} className={`object-cover w-full ${i === 0 ? 'h-64 lg:h-96' : 'h-48'} transition duration-500 hover:scale-105`} />
                  </div>
                )}
                <div className={`p-5 flex flex-col justify-between flex-1 ${i === 0 ? 'lg:w-1/3' : ''}`}>
                  <div>
                    <div className="text-xs font-bold text-[#bb1919] uppercase tracking-wider mb-2">
                      {item.category}
                    </div>
                    <Link href={`/news/${item.slug}`} className="block group">
                      <h2 className={`font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-tight ${i === 0 ? 'text-2xl lg:text-3xl mb-4' : 'text-lg mb-2'}`}>
                        {item.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.body || 'Live story from Supabase.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No published stories available in the English edition yet.
          </div>
        )}
      </Container>
    </main>
  );
}
