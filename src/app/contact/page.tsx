import { Container } from '@/components/ui';
import Link from 'next/link';
import Footer from '@/components/footer';

export const metadata = {
  title: 'اتصل بنا | Sawt Al-Hind News',
  description: 'تواصل مع فريق جريدة صوت الهند',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Header */}
      <header className="bg-[#bb1919] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <Link href="/">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-10 w-10 brightness-0 invert" />
              </Link>
              <div>
                <Link href="/">
                  <span className="font-bold text-xl sm:text-2xl tracking-tight">جريدة صوت الهند</span>
                </Link>
                <span className="text-[10px] opacity-75 mr-2 tracking-widest hidden sm:inline uppercase">Sawt Al-Hind News</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/en" className="hover:bg-white/10 px-3 py-1.5 rounded transition">English</Link>
            </div>
          </div>
        </div>
      </header>

      <Container className="py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">اتصل بنا</h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed mb-8">
            <p>يسعدنا تواصلكم معنا. إذا كانت لديكم أي استفسارات، اقتراحات، أو أخبار تودون مشاركتها معنا، يمكنكم استخدام وسائل التواصل التالية:</p>
            
            <div className="bg-gray-50 p-6 border border-gray-100 rounded-lg mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
              <ul className="space-y-3 font-medium">
                <li><strong className="text-gray-900">البريد الإلكتروني للإدارة:</strong> info@sawtalhind.news</li>
                <li><strong className="text-gray-900">قسم التحرير والأخبار:</strong> news@sawtalhind.news</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
