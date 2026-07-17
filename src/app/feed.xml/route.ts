import { listNews } from '@/lib/news-store';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await listNews();
  const articles = result.ok ? result.items.filter(item => item.status === 'published') : [];

  const baseUrl = 'https://sawtalhind.news';

  const rssItems = articles.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${baseUrl}/news/${item.slug}</link>
      <guid>${baseUrl}/news/${item.slug}</guid>
      <pubDate>${new Date(item.created_at || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${item.body ? item.body.slice(0, 300) + '...' : item.title}]]></description>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ''}
      ${item.author ? `<author><![CDATA[${item.author}]]></author>` : ''}
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>جريدة صوت الهند | Sawt Al-Hind News</title>
      <link>${baseUrl}</link>
      <description>منصة أخبار عربية احترافية متعددة اللغات مع تغطية فورية وتحليلات ووسائط.</description>
      <language>ar</language>
      <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${rssItems}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
