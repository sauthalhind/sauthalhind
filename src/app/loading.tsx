export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-background px-6 text-brand-onSurface">
      <div className="w-full max-w-md rounded-[32px] border border-black/6 bg-white p-8 text-center shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-surfaceLow">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
        </div>
        <div className="mt-6 text-[22px] font-semibold tracking-[-0.02em]">Loading news...</div>
        <p className="mt-2 text-sm leading-7 text-brand-onSurfaceVariant">
          Getting the latest stories, categories, and admin data ready.
        </p>
        <div className="mt-6 space-y-3">
          <div className="h-4 animate-pulse rounded-full bg-black/8" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-black/8" />
          <div className="h-4 w-4/6 animate-pulse rounded-full bg-black/8" />
        </div>
      </div>
    </main>
  );
}
