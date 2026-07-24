import type { Metadata } from 'next';
import HomePageClient from '@/components/homepage-client';
import { listNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Sawt Al-Hind News',
  description: 'منصة أخبار عربية احترافية مع تغطية فورية وتحليلات ووسائط.',
  alternates: { canonical: '/' }
};

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const result = await listNews();
  const news = result.ok ? result.items.filter(item => item.status === 'published') : [];
  
  // Sort by created_at descending just in case
  news.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return <HomePageClient news={news} />;
}
