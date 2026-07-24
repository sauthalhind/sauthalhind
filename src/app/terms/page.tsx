import { Container } from '@/components/ui';
import Link from 'next/link';
import Footer from '@/components/footer';

export const metadata = {
  title: 'شروط الاستخدام | Sauthalhind',
  description: 'شروط الاستخدام لجريدة صوت الهند',
};

export default function TermsPage() {
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
                <span className="text-[10px] opacity-75 mr-2 tracking-widest hidden sm:inline uppercase">Sauthalhind</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">شروط الاستخدام</h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed">
            <p>دخولك واستخدامك لموقع جريدة صوت الهند يخضع للشروط والأحكام التالية. باستخدامك للموقع، فإنك توافق على الالتزام بهذه الشروط.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. حقوق النشر والملكية الفكرية</h3>
            <p>جميع المحتويات المنشورة على هذا الموقع، بما في ذلك النصوص والصور والفيديوهات والشعارات، هي ملك لجريدة صوت الهند ولا يجوز إعادة إنتاجها أو توزيعها دون إذن كتابي مسبق.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. الاستخدام المقبول</h3>
            <p>توافق على استخدام الموقع لأغراض قانونية فقط، وتجنب أي تصرف قد يعطل عمل الموقع أو يؤثر على تجربة المستخدمين الآخرين.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. دقة المعلومات</h3>
            <p>نحن نسعى جاهدين لتقديم معلومات صحيحة ودقيقة، ولكننا لا نتحمل أي مسؤولية عن أي أخطاء أو سهو في المحتوى المقدم.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. الروابط الخارجية</h3>
            <p>قد يحتوي الموقع على روابط لمواقع خارجية. نحن غير مسؤولين عن محتوى تلك المواقع أو سياسات الخصوصية الخاصة بها.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. التعديلات</h3>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع يعني قبولك للشروط المعدلة.</p>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
