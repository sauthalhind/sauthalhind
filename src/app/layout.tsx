import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-cairo' });
const english = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-english' });

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Sauthalhind',
  description: 'منصة أخبار عربية احترافية متعددة اللغات مع تغطية فورية وتحليلات ووسائط.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'),
  alternates: { languages: { ar: '/', en: '/en' } },
  keywords: ['أخبار', 'صحافة عربية', 'أخبار الهند', 'صوت الهند', 'جريدة صوت الهند', 'أخبار عاجلة', 'Sauthalhind', 'South Alhind News', 'Sauthalhind', 'Indian News in Arabic', 'India News'],
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

import Script from 'next/script';

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
              name: 'Sauthalhind | جريدة صوت الهند',
              alternateName: ['South Alhind News', 'Sawt Al Hind', 'Sauthalhind', 'صوت الهند'],
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sauthalhind.com'}/sauthalhind.png`,
              sameAs: []
            })
          }}
        />
        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `
            }}
          />
        )}
      </head>
      <body>
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
