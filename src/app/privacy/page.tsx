import { Container } from '@/components/ui';
import { Header } from '@/components/header';
import Footer from '@/components/footer';

export const metadata = {
  title: 'سياسة الخصوصية | Sauthalhind',
  description: 'سياسة الخصوصية لجريدة صوت الهند',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* Unified Responsive Header */}
      <Header />

      <Container className="py-6 sm:py-12">
        <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 border-b-2 border-[#bb1919] inline-block pb-2">
            سياسة الخصوصية
          </h1>
          
          <div className="prose prose-sm sm:prose text-gray-700 leading-relaxed sm:leading-loose space-y-4">
            <p>مرحباً بك في موقع جريدة صوت الهند. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية المعلومات التي تقدمها لنا.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">1. جمع المعلومات</h3>
            <p>نحن نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل عنوان البريد الإلكتروني عند الاشتراك في النشرة الإخبارية، أو عند التواصل معنا عبر نموذج الاتصال.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">2. استخدام المعلومات</h3>
            <p>نستخدم المعلومات التي نجمعها لتحسين تجربتك على موقعنا، الرد على استفساراتك، وتقديم محتوى إخباري مخصص يلبي اهتماماتك.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">3. ملفات تعريف الارتباط (Cookies)</h3>
            <p>يستخدم موقعنا ملفات تعريف الارتباط لجمع بيانات مجهولة المصدر حول حركة الزوار وتفاعلهم مع الموقع، وذلك بهدف تحسين أداء الموقع وتقديم تجربة مستخدم أفضل.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">4. مشاركة المعلومات</h3>
            <p>نحن لا نقوم ببيع أو تأجير معلوماتك الشخصية لأي أطراف ثالثة. قد نشارك بعض البيانات المجهولة مع شركاء تحليلات الويب الموثوقين لفهم كيفية استخدام موقعنا.</p>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-2">5. التغييرات على سياسة الخصوصية</h3>
            <p>نحتفظ بالحق في تحديث أو تغيير سياسة الخصوصية الخاصة بنا في أي وقت. سنقوم بنشر أي تغييرات على هذه الصفحة.</p>
            
            <p className="mt-8 text-xs sm:text-sm text-gray-400">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
