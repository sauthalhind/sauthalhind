import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
    alternates: { canonical: `/news/${slug}` }
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

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <Container className="py-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-black/6 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          {article.cover_image ? <img src={article.cover_image} alt={article.title} className="h-72 w-full object-cover sm:h-[460px]" /> : null}
          <div className="p-5 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">Article</div>
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
