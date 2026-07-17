import { Container } from '@/components/ui';
import Link from 'next/link';
import Footer from '@/components/footer';

export const metadata = {
  title: 'من نحن | Sawt Al-Hind News',
  description: 'معلومات عن جريدة صوت الهند',
};

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">من نحن</h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed">
            <p><strong>جريدة صوت الهند (Sawt Al-Hind News)</strong> هي منصة إعلامية وإخبارية رائدة تهدف إلى تقديم تغطية شاملة وموثوقة لأهم الأحداث في الهند والعالم العربي وعلى المستوى الدولي.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">رؤيتنا</h3>
            <p>نسعى لنكون الجسر الإعلامي الأبرز الذي يربط بين الهند والعالم العربي، من خلال تقديم محتوى إخباري يتسم بالشفافية والموضوعية والاحترافية العالية.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">مهمتنا</h3>
            <p>تقديم الأخبار العاجلة والتحليلات المعمقة في مختلف المجالات: السياسة، الاقتصاد، الثقافة، الرياضة، والشؤون الدينية، مع الالتزام بأعلى معايير العمل الصحفي.</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">تواصل معنا</h3>
            <p>نحن دائماً نرحب بآراء ومقترحات قرائنا. يمكنك زيارة صفحة <Link href="/contact" className="text-[#bb1919] font-bold hover:underline">اتصل بنا</Link> لأي استفسارات أو ملاحظات.</p>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
