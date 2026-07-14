import Image from 'next/image';
import type { Metadata } from 'next';
import { cards, headlineList, leadSlides, leadStory, navigation, sectionCards, topNetworks } from '@/data/site';
import { Container } from '@/components/ui';

const heroImage = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80';

const featuredTopics = [
  { label: 'Breaking', value: 'عاجل' },
  { label: 'Politics', value: 'سياسة' },
  { label: 'World', value: 'العالم' },
  { label: 'Economy', value: 'اقتصاد' },
  { label: 'Sports', value: 'رياضة' },
  { label: 'Culture', value: 'ثقافة' }
];

const spotlightBlocks = [
  {
    title: 'الهند والعالم العربي',
    summary: 'تغطية سياسية واقتصادية مركزة مع تصاميم بطاقات صغيرة للقراءة السريعة.',
    image: leadSlides[0]
  },
  {
    title: 'اقتصاد وأسواق',
    summary: 'خلاصة السوق والذهب والطاقة بأسلوب خبري واضح ومرتب.',
    image: leadSlides[1]
  },
  {
    title: 'رياضة اليوم',
    summary: 'أبرز نتائج المباريات والملفات التحليلية في واجهة نظيفة.',
    image: leadSlides[2]
  }
];

const trendingStories = headlineList.slice(0, 4);
const latestStories = [
  ...sectionCards[0].items,
  'جلسة عاجلة في البرلمان حول الإصلاحات',
  'مؤشرات اقتصادية جديدة ترفع توقعات النمو',
  'تغطية خاصة لمبادرة عربية رقمية موحدة',
  'آخر مستجدات المنطقة خلال الساعة الماضية'
];

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | Arabic News Portal',
  description: 'Arabic news portal with a standard, famous news-channel layout, trending sections, category blocks, and mobile-first editorial design.',
  alternates: { canonical: '/' }
};

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b border-black/8 pb-3">
      <h2 className="font-headline-md text-[20px] font-semibold tracking-[-0.01em] text-brand-onSurface">{title}</h2>
      {action ? <span className="text-sm font-medium text-brand-primary">{action}</span> : null}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs font-semibold text-brand-onSurfaceVariant">{children}</span>;
}

