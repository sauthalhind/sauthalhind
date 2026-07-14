import type { Metadata } from 'next';
import { ShareBar } from '@/components/share-bar';
import { Container } from '@/components/ui';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');

  return {
    title: `${title} | جريدة صوت الهند`,
    description: 'Arabic news article page with share controls.',
    alternates: { canonical: `/news/${slug}` }
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');
  const url = `https://sawtalhind.vercel.app/news/${slug}`;

  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <Container className="py-8">
        <article className="mx-auto max-w-4xl rounded-[32px] border border-black/6 bg-white p-5 shadow-[0_18px_55px_rgba(17,24,39,0.06)] sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">Article</div>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-brand-onSurfaceVariant">
            This article shell is ready for live content from your CMS or database.
          </p>

          <div className="mt-6">
            <ShareBar
              title={title}
              url={url}
              description="Share this news article with one tap."
            />
          </div>

          <div className="mt-8 rounded-[28px] bg-brand-surfaceLow p-5 text-sm leading-7 text-brand-onSurfaceVariant">
            Put your real story body here. Every article page can reuse the same share bar component, so readers
            can copy, WhatsApp, Facebook-share, or open the native share sheet.
          </div>
        </article>
      </Container>
    </main>
  );
}
