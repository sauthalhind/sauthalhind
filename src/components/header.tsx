"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translateCategory } from '@/lib/news-store';

interface HeaderProps {
  categories?: string[];
  currentCategory?: string;
  lang?: 'ar' | 'en';
}

const DEFAULT_CATEGORIES = [
  'Breaking News',
  'World',
  'Economy',
  'Culture',
  'Sports',
  'Religion'
];

export function Header({ categories = DEFAULT_CATEGORIES, currentCategory = '', lang = 'ar' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const isRtl = lang !== 'en';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Primary Brand Topbar */}
      <div className="bg-[#bb1919] text-white shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-[72px] items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Brand Name */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <Link href={lang === 'en' ? '/en' : '/'} className="flex items-center gap-2 sm:gap-3 shrink-0 group">
                <div className="h-9 w-9 sm:h-11 sm:w-11 bg-white p-1 rounded-sm flex items-center justify-center shrink-0 shadow-sm transition group-hover:scale-105">
                  <img
                    src="/sauthalhind.png"
                    alt="Sauthalhind Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-lg sm:text-2xl tracking-tight leading-none truncate text-white">
                    {lang === 'en' ? 'Sauthalhind' : 'جريدة صوت الهند'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-white/80 tracking-widest uppercase font-semibold leading-tight mt-0.5 sm:mt-1 truncate">
                    {lang === 'en' ? 'Live News & Analysis' : 'Sauthalhind News'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4 text-xs font-bold shrink-0">
              {/* Search Link Button */}
              <Link
                href="/search"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition text-white"
                title="البحث في الأخبار"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{lang === 'en' ? 'Search' : 'بحث'}</span>
              </Link>

              {/* Language Switcher */}
              <Link
                href={lang === 'en' ? '/' : '/en'}
                className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 transition text-white border border-white/20"
              >
                {lang === 'en' ? 'العربية' : 'English'}
              </Link>
            </div>

            {/* Mobile Controls (Search Icon + Hamburger) */}
            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/search"
                className="p-2.5 rounded text-white hover:bg-white/15 transition flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded text-white hover:bg-white/15 transition flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#800f0f] border-t border-white/10 text-white shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-4">
            {/* Quick Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search stories...' : 'ابحث عن خبر أو موضوع...'}
                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/60 outline-none focus:bg-white/20 focus:border-white transition"
              />
              <button
                type="submit"
                className="bg-white text-[#bb1919] font-bold px-4 py-2 rounded text-sm hover:bg-gray-100 transition shrink-0 min-h-[44px]"
              >
                {lang === 'en' ? 'Go' : 'بحث'}
              </button>
            </form>

            {/* Categories List in Mobile Menu */}
            <div>
              <div className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'News Sections' : 'الأقسام الإخبارية'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={lang === 'en' ? '/en' : '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded text-sm font-bold transition flex items-center min-h-[44px] ${
                    pathname === '/' || pathname === '/en' ? 'bg-white text-[#bb1919]' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  {lang === 'en' ? 'Home' : 'الرئيسية'}
                </Link>
                {categories.map((cat) => {
                  const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <Link
                      key={cat}
                      href={`/category/${encodeURIComponent(cat)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded text-sm font-semibold transition flex items-center min-h-[44px] ${
                        isActive ? 'bg-white text-[#bb1919] font-bold' : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      {translateCategory(cat)}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Language & Useful Links */}
            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <Link
                href={lang === 'en' ? '/' : '/en'}
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold bg-white/20 px-3 py-1.5 rounded hover:bg-white/30 transition text-white min-h-[44px] flex items-center"
              >
                🌐 {lang === 'en' ? 'الانتقال إلى النسخة العربية' : 'Switch to English Edition'}
              </Link>
              <div className="flex items-center gap-4 text-white/80">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">من نحن</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-2">اتصل بنا</Link>
                <Link href="/feed.xml" target="_blank" className="hover:text-white py-2 text-[#ffebeb]">RSS</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Categories Ribbon */}
      <div className="bg-[#901414] text-white sticky top-0 z-40 shadow-[0_3px_10px_rgba(0,0,0,0.12)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap scrollbar-none">
            <Link
              href={lang === 'en' ? '/en' : '/'}
              className={`transition shrink-0 py-1 ${
                pathname === '/' || pathname === '/en'
                  ? 'border-b-2 border-white font-bold text-white pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Home' : 'الرئيسية'}
            </Link>

            {categories.map((cat) => {
              const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
              return (
                <Link
                  key={cat}
                  href={`/category/${encodeURIComponent(cat)}`}
                  className={`transition shrink-0 py-1 ${
                    isActive
                      ? 'border-b-2 border-white font-bold text-white pb-0.5'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {translateCategory(cat)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
