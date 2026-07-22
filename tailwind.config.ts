import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00524E',
          secondary: '#735C00',
          tertiary: '#414859',
          background: '#F7FAF9',
          surface: '#F7FAF9',
          surfaceLow: '#F1F4F3',
          surfaceContainer: '#EBEFED',
          surfaceHigh: '#E5E9E7',
          surfaceHighest: '#E0E3E2',
          outline: '#6E7978',
          outlineVariant: '#BEC9C7',
          onSurface: '#181C1C',
          onSurfaceVariant: '#3E4948',
          onPrimary: '#FFFFFF',
          onBackground: '#181C1C',
          inverseSurface: '#2D3131',
          inverseOnSurface: '#EEF1F0',
          primaryContainer: '#006C67',
          primaryFixed: '#9FF1EA',
          primaryFixedDim: '#83D5CE',
          onPrimaryContainer: '#97EAE3',
          secondaryContainer: '#FED65B',
          secondaryFixed: '#FFE088',
          secondaryFixedDim: '#E9C349',
          onSecondaryContainer: '#745C00',
          onSecondaryFixed: '#241A00',
          onSecondaryFixedVariant: '#574500',
          error: '#BA1A1A',
          errorContainer: '#FFDAD6',
          onError: '#FFFFFF',
          onErrorContainer: '#93000A',
          surfaceTint: '#006A65'
        },
        gold: '#D4AF37',
        navy: '#0D1B2A',
        dark: '#111827'
      },
      boxShadow: {
        glow: '0 18px 50px rgba(13, 27, 42, 0.12)'
      },
      backgroundImage: {
        'paper-light': 'radial-gradient(circle at top, rgba(0,108,103,0.08), transparent 35%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        'paper-dark': 'radial-gradient(circle at top, rgba(212,175,55,0.12), transparent 30%), linear-gradient(180deg, #0d1b2a 0%, #111827 100%)'
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'sans-serif'],
        naskh: ['var(--font-naskh)', 'serif'],
        amiri: ['var(--font-amiri)', 'serif'],
        arabic: ['var(--font-cairo)', 'var(--font-naskh)', 'sans-serif'],
        english: ['var(--font-english)', 'sans-serif'],
        bodyLg: ['var(--font-cairo)', 'sans-serif'],
        bodyMd: ['var(--font-cairo)', 'sans-serif'],
        headlineXl: ['var(--font-cairo)', 'var(--font-amiri)', 'serif'],
        headlineLg: ['var(--font-cairo)', 'var(--font-amiri)', 'serif'],
        headlineMd: ['var(--font-cairo)', 'var(--font-amiri)', 'serif'],
        displayLg: ['var(--font-cairo)', 'var(--font-amiri)', 'serif'],
        labelLg: ['var(--font-english)', 'sans-serif'],
        labelSm: ['var(--font-english)', 'sans-serif']
      },
      fontSize: {
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'headline-xl-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-lg': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '30px', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '60px', fontWeight: '700' }]
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        gutter: '24px',
        'max-width': '1280px',
        unit: '4px',
        'margin-desktop': '64px',
        'margin-mobile': '16px'
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        ticker: 'ticker 30s linear infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
