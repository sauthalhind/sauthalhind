import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
import Footer from '@/components/footer';
import { Container } from '@/components/ui';
import { getNewsBySlug } from '@/lib/news-store';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);
  const title = result.ok && result.item ? result.item.title : slug.replace(/-/g, ' ');

  return {
    title: `${title} | جريدة صوت الهند`,
    description: 'Arabic news article page with share controls.',
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title,
      description: 'Arabic news article page with share controls.',
      type: 'article',
      url: `/news/${slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Arabic news article page with share controls.'
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
            <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:text-gray-200">{article.category}</Link>
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

        <article className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm">
          <div className="p-6 md:p-10">
            <div className="mb-4 text-sm font-bold text-[#bb1919]">
              <Link href={`/category/${encodeURIComponent(article.category)}`} className="hover:underline">
                {article.category}
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-black leading-tight mb-6">
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
      </Container>
      <Footer />
    </main>
  );
}
