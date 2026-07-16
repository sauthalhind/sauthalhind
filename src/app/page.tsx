import type { Metadata } from 'next';
import HomePageClient from '@/components/homepage-client';

export const metadata: Metadata = {
  title: '????? ??? ????? | Arabic News Portal',
  description: 'Clean Arabic news portal shell ready for live content.',
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return <HomePageClient />;
}