function NewsItem({ index, title, meta }: { index: number; title: string; meta: string }) {
  return (
    <article className="flex items-start gap-4 rounded-[20px] border border-black/6 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(17,24,39,0.07)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
        {index + 1}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-7 text-brand-onSurface">{title}</h3>
        <div className="mt-1 text-xs text-brand-onSurfaceVariant">{meta}</div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurfaceVariant shadow-sm sm:hidden">Menu</button>
              <div>
                <div className="font-headline-md text-[18px] font-semibold tracking-[-0.02em] text-brand-primary sm:text-[22px]">جريدة صوت الهند</div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/35">Sawt Al-Hind News</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 lg:flex">
              {navigation.slice(0, 6).map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-brand-onSurfaceVariant transition hover:text-brand-primary">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm font-medium text-brand-onSurfaceVariant shadow-sm">EN</button>
              <button className="rounded-full border border-black/8 bg-white p-2 text-brand-onSurfaceVariant shadow-sm">⌕</button>
            </div>
          </div>
        </Container>
      </header>

      <div className="border-b border-black/5 bg-brand-surfaceLow">
        <Container className="py-3">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            <Chip>عاجل</Chip>
            <div className="flex gap-8 text-sm text-brand-onSurfaceVariant">
              {trendingStories.map((item) => (
                <span key={item.title} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-6 sm:py-8 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.7fr]">
          <article className="overflow-hidden rounded-[32px] border border-black/6 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
            <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
              <div className="relative min-h-[300px] lg:min-h-[620px]">
                <Image src={heroImage} alt="Featured news" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-7 lg:p-8">
                  <div className="flex flex-wrap gap-2 text-white">
                    <Chip>Featured</Chip>
                    <Chip>{leadStory.category}</Chip>
                  </div>
                  <h1 className="mt-5 max-w-2xl font-headline-xl-mobile text-[30px] leading-[1.28] tracking-[-0.03em] text-white sm:text-[42px] sm:leading-[1.15]">
                    {leadStory.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-[16px] leading-8 text-white/88 sm:text-[18px]">
                    {leadStory.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/85">
                    <span>{leadStory.author}</span>
                    <span>•</span>
                    <span>{leadStory.time}</span>
                    <span>•</span>
                    <span>{leadStory.readingTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">Top networks</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topNetworks.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                  <div className="mt-6 space-y-4">
                    <SectionTitle title="أبرز العناوين" action="عرض الكل" />
                    {trendingStories.slice(0, 3).map((item) => (
                      <article key={item.title} className="flex gap-4 rounded-[18px] p-2 transition hover:bg-brand-surfaceLow">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-brand-surfaceLow">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                          <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-6 text-brand-onSurface">{item.title}</h3>
                          <div className="mt-2 text-xs text-brand-onSurfaceVariant">{item.meta}</div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] bg-brand-surfaceLow p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Live desk</div>
                  <div className="mt-2 font-headline-md text-[18px] leading-7 text-brand-onSurface">بث مباشر وتحديثات فورية من غرفة الأخبار</div>
                  <p className="mt-2 text-sm leading-7 text-brand-onSurfaceVariant">تغطية سريعة وقابلة للقراءة على الهاتف، مع ترتيب ذكي للموضوعات النشطة.</p>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <SectionTitle title="Trending now" action="Live updates" />
              <div className="space-y-3">
                {trendingStories.map((item, index) => (
                  <NewsItem key={item.title} index={index} title={item.title} meta={`${item.category} • ${item.meta}`} />
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <SectionTitle title="Video / Live" action="Watch" />
              <div className="overflow-hidden rounded-[24px] bg-brand-surfaceLow">
                <div className="aspect-video bg-[linear-gradient(135deg,#10212a_0%,#26434d_45%,#d3ab57_100%)]" />
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">On Air</div>
                  <div className="mt-2 text-[16px] font-semibold leading-7 text-brand-onSurface">موجز الساعة + أهم الأخبار العاجلة</div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spotlightBlocks.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(17,24,39,0.08)]">
              <div className="relative h-48">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-brand-primary">Spotlight</div>
                <h3 className="mt-2 text-[18px] font-semibold leading-7 tracking-[-0.01em] text-brand-onSurface">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-brand-onSurfaceVariant">{item.summary}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="آخر الأخبار" action="تحديث مباشر" />
            <div className="space-y-4">
              {latestStories.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-4 border-b border-black/6 pb-4 last:border-0 last:pb-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold leading-7 text-brand-onSurface">{item}</div>
                    <div className="mt-1 text-xs text-brand-onSurfaceVariant">منذ قليل</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="الأقسام" action="تصفح" />
            <div className="grid gap-3 sm:grid-cols-2">
              {navigation.map((item) => (
                <div key={item} className="rounded-[22px] border border-black/6 bg-brand-surfaceLow p-4 transition hover:bg-white">
                  <div className="text-sm font-semibold text-brand-onSurface">{item}</div>
                  <div className="mt-1 text-xs text-brand-onSurfaceVariant">Stories and live updates</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
          <SectionTitle title="Highlights grid" action="Editor picks" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(17,24,39,0.08)]">
                <div className="relative h-48">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-xs font-semibold text-brand-primary">{card.category}</div>
                  <h3 className="mt-2 text-[17px] font-semibold leading-7 tracking-[-0.01em] text-brand-onSurface">{card.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="عاجل ومباشر" action="Live" />
            <div className="rounded-[24px] bg-brand-surfaceLow p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">On Air</div>
              <div className="mt-2 text-[18px] font-semibold leading-7 text-brand-onSurface">تحديثات لحظة بلحظة من أهم الملفات الساخنة</div>
              <p className="mt-2 text-sm leading-7 text-brand-onSurfaceVariant">واجهة تم تصميمها لتبدو مثل قناة عربية مشهورة: واضحة، سريعة، ومليئة بالأخبار المتنوعة.</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
            <SectionTitle title="Reading now" action="Top stories" />
            <div className="space-y-3">
              {headlineList.map((item) => (
                <article key={item.title} className="flex gap-4 rounded-[20px] border border-black/6 p-3 transition hover:bg-brand-surfaceLow">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-brand-surfaceLow">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-6 text-brand-onSurface">{item.title}</h3>
                    <div className="mt-2 text-xs text-brand-onSurfaceVariant">{item.meta}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Container>

      <footer className="mt-8 border-t border-black/6 bg-white">
        <Container className="py-8">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="font-headline-md text-[22px] font-semibold text-brand-primary">جريدة صوت الهند</div>
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-onSurfaceVariant">
                منصة أخبار عربية حديثة، designed for standard news-channel presentation, fast reading, and strong mobile viewing.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-onSurface">روابط سريعة</div>
              <div className="mt-3 space-y-2 text-sm text-brand-onSurfaceVariant">
                <div>عن المنصة</div>
                <div>سياسة الخصوصية</div>
                <div>اتصل بنا</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-onSurface">النشرة</div>
              <div className="mt-3 flex gap-2">
                <input className="w-full rounded-full border border-black/8 bg-white px-4 py-3 text-sm outline-none" placeholder="بريدك الإلكتروني" />
                <button className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">اشتراك</button>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
