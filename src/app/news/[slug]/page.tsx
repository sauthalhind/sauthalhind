import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { getNewsBySlug, listNews, translateCategory } from '@/lib/news-store';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);
  const article = result.ok ? result.item : null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com';
  const title = article ? article.title : slug.replace(/-/g, ' ');
  const description = article?.body 
    ? article.body.slice(0, 180).replace(/\s+/g, ' ').trim() + '...'
    : 'جريدة صوت الهند - منصة أخبار عربية مستقلة مع تغطية فورية وتحليلات';
  
  let imageUrl = `${baseUrl}/sauthalhind.png`;
  if (article?.cover_image) {
    imageUrl = article.cover_image.startsWith('http') 
      ? article.cover_image 
      : `${baseUrl}${article.cover_image.startsWith('/') ? '' : '/'}${article.cover_image}`;
  }

  const pageUrl = `${baseUrl}/news/${slug}`;

  return {
    title: `${title} | جريدة صوت الهند`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      type: 'article',
      url: pageUrl,
      siteName: 'جريدة صوت الهند | Sawt Al-Hind News',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);

  if (!result.ok || !result.item) {
    notFound();
  }

  const article = result.item;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com';
  const url = `${baseUrl}/news/${article.slug}`;
  const publishedDate = article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString();

  // Fetch other news for recommendations
  const newsListResult = await listNews();
  const allNews = newsListResult.ok ? newsListResult.items.filter(i => i.status === 'published' && i.slug !== article.slug) : [];
  
  // Related news (same category)
  const relatedNews = allNews.filter(i => i.category === article.category).slice(0, 3);
  
  // Top News / Most Read list
  const topNews = allNews.slice(0, 5);

  // Latest / Recommended news
  const relatedIds = new Set(relatedNews.map(i => i.id));
  const latestNews = allNews.filter(i => !relatedIds.has(i.id)).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* BBC Style Brand Header */}
      <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">صوت الهند</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <Link href="/" className="hover:text-gray-200">الرئيسية</Link>
            <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:text-gray-200">{translateCategory(article.category)}</Link>
          </nav>
        </div>
      </header>

      <Container className="py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: article.title,
                description: article.body?.slice(0, 160) || article.title,
                datePublished: publishedDate,
                dateModified: publishedDate,
                author: {
                  '@type': 'Person',
                  name: article.author
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'جريدة صوت الهند',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/sauthalhind.png`
                  }
                },
                image: article.cover_image ? [article.cover_image] : undefined,
                mainEntityOfPage: `${baseUrl}/news/${article.slug}`
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'الرئيسية',
                    item: baseUrl
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: article.category,
                    item: `${baseUrl}/category/${encodeURIComponent(article.category)}`
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: article.title,
                    item: `${baseUrl}/news/${article.slug}`
                  }
                ]
              }
            ])
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content Column */}
          <div className="lg:col-span-8">
            <article className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 md:p-10">
                <div className="mb-4 text-sm font-bold text-[#bb1919]">
                  <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:underline">
                    {translateCategory(article.category)}
                  </Link>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{article.author}</span>
                    <span className="mx-2">|</span>
                    <span>{new Date(publishedDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <ShareBar title={article.title} url={url} description={article.title} />
                </div>

                {article.cover_image && (
                  <div className="mb-8 relative">
                    <img src={article.cover_image} alt={article.title} className="w-full h-auto max-h-[500px] object-cover" />
                  </div>
                )}

                <div className="whitespace-pre-wrap text-lg md:text-xl leading-loose text-gray-800">
                  {article.body || 'لا يوجد محتوى في هذا المقال.'}
                </div>
              </div>
            </article>

            {/* Top News Section for Mobile Screens */}
            <div className="lg:hidden mt-10 bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#bb1919]">
                <span className="text-xl">🔥</span>
                <h2 className="text-xl font-bold text-gray-900">أهم الأخبار</h2>
              </div>
              <div className="space-y-4">
                {topNews.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-3 group pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <span className="text-2xl font-extrabold text-[#bb1919] group-hover:text-black transition w-6 text-center leading-none mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[#bb1919] uppercase tracking-wider block mb-0.5">{translateCategory(item.category)}</span>
                      <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#bb1919] transition line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    {item.cover_image && (
                      <div className="w-14 h-14 bg-gray-100 overflow-hidden shrink-0 rounded-sm">
                        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedNews.length > 0 && (
              <section className="mt-10">
                <div className="flex items-center gap-3 mb-6 border-r-4 border-[#bb1919] pr-3">
                  <h2 className="text-2xl font-bold text-gray-900">أخبار ذات صلة</h2>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{translateCategory(article.category)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                      <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                        {item.cover_image ? (
                          <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">بدون صورة</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-[#bb1919] block mb-1">{translateCategory(item.category)}</span>
                          <h3 className="font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-snug line-clamp-2 text-sm">
                            {item.title}
                          </h3>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-3 block">
                          {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Top News Sidebar Column (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-8">
              {/* Top News Card */}
              <div className="bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#bb1919]">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-xl font-bold text-gray-900">أهم الأخبار</h2>
                </div>

                <div className="space-y-4">
                  {topNews.map((item, index) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-3 group pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <span className="text-2xl font-extrabold text-[#bb1919] group-hover:text-black transition w-6 text-center leading-none mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#bb1919] uppercase tracking-wider block mb-0.5">{translateCategory(item.category)}</span>
                        <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#bb1919] transition line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                      {item.cover_image && (
                        <div className="w-14 h-14 bg-gray-100 overflow-hidden shrink-0 rounded-sm">
                          <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News Grid Below */}
        {latestNews.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-6 border-r-4 border-gray-900 pr-3">
              <h2 className="text-2xl font-bold text-gray-900">أحدث الأخبار والتغطيات</h2>
              <Link href="/search" className="text-xs font-bold text-[#bb1919] hover:underline">عرض الكل &larr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {latestNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">بدون صورة</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#bb1919] block mb-1">{translateCategory(item.category)}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#bb1919] transition leading-snug line-clamp-2 text-sm">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-3 block">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
      <Footer />
    </main>
  );
}
