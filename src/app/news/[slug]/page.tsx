import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShareBar } from '@/components/share-bar';
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
  const url = `https://sawtalhind.vercel.app/news/${article.slug}`;
  const publishedDate = article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString();

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
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
                    url: 'https://sawtalhind.news/sauthalhind.png'
                  }
                },
                image: article.cover_image ? [article.cover_image] : undefined,
                mainEntityOfPage: `https://sawtalhind.news/news/${article.slug}`
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'الرئيسية',
                    item: 'https://sawtalhind.news'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: article.category,
                    item: `https://sawtalhind.news/search?q=${encodeURIComponent(article.category)}`
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: article.title,
                    item: `https://sawtalhind.news/news/${article.slug}`
                  }
                ]
              }
            ])
          }}
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurfaceVariant transition hover:bg-brand-surfaceLow w-fit">
            <span>←</span> الرئيسية
          </Link>
          <div className="text-xs text-brand-onSurfaceVariant font-medium">
            <span>الرئيسية</span> / <span>الأخبار</span> / <span className="font-semibold text-brand-primary">{article.category}</span>
          </div>
        </div>

        <article className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-black/6 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          {article.cover_image ? <img src={article.cover_image} alt={article.title} className="h-72 w-full object-cover sm:h-[460px]" /> : null}
          <div className="p-5 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">{article.category}</div>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{article.title}</h1>
            <p className="mt-3 text-sm leading-7 text-brand-onSurfaceVariant">
              {article.category} • {article.author} • {article.created_at}
            </p>

            <div className="mt-6">
              <ShareBar title={article.title} url={url} description="Share this news article with one tap." />
            </div>

            <div className="mt-8 whitespace-pre-wrap rounded-[28px] bg-brand-surfaceLow p-5 text-sm leading-7 text-brand-onSurfaceVariant">
              {article.body || 'Put your real story body here. Every article page can reuse the same share bar component.'}
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
