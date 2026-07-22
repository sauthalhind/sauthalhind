import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Inter, Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';

const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-arabic' });
const english = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-english' });
const kufi = Noto_Kufi_Arabic({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-kufi' });

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Sawt Al-Hind News',
  description: 'منصة أخبار عربية احترافية متعددة اللغات مع تغطية فورية وتحليلات ووسائط.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'),
  alternates: { languages: { ar: '/', en: '/en' } },
  keywords: ['أخبار', 'صحافة عربية', 'أخبار الهند', 'أخبار عربية', 'أخبار عاجلة', 'رياضة', 'اقتصاد', 'ديني'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  verification: {
    google: 'yX9e9L7bQ2_7k8F4P8F_L54qIXr-M07zCJABDXg5WehE' // Can also be overridden by NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env var
  },
  openGraph: {
    title: 'جريدة صوت الهند',
    description: 'منصة أخبار عربية احترافية متعددة اللغات.',
    type: 'website',
    locale: 'ar_AR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جريدة صوت الهند',
    description: 'منصة أخبار عربية احترافية متعددة اللغات.'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${english.variable} ${kufi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
