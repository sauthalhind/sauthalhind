import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-cairo' });
const english = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-english' });

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Sawt Al-Hind News',
  description: 'منصة أخبار عربية احترافية متعددة اللغات مع تغطية فورية وتحليلات ووسائط.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'),
  alternates: { languages: { ar: '/', en: '/en' } },
  keywords: ['أخبار', 'صحافة عربية', 'أخبار الهند', 'صوت الهند', 'جريدة صوت الهند', 'أخبار عاجلة', 'Sawt Al-Hind News', 'South Alhind News', 'Sauthalhind', 'Indian News in Arabic', 'India News'],
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${english.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Sawt Al-Hind News | جريدة صوت الهند',
              alternateName: ['South Alhind News', 'Sawt Al Hind', 'Sauthalhind', 'صوت الهند'],
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'}/sauthalhind.png`,
              sameAs: [
                // Add social media links here if they have any
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
