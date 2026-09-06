import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 py-12 mt-12 border-t-4 border-[#bb1919]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-2xl tracking-tight text-white">جريدة صوت الهند</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-md">
              صوت الهند هي منصة إخبارية رائدة تقدم تغطية شاملة وموثوقة لأحدث الأخبار والتطورات في الهند والعالم. نلتزم بالدقة والموضوعية في نقل الخبر.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-800 pb-2">روابط هامة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">شروط الاستخدام</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 border-b border-gray-800 pb-2">تابعنا</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/feed.xml" target="_blank" className="hover:text-white transition flex items-center gap-2"><span className="text-[#bb1919]">RSS</span> خريطة الأخبار</a></li>
              <li><Link href="/search" className="hover:text-white transition">البحث المتقدم</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} جريدة صوت الهند. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
