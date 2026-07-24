import { listNews } from '@/lib/news-store';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com';
  const result = await listNews();
  const articles = result.ok ? result.items : [];

  const publishedArticles = articles.filter(item => item.status === 'published');
  
  // Extract unique categories
  const categories = Array.from(new Set(publishedArticles.map(item => item.category).filter(Boolean)));

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'hourly',
      priority: 1
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category!)}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
      lastModified: new Date()
    })),
    ...publishedArticles.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      lastModified: item.created_at ? new Date(item.created_at) : new Date()
    }))
  ];
}
