import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Link from 'next/link';
import Footer from '@/components/footer';

export const metadata = {
  title: 'من نحن | Sauthalhind',
  description: 'معلومات عن جريدة صوت الهند',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Unified Responsive Header */}
      <Header />

      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">
            من نحن
          </h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed sm:leading-loose space-y-4">
            <p><strong>جريدة صوت الهند (Sauthalhind)</strong> هي منصة إعلامية وإخبارية رائدة تهدف إلى تقديم تغطية شاملة وموثوقة لأهم الأحداث في الهند والعالم العربي وعلى المستوى الدولي.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">رؤيتنا</h3>
            <p>نسعى لنكون الجسر الإعلامي الأبرز الذي يربط بين الهند والعالم العربي، من خلال تقديم محتوى إخباري يتسم بالشفافية والموضوعية والاحترافية العالية.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">مهمتنا</h3>
            <p>تقديم الأخبار العاجلة والتحليلات المعمقة في مختلف المجالات: السياسة، الاقتصاد، الثقافة، الرياضة، والشؤون الدينية، مع الالتزام بأعلى معايير العمل الصحفي.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">تواصل معنا</h3>
            <p>نحن دائماً نرحب بآراء ومقترحات قرائنا. يمكنك زيارة صفحة <Link href="/contact" className="text-[#bb1919] font-bold hover:underline">اتصل بنا</Link> لأي استفسارات أو ملاحظات.</p>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
