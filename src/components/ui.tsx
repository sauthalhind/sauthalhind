import { cn } from '@/lib/cn';

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="font-cairo text-xl font-bold text-brand-navy dark:text-white">{title}</h2>
      {action ? <span className="text-sm text-brand-teal">{action}</span> : null}
    </div>
  );
}

export function NewsCard({ category, title, excerpt, meta }: { category: string; title: string; excerpt: string; meta: string }) {
  return (
    <article className="group rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-brand-dark">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="rounded-full bg-brand-teal/10 px-3 py-1 font-semibold text-brand-teal">{category}</span>
        <span className="text-black/40 dark:text-white/40">{meta}</span>
      </div>
      <h3 className="font-cairo text-lg font-bold leading-8 text-brand-navy group-hover:text-brand-teal dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-black/70 dark:text-white/70">{excerpt}</p>
    </article>
  );
}
