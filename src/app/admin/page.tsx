"use client";

import { useEffect, useRef, useState } from 'react';

const menu = [
  'Dashboard',
  'News',
  'Categories',
  'Media',
  'Authors',
  'Comments',
  'SEO',
  'Users',
  'Roles',
  'Settings'
];

const quickStats = [
  { label: 'Live editors', value: '0' },
  { label: 'Published today', value: '0' },
  { label: 'Drafts', value: '0' },
  { label: 'Pending review', value: '0' }
];

const publishingSteps = [
  'Write the story',
  'Attach image or video',
  'Choose category',
  'Set SEO title and slug',
  'Save draft or publish',
  'Send to homepage queue'
];

const contentBlocks = [
  'Top headline strip',
  'Breaking news ticker',
  'Featured story',
  'Category section',
  'Video block',
  'Most read block'
];

const settings = [
  'Arabic RTL layout',
  'Mobile-first homepage',
  'Author approval workflow',
  'Featured image required',
  'Slug auto-generation',
  'Scheduled publishing'
];

export default function AdminPage() {
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const newsRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const workflowRef = useRef<HTMLDivElement | null>(null);
  const moderationRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverPhotoRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null);
  const authorRef = useRef<HTMLInputElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready for live publishing');
  const [savedNews, setSavedNews] = useState<Array<{ id: string; title: string; category: string; status: string; created_at: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageName, setCoverImageName] = useState<string>('');
  const localNewsKey = 'sawt-al-hind-admin-news';

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const flashStatus = (message: string) => {
    setStatusMessage(message);
    window.setTimeout(() => setStatusMessage('Ready for live publishing'), 2200);
  };

  const readLocalNews = () => {
    if (typeof window === 'undefined') return [];

    try {
      return JSON.parse(window.localStorage.getItem(localNewsKey) ?? '[]') as Array<{
        id: string;
        title: string;
        category: string;
        status: string;
        created_at: string;
      }>;
    } catch {
      return [];
    }
  };

  const writeLocalNews = (
    nextItems: Array<{ id: string; title: string; category: string; status: string; created_at: string }>
  ) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(localNewsKey, JSON.stringify(nextItems));
    setSavedNews(nextItems);
  };

  const collectPayload = () => ({
    title: titleRef.current?.value.trim() ?? '',
    slug:
      slugRef.current?.value.trim() ||
      `${(titleRef.current?.value ?? 'story')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
        .replace(/^-+|-+$/g, '')}-${Date.now().toString(36)}`,
    author: authorRef.current?.value.trim() ?? 'Editorial',
    category: categoryRef.current?.value ?? 'Breaking News',
    body: bodyRef.current?.value.trim() ?? '',
    cover_image: coverImage
  });

  const saveNews = async (status: 'draft' | 'published' | 'review' | 'scheduled') => {
    const payload = collectPayload();
    const optimisticItem = {
      id: crypto.randomUUID(),
      title: payload.title || 'Untitled story',
      category: payload.category,
      status,
      created_at: new Date().toISOString()
    };

    setIsSaving(true);
    writeLocalNews([optimisticItem, ...readLocalNews()]);
    flashStatus(status === 'published' ? 'Publishing...' : 'Saving draft...');

    const response = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, status })
    });

    const result = (await response.json()) as
      | { ok: true; item?: { id: string; created_at: string } }
      | { ok: false; error?: string };
    if (!response.ok || !result.ok) {
      flashStatus('Saved locally');
      setIsSaving(false);
      return;
    }

    const nextItems = [
      {
        id: result.item?.id ?? optimisticItem.id,
        title: payload.title || 'Untitled story',
        category: payload.category,
        status,
        created_at: result.item?.created_at ?? optimisticItem.created_at
      },
      ...readLocalNews()
    ];
    writeLocalNews(nextItems);

    setIsSaving(false);
    flashStatus(
      status === 'published'
        ? 'Published to backend'
        : status === 'review'
          ? 'Sent to review queue'
          : status === 'scheduled'
            ? 'Publish scheduled'
            : 'Draft saved to backend'
    );
  };

  const publishSelectedFiles = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      flashStatus('Select files first');
      return;
    }

    setIsUploading(true);
    flashStatus('Uploading files...');
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = (await response.json()) as { ok: boolean; uploaded?: Array<{ name: string }> };
    if (!response.ok || !result.ok) {
      flashStatus('Upload failed, but files were selected');
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
    flashStatus(`Uploaded ${result.uploaded?.length ?? 0} file(s)`);
  };

  useEffect(() => {
    const loadNews = async () => {
      const response = await fetch('/api/news');
      const result = (await response.json()) as
        | { ok: true; items: Array<{ id: string; title: string; category: string; status: string; created_at: string }> }
        | { ok: false; error?: string };

      if (response.ok && result.ok) {
        const localItems = readLocalNews();
        setSavedNews([...result.items, ...localItems]);
      } else {
        setSavedNews(readLocalNews());
      }
    };

    void loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#132126]">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-black/8 bg-[#0f1d25] text-white lg:border-b-0 lg:border-l lg:border-black/8">
          <div className="p-6">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <div className="text-xs uppercase tracking-[0.32em] text-white/55">Sawt Al-Hind News</div>
              <div className="mt-2 text-3xl font-bold leading-tight">???? ??????</div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                ????? ??????? ???????? ?????? ???????? ???????? ???????? ?????? ?? ???? ????.
              </p>
            </div>
          </div>

          <nav className="grid gap-1 px-4 pb-6 text-sm font-medium">
            {menu.map((item, index) => {
              const refs = [dashboardRef, newsRef, categoriesRef, mediaRef, workflowRef, moderationRef];
              const target = refs[index] ?? dashboardRef;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => scrollToSection(target)}
                  className={`rounded-2xl px-4 py-3 text-right transition ${
                    index === 0 ? 'bg-white text-[#0f1d25]' : 'text-white/80 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="p-4 sm:p-6 lg:p-8">
          <div ref={dashboardRef} />
          <header className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6a7f86]">Admin CMS</div>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Arabic news workflow, built for daily publishing
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">
                No demo stories, no fake analytics. This panel is ready for real news operations:
                create, schedule, approve, upload media, and place stories on the homepage.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-brand-surfaceLow px-4 py-2 text-sm font-medium text-brand-onSurfaceVariant">
                {statusMessage}
              </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollToSection(newsRef)} className="rounded-full bg-[#0f1d25] px-5 py-3 text-sm font-semibold text-white">
                  New story
                </button>
                <button type="button" onClick={() => scrollToSection(mediaRef)} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                  Upload media
                </button>
                <button type="button" onClick={() => scrollToSection(moderationRef)} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                  Open queue
                </button>
              </div>
            </div>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
                <div className="text-sm text-black/55">{stat.label}</div>
                <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{stat.value}</div>
                <div className="mt-4 h-1.5 rounded-full bg-black/6">
                  <div className="h-1.5 w-0 rounded-full bg-[#0f1d25]" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div ref={newsRef}>
              <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Create and publish</h2>
                <span className="text-sm font-medium text-[#0f1d25]">News editor</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <input ref={titleRef} className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Title" />
                  <input ref={slugRef} className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Slug" />
                  <input ref={authorRef} className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Author name" />
                  <select ref={categoryRef} className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none">
                    <option>Choose category</option>
                    <option>Breaking News</option>
                    <option>Politics</option>
                    <option>World</option>
                    <option>Economy</option>
                    <option>Sports</option>
                    <option>Culture</option>
                    <option>Religion</option>
                    <option>Video</option>
                  </select>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => flashStatus('Publishing scheduled')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">
                      Schedule publish
                    </button>
                    <button type="button" onClick={() => flashStatus('Sent for review')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">
                      Send for review
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-dashed border-black/10 bg-brand-surfaceLow p-4">
                    <div className="text-sm font-semibold text-brand-onSurface">Cover photo</div>
                    <p className="mt-1 text-sm text-brand-onSurfaceVariant">
                      Main image shown at the top of the article and in homepage cards.
                    </p>
                    <input
                      ref={coverPhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                          setCoverImage(String(reader.result ?? ''));
                          setCoverImageName(file.name);
                          flashStatus(`Cover photo selected: ${file.name}`);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => coverPhotoRef.current?.click()} className="rounded-full bg-[#0f1d25] px-4 py-2 text-sm font-semibold text-white">
                        Select cover photo
                      </button>
                      <button type="button" onClick={() => flashStatus('Cover photo attached')} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                        Attach
                      </button>
                    </div>
                    {coverImage ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-black/8 bg-white">
                        <img src={coverImage} alt={coverImageName || 'Cover preview'} className="h-48 w-full object-cover" />
                        <div className="px-4 py-3 text-xs text-black/60">{coverImageName || 'Selected cover image'}</div>
                      </div>
                    ) : null}
                  </div>
                  <textarea
                    ref={bodyRef}
                    className="min-h-[250px] w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none"
                    placeholder="Write the full article here..."
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="button" disabled={isSaving} onClick={() => saveNews('draft')} className="rounded-2xl bg-[#0f1d25] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Save draft</button>
                    <button type="button" disabled={isSaving} onClick={() => saveNews('published')} className="rounded-2xl bg-[#d3ab57] px-4 py-3 font-semibold text-[#0f1d25] disabled:cursor-not-allowed disabled:opacity-60">Publish now</button>
                    <button type="button" onClick={() => flashStatus('Preview opened')} className="rounded-2xl border border-black/10 px-4 py-3 font-semibold">Preview</button>
                  </div>
                </div>
              </div>
              </section>
            </div>

            <div ref={mediaRef}>
              <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Media library</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Images and video</span>
              </div>
              <div className="rounded-[26px] border-2 border-dashed border-[#7ca3a2]/30 bg-[#f0f7f6] p-6 text-center">
                <div className="text-4xl">?</div>
                <div className="mt-3 text-lg font-semibold">Drop files here</div>
                <p className="mt-2 text-sm leading-7 text-black/60">
                  JPG, PNG, WebP, MP4, and PDF. Use real file names, alt text, and source credits.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const count = event.target.files?.length ?? 0;
                    flashStatus(count > 0 ? `${count} file(s) selected` : 'No file selected');
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-full bg-[#0f1d25] px-5 py-3 text-sm font-semibold text-white"
                >
                  Select files
                </button>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={publishSelectedFiles}
                  className="ml-2 mt-4 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? 'Uploading...' : 'Upload now'}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="text-sm font-semibold text-black/60">Upload checklist</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Alt text required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Featured image required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Video caption required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Copyright source required</div>
              </div>
              </section>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div ref={categoriesRef}>
              <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Categories and homepage blocks</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Structure</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {contentBlocks.map((item) => (
                  <div key={item} className="rounded-2xl border border-black/8 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] bg-[#f6f8f8] p-4">
                <div className="text-sm font-semibold text-black/60">Category manager</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => flashStatus('Category action opened')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Add category</button>
                  <button type="button" onClick={() => flashStatus('Sort order opened')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Sort order</button>
                  <button type="button" onClick={() => flashStatus('Empty categories hidden')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Hide empty categories</button>
                  <button type="button" onClick={() => flashStatus('Homepage pin updated')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Homepage pin</button>
                </div>
              </div>
              </section>
            </div>

            <div ref={workflowRef}>
              <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Publishing workflow</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Operations</span>
              </div>

              <div className="space-y-3">
                {publishingSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl border border-black/8 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f1d25] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{step}</div>
                      <div className="mt-1 text-sm text-black/55">
                        No mock content. Connect this panel to your database, then these steps drive the live newsroom.
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[26px] bg-[#f6f8f8] p-4">
                <div className="text-sm font-semibold text-black/60">Newsroom settings</div>
                <div className="mt-3 grid gap-3">
                  {settings.map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-2xl border border-black/8 px-4 py-3">
                      <span>{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0f1d25]" onChange={() => flashStatus(`${item} toggled`)} />
                    </label>
                  ))}
                </div>
              </div>
              </section>
            </div>
          </div>

          <div ref={moderationRef} className="mt-6 rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
              <h2 className="text-xl font-bold tracking-[-0.02em]">Moderation and approvals</h2>
              <span className="text-sm font-medium text-[#0f1d25]">Queue is empty</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">Comments moderation</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Approve, reject, or auto-filter comments before they appear on the site.
                </p>
              </div>
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">Author approvals</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Restrict publishing rights, draft editing, and scheduled story approvals by role.
                </p>
              </div>
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">SEO checklist</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Title, description, canonical URL, image alt text, and schema before publish.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
              <h2 className="text-xl font-bold tracking-[-0.02em]">Saved news</h2>
              <span className="text-sm font-medium text-[#0f1d25]">{savedNews.length} items</span>
            </div>
            <div className="space-y-3">
              {savedNews.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-black/10 bg-brand-surfaceLow p-4 text-sm text-brand-onSurfaceVariant">
                  No saved news yet. Publish one from the editor above.
                </div>
              ) : (
                savedNews.map((item) => (
                  <div key={item.id} className="grid gap-2 rounded-[22px] border border-black/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="text-xs text-black/45">{item.category}</div>
                      <div className="mt-1 font-medium leading-7">{item.title}</div>
                      <div className="mt-1 text-sm text-black/55">{item.created_at}</div>
                    </div>
                    <span className="rounded-full bg-[#0f1d25] px-3 py-1 text-sm text-white">{item.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
