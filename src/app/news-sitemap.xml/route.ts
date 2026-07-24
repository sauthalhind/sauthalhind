import { NextResponse } from 'next/server';
import { listNews } from '@/lib/news-store';

export const revalidate = 60;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com';
  const result = await listNews();

  if (!result.ok) {
    return new NextResponse('Error generating sitemap', { status: 500 });
  }

  // Google News Sitemap only allows articles published in the last 48 hours
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const publishedNews = result.items
    .filter(item => item.status === 'published' && new Date(item.created_at) >= twoDaysAgo)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 1000); // Google News allows up to 1000 URLs per sitemap

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${publishedNews.map(item => `
  <url>
    <loc>${baseUrl}/news/${item.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Sawt Al-Hind News</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.created_at).toISOString()}</news:publication_date>
      <news:title>${item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')}</news:title>
    </news:news>
  </url>
`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
