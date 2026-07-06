import Image from 'next/image';
import type { Metadata } from 'next';
import { cards, headlineList, leadSlides, leadStory, navigation, sectionCards } from '@/data/site';
import { Container } from '@/components/ui';

const heroImage = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80';

export const metadata: Metadata = {
  title: 'جريدة صوت الهند | أخبار عربية حديثة',
  description: 'منصة أخبار عربية بتصميم نظيف ومريح على طريقة Apple: هادئ، واضح، وسهل التصفح على الهاتف.',
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-background text-brand-onSurface">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-brand-onSurfaceVariant shadow-sm sm:hidden">Menu</button>
              <div>
                <div className="font-headline-md text-[18px] font-semibold tracking-[-0.02em] text-brand-primary sm:text-[22px]">جريدة صوت الهند</div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/35">Sawt Al-Hind News</div>
              </div>
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              {navigation.slice(0, 6).map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-brand-onSurfaceVariant transition hover:text-brand-primary">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="rounded-full border border-black/8 bg-white p-2 text-brand-onSurfaceVariant shadow-sm">⌕</button>
              <button className="rounded-full border border-black/8 bg-white px-3 py-2 text-sm font-medium text-brand-onSurfaceVariant shadow-sm">EN</button>
            </div>
          </div>
        </Container>
      </header>

      <div className="border-b border-black/5 bg-brand-surfaceLow">
        <Container className="py-3">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            <Chip>عاجل</Chip>
            <div className="flex gap-8 text-sm text-brand-onSurfaceVariant">
              {headlineList.map((item) => (
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
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
          <article className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[280px] lg:min-h-[560px]">
                <Image src={heroImage} alt="Featured news" fill className="object-cover" priority />
              </div>
              <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Chip>{leadStory.category}</Chip>
                    <Chip>Featured</Chip>
                  </div>
                  <h1 className="mt-5 max-w-xl font-headline-xl-mobile text-[28px] leading-[1.32] tracking-[-0.03em] text-brand-onSurface sm:text-[36px] sm:leading-[1.2]">
                    {leadStory.title}
                  </h1>
                  <p className="mt-4 max-w-lg text-[16px] leading-8 text-brand-onSurfaceVariant sm:text-[18px]">
                    {leadStory.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-brand-onSurfaceVariant">
                  <span>{leadStory.author}</span>
                  <span>•</span>
                  <span>{leadStory.time}</span>
                  <span>•</span>
                  <span>{leadStory.readingTime}</span>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <SectionTitle title="أبرز العناوين" action="عرض الكل" />
              <div className="space-y-4">
                {headlineList.slice(0, 3).map((item) => (
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

            <div className="rounded-[24px] border border-black/6 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <SectionTitle title="مباشر" action="Live" />
              <div className="rounded-[20px] bg-brand-surfaceLow p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">On Air</div>
                <div className="mt-2 font-headline-md text-[18px] leading-7 text-brand-onSurface">اجتماع عاجل حول تطورات المنطقة</div>
                <p className="mt-2 text-sm leading-7 text-brand-onSurfaceVariant">تحديثات فورية ومختصرة، مصممة للقراءة السريعة على الهاتف.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(17,24,39,0.08)]">
              <div className="relative h-48">
                <Image src={card.image} alt={card.title} fill className="object-cover" />
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-xs font-semibold text-brand-primary">{card.category}</div>
                <h3 className="mt-2 text-[17px] font-semibold leading-7 tracking-[-0.01em] text-brand-onSurface">{card.title}</h3>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)]">
            <SectionTitle title="آخر الأخبار" action="تحديث مباشر" />
            <div className="space-y-4">
              {sectionCards[0].items.map((item, index) => (
                <div key={item} className="flex items-start gap-4 border-b border-black/6 pb-4 last:border-0 last:pb-0">
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

          <div className="rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)]">
            <SectionTitle title="الأكثر قراءة" action="كل القصص" />
            <div className="space-y-4">
              {sectionCards[1].items.map((item) => (
                <div key={item} className="rounded-[20px] bg-brand-surfaceLow p-4">
                  <div className="text-[15px] font-semibold leading-7 text-brand-onSurface">{item}</div>
                  <div className="mt-2 text-xs text-brand-onSurfaceVariant">قراءة مختارة</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-black/6 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-6">
          <SectionTitle title="الأقسام" action="تصفح" />
          <div className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {headlineList.slice(0, 3).map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <div className="relative h-44">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold text-brand-primary">{item.category}</div>
                <h3 className="mt-2 text-[16px] font-semibold leading-7 text-brand-onSurface">{item.title}</h3>
              </div>
            </article>
          ))}
        </section>
      </Container>

      <footer className="mt-8 border-t border-black/6 bg-white">
        <Container className="py-8">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="font-headline-md text-[22px] font-semibold text-brand-primary">جريدة صوت الهند</div>
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-onSurfaceVariant">
                منصة أخبار عربية حديثة، نظيفة، وسريعة، مصممة لتبدو ممتازة على الهاتف والكمبيوتر مع تجربة قراءة مريحة.
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
