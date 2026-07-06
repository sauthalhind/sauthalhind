import { adminCategories, adminNews, adminStats } from '@/data/site';

const sections = [
  'Dashboard',
  'News',
  'Categories',
  'Tags',
  'Media Library',
  'Authors',
  'Comments',
  'SEO',
  'Ads',
  'Users',
  'Roles',
  'Settings'
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f3f6f9] text-brand-navy dark:bg-[#0b1220] dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-black/10 bg-brand-navy text-white lg:border-b-0 lg:border-l lg:border-black/10">
          <div className="p-6">
            <div className="rounded-3xl bg-white/10 p-4">
              <div className="text-sm text-white/70">جريدة صوت الهند</div>
              <div className="mt-1 font-cairo text-2xl font-bold">لوحة التحكم</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-white/50">Enterprise News CMS</div>
            </div>
          </div>

          <nav className="grid gap-1 px-4 pb-6 text-sm font-medium">
            {sections.map((item, index) => (
              <a
                key={item}
                href="#"
                className={`rounded-2xl px-4 py-3 transition ${
                  index === 0 ? 'bg-white text-brand-navy' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <section className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-cairo text-2xl font-bold">إدارة الأخبار والمحتوى</h1>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">إنشاء، تحرير، جدولة، رفع صور، وإدارة الأقسام والوسائط من مكان واحد.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-2xl bg-brand-teal px-4 py-3 font-semibold text-white">+ قصة جديدة</button>
              <button className="rounded-2xl border border-black/10 px-4 py-3 font-semibold dark:border-white/10">رفع وسائط</button>
              <button className="rounded-2xl border border-black/10 px-4 py-3 font-semibold dark:border-white/10">تصدير CSV</button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
                <div className="text-sm text-black/55 dark:text-white/55">{stat.label}</div>
                <div className="mt-3 font-cairo text-3xl font-bold">{stat.value}</div>
                <div className="mt-2 text-sm text-brand-teal">{stat.delta}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
                <h2 className="font-cairo text-xl font-bold">إدارة الأخبار</h2>
                <span className="text-sm text-brand-teal">إعداد النشر</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none dark:border-white/10" placeholder="عنوان الخبر" />
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none dark:border-white/10" placeholder="الكاتب" />
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none dark:border-white/10" placeholder="الرابط المختصر" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button className="rounded-2xl border border-black/10 px-4 py-3 text-right dark:border-white/10">جدولة النشر</button>
                    <button className="rounded-2xl border border-black/10 px-4 py-3 text-right dark:border-white/10">تعليم كخبر عاجل</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea
                    className="min-h-[240px] w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none dark:border-white/10"
                    placeholder="نص الخبر الكامل"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-2xl bg-brand-navy px-4 py-3 font-semibold text-white">حفظ مسودة</button>
                    <button className="rounded-2xl bg-brand-gold px-4 py-3 font-semibold text-brand-navy">نشر الآن</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
                <h2 className="font-cairo text-xl font-bold">رفع الملفات</h2>
                <span className="text-sm text-brand-teal">Media Upload</span>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-brand-teal/30 bg-brand-teal/5 p-6 text-center">
                <div className="text-4xl">⬆</div>
                <div className="mt-3 font-semibold">اسحب الصور أو الفيديو هنا</div>
                <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">JPG, PNG, WebP, MP4 حتى 10MB، مع تسمية تلقائية وتحسين للأرشيف.</p>
                <button className="mt-4 rounded-2xl bg-brand-teal px-4 py-3 font-semibold text-white">اختيار ملفات</button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="text-sm font-semibold text-black/60 dark:text-white/60">الوسائط الأخيرة</div>
                {['hero-politics.jpg', 'election-live.mp4', 'market-chart.png'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 dark:border-white/10">
                    <span>{item}</span>
                    <span className="text-sm text-brand-teal">جاهز</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
                <h2 className="font-cairo text-xl font-bold">الأقسام</h2>
                <span className="text-sm text-brand-teal">Categories</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {adminCategories.map((item) => (
                  <div key={item} className="rounded-2xl border border-black/10 px-4 py-3 dark:border-white/10">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
                <h2 className="font-cairo text-xl font-bold">أخبار الإدارة</h2>
                <span className="text-sm text-brand-teal">News Queue</span>
              </div>
              <div className="space-y-3">
                {adminNews.map((item) => (
                  <div key={item.title} className="grid gap-2 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="text-xs text-black/45 dark:text-white/45">{item.category}</div>
                      <div className="mt-1 font-medium leading-7">{item.title}</div>
                      <div className="mt-1 text-sm text-black/55 dark:text-white/55">{item.updated}</div>
                    </div>
                    <span className="rounded-full bg-brand-navy px-3 py-1 text-sm text-white">{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
