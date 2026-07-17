import { listNews } from '@/lib/news-store';

export default async function sitemap() {
  const baseUrl = 'https://sawtalhind.news';
  const result = await listNews();
  const articles = result.ok ? result.items : [];

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'hourly',
      priority: 1
    },

    ...articles.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      changeFrequency: 'daily' as const,
      priority: item.status === 'published' ? 0.9 : 0.3,
      lastModified: item.created_at ? new Date(item.created_at) : new Date()
    }))
  ];
}
