import type { Metadata } from 'next';
import { listNews, translateCategory } from '@/lib/news-store';
import { CategoryClient } from '@/components/category-client';

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
  const items = allItems.filter(
    (item) =>
      item.category.toLowerCase().trim() === decodedSlug.toLowerCase().trim() ||
      translateCategory(item.category) === categoryTitle
  );

  return (
    <CategoryClient
      initialItems={items}
      category={decodedSlug}
      categoryTitle={categoryTitle}
    />
  );
}
