import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Link from 'next/link';
import Footer from '@/components/footer';

export const metadata = {
  title: 'اتصل بنا | Sauthalhind',
  description: 'تواصل مع فريق جريدة صوت الهند',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Unified Responsive Header */}
      <Header />

      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">
            اتصل بنا
          </h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed sm:leading-loose mb-6 space-y-4">
            <p>يسعدنا تواصلكم معنا. إذا كانت لديكم أي استفسارات، اقتراحات، أو أخبار تودون مشاركتها معنا، يمكنكم استخدام وسائل التواصل التالية:</p>
            
            <div className="bg-gray-50 p-4 sm:p-6 border border-gray-100 rounded-md mt-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">معلومات الاتصال</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                <li><strong className="text-gray-900">البريد الإلكتروني للإدارة:</strong> <a href="mailto:info@sauthalhind.com" className="text-[#bb1919] hover:underline">info@sauthalhind.com</a></li>
                <li><strong className="text-gray-900">قسم التحرير والأخبار:</strong> <a href="mailto:news@sauthalhind.com" className="text-[#bb1919] hover:underline">news@sauthalhind.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
