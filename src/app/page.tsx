import type { Metadata } from 'next';
import HomePageClient from '@/components/homepage-client';

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Sawt Al-Hind News',
  description: 'منصة أخبار عربية احترافية مع تغطية فورية وتحليلات ووسائط.',
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return <HomePageClient />;
}
