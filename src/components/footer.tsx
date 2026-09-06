"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f1d25] text-gray-400 py-10 sm:py-12 mt-12 border-t-4 border-[#bb1919]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="h-10 w-10 bg-white p-1 rounded-sm flex items-center justify-center shrink-0 shadow-sm">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#ffebeb] transition">
                  جريدة صوت الهند
                </span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">Sauthalhind News</span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-md">
              منصة صوت الهند الإخبارية تقدم تغطية إخبارية مستقلة ومباشرة على مدار الساعة للأحداث والقضايا الثقافية والسياسية في شبه القارة الهندية والعالم العربي.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-sm mb-4 border-b border-gray-800 pb-2">روابط هامة</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link href="/about" className="hover:text-white transition block py-0.5">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-white transition block py-0.5">اتصل بنا</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition block py-0.5">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition block py-0.5">شروط الاستخدام</Link></li>
            </ul>
          </div>

          {/* Newsletter & Search */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-sm mb-4 border-b border-gray-800 pb-2">النشرة الإخبارية</h3>
            <p className="text-xs text-gray-400 mb-3">اشترك في خدمة العناوين العاجلة وموجز الأخبار اليومي.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full bg-[#1b2f3a] text-white px-3.5 py-2.5 text-xs outline-none border border-transparent focus:border-[#bb1919] rounded-sm transition min-h-[40px]"
              />
              <button
                type="button"
                className="bg-[#bb1919] hover:bg-[#901414] px-5 py-2.5 text-xs font-bold text-white transition rounded-sm shrink-0 min-h-[40px]"
              >
                اشتراك
              </button>
            </form>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <a href="/feed.xml" target="_blank" className="hover:text-white transition flex items-center gap-1.5 text-gray-400">
                <span className="text-[#bb1919] font-bold">RSS</span> خريطة الأخبار
              </a>
              <span className="text-gray-700">|</span>
              <Link href="/search" className="hover:text-white transition text-gray-400">
                البحث في الموقع
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right text-[11px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} جريدة صوت الهند. جميع الحقوق محفوظة.</p>
          <p>منصة مستقلة للأخبار والتحليلات</p>
        </div>
      </div>
    </footer>
  );
}
