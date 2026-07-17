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

  // Custom CMS States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [categoriesList, setCategoriesList] = useState<string[]>([
    'Breaking News', 'Politics', 'World', 'Economy', 'Sports', 'Culture', 'Religion', 'Video'
  ]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [seoBody, setSeoBody] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const [statusMessage, setStatusMessage] = useState('Ready for live publishing');
  const [savedNews, setSavedNews] = useState<Array<{ id: string; title: string; slug: string; category: string; status: string; created_at: string; cover_image?: string | null; body?: string; author?: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageName, setCoverImageName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'loading' | 'supabase' | 'fallback' | 'error'>('loading');
  const [debugInfo, setDebugInfo] = useState<{ supabaseConfigured: boolean; newsSource: string; newsCount: number; newsError: string | null; timestamp: string } | null>(null);
  const localNewsKey = 'sawt-al-hind-admin-news';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = window.sessionStorage.getItem('sawt-al-hind-admin-auth') === 'true';
      if (isAuth) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin123';
    if (passcode === correctPasscode) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('sawt-al-hind-admin-auth', 'true');
      }
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.');
    }
  };

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
        slug: string;
        category: string;
        status: string;
        created_at: string;
        cover_image?: string | null;
        body?: string;
        author?: string;
      }>;
    } catch {
      return [];
    }
  };

  const writeLocalNews = (
    nextItems: Array<{ id: string; title: string; slug: string; category: string; status: string; created_at: string; cover_image?: string | null; body?: string; author?: string }>
  ) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(localNewsKey, JSON.stringify(nextItems));
    setSavedNews(nextItems);
  };

  const broadcastNewsUpdate = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('news-updated'));

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('sawt-al-hind-news');
      channel.postMessage({ type: 'news-updated', timestamp: Date.now() });
      channel.close();
    }
  };

  const normalizeNewsItem = (
    item: {
      id: string;
      title: string;
      slug?: string;
      category: string;
      status: string;
      created_at: string;
      cover_image?: string | null;
      body?: string;
      author?: string;
    }
  ) => ({
    ...item,
    slug: item.slug ?? item.title.toLowerCase().replace(/\s+/g, '-')
  });

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

  const fillFormFromNews = (item: { id: string; title: string; slug: string; category: string; status: string; created_at: string; cover_image?: string | null; body?: string; author?: string }) => {
    setEditingId(item.id);
    if (titleRef.current) titleRef.current.value = item.title;
    if (slugRef.current) slugRef.current.value = item.slug;
    if (authorRef.current) authorRef.current.value = item.author ?? 'Editorial';
    if (categoryRef.current) categoryRef.current.value = item.category;
    if (bodyRef.current) bodyRef.current.value = item.body ?? '';
    setCoverImage(item.cover_image ?? null);
    setCoverImageName('');
    setSeoTitle(item.title);
    setSeoSlug(item.slug);
    setSeoBody(item.body ?? '');
    flashStatus(`Editing ${item.title}`);
  };

  const resetEditor = () => {
    setEditingId(null);
    if (titleRef.current) titleRef.current.value = '';
    if (slugRef.current) slugRef.current.value = '';
    if (authorRef.current) authorRef.current.value = 'Editorial';
    if (categoryRef.current) categoryRef.current.value = 'Breaking News';
    if (bodyRef.current) bodyRef.current.value = '';
    setCoverImage(null);
    setCoverImageName('');
    setSeoTitle('');
    setSeoSlug('');
    setSeoBody('');
    flashStatus('Editor cleared');
  };

  const saveNews = async (status: 'draft' | 'published' | 'review' | 'scheduled') => {
    const payload = collectPayload();
    const optimisticItem = {
      id: editingId ?? crypto.randomUUID(),
      title: payload.title || 'Untitled story',
      slug: payload.slug,
      author: payload.author,
      category: payload.category,
      body: payload.body,
      cover_image: payload.cover_image,
      status,
      created_at: new Date().toISOString()
    };

    setIsSaving(true);
    try {
      const localItems = readLocalNews();
      const nextLocalItems = editingId
        ? localItems.map((item) => (item.id === editingId ? { ...item, ...optimisticItem } : item))
        : [optimisticItem, ...localItems];
      writeLocalNews(nextLocalItems);
      flashStatus(status === 'published' ? 'Publishing...' : editingId ? 'Saving changes...' : 'Saving draft...');

      const response = await fetch('/api/news', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload, status } : { ...payload, status })
      });

      const result = (await response.json()) as
        | { ok: true; item?: { id: string; created_at: string; slug?: string; author?: string; body?: string; cover_image?: string | null } }
        | { ok: false; error?: string };
      if (!response.ok || !result.ok) {
        flashStatus(result && !result.ok ? result.error ?? 'Saved locally' : 'Saved locally');
        return;
      }

      const currentItems = readLocalNews();
      const nextItems = editingId
        ? currentItems.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  id: result.item?.id ?? optimisticItem.id,
                  title: payload.title || 'Untitled story',
                  slug: payload.slug,
                  author: payload.author,
                  category: payload.category,
                  body: payload.body,
                  cover_image: payload.cover_image,
                  status,
                  created_at: result.item?.created_at ?? optimisticItem.created_at
                }
              : item
          )
        : [
            {
              id: result.item?.id ?? optimisticItem.id,
              title: payload.title || 'Untitled story',
              slug: payload.slug,
              author: payload.author,
              category: payload.category,
              body: payload.body,
              cover_image: payload.cover_image,
              status,
              created_at: result.item?.created_at ?? optimisticItem.created_at
            },
            ...currentItems
          ];
      writeLocalNews(nextItems);
      setEditingId(null);
      flashStatus(
        status === 'published'
          ? 'Published to backend'
          : status === 'review'
            ? 'Sent to review queue'
            : status === 'scheduled'
              ? 'Publish scheduled'
              : editingId
                ? 'Changes saved to backend'
                : 'Draft saved to backend'
      );
    } catch (error) {
      console.error('saveNews failed', error);
      flashStatus('Saved locally only');
    } finally {
      setIsSaving(false);
    }
  };

  const publishSelectedFiles = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      flashStatus('Select files first');
      return;
    }

    setIsUploading(true);
    try {
      flashStatus('Uploading files...');
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = (await response.json()) as { ok: boolean; uploaded?: Array<{ name: string; url?: string }>; error?: string };
      if (!response.ok || !result.ok) {
        flashStatus(result.error ?? 'Upload failed');
        return;
      }

      const firstUrl = result.uploaded?.[0]?.url;
      if (firstUrl) {
        setCoverImage(firstUrl);
      }
      flashStatus(`Uploaded ${result.uploaded?.length ?? 0} file(s)`);
    } catch (error) {
      console.error('publishSelectedFiles failed', error);
      flashStatus('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeNews = async (id: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/news?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        flashStatus(result.error ?? 'Delete failed');
        return;
      }

      writeLocalNews(readLocalNews().filter((item) => item.id !== id));
      if (editingId === id) {
        resetEditor();
      }
      flashStatus('News deleted');
    } catch (error) {
      console.error('removeNews failed', error);
      flashStatus('Delete failed');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublicDraft = async (item: { id: string; status: string }) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    setIsSaving(true);
    try {
      const response = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: nextStatus })
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        flashStatus(result.error ?? 'Status update failed');
        return;
      }

      writeLocalNews(readLocalNews().map((news) => (news.id === item.id ? { ...news, status: nextStatus } : news)));
      flashStatus(nextStatus === 'published' ? 'Marked public' : 'Saved as draft');
    } catch (error) {
      console.error('togglePublicDraft failed', error);
      flashStatus('Status update failed');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news', { cache: 'no-store' });
        const result = (await response.json()) as
          | { ok: true; items: Array<{ id: string; title: string; slug?: string; category: string; status: string; created_at: string; cover_image?: string | null; body?: string; author?: string }>; source?: string }
          | { ok: false; error?: string };

        if (response.ok && result.ok) {
          setDataSource(result.source === 'fallback' ? 'fallback' : 'supabase');
          const localItems = readLocalNews();
          setSavedNews([...result.items.map(normalizeNewsItem), ...localItems]);
        } else {
          setDataSource('fallback');
          setSavedNews(readLocalNews());
        }
      } catch (error) {
        console.error('loadNews failed', error);
        setDataSource('error');
        setSavedNews(readLocalNews());
      }
    };

    void loadNews();
  }, []);

  useEffect(() => {
    const loadDebug = async () => {
      try {
        const response = await fetch('/api/debug');
        const result = (await response.json()) as
          | { ok: true; diagnostics: { supabaseConfigured: boolean; newsSource: string; newsCount: number; newsError: string | null; timestamp: string } }
          | { ok: false };

        if (response.ok && result.ok) {
          setDebugInfo(result.diagnostics);
        }
      } catch {
        setDebugInfo(null);
      }
    };

    void loadDebug();
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white p-4" dir="rtl">
        <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00524E]/25 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/15 blur-3xl rounded-full"></div>
          
          <div className="text-center">
            <img src="/sauthalhind.png" alt="جريدة صوت الهند" className="h-20 w-20 mx-auto object-contain drop-shadow-md" />
            <h2 className="mt-4 font-headline-md text-2xl font-bold tracking-tight text-white">
              بوابة الإدارة | CMS Login
            </h2>
            <p className="mt-2 text-sm text-white/60">
              جريدة صوت الهند - نظام إدارة المحتوى
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-sm font-medium text-white/80 text-right mb-2">
                رمز المرور (Passcode)
              </label>
              <input
                id="passcode"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full text-left rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#d3ab57] transition"
              />
            </div>

            {authError && (
              <div className="text-red-400 text-sm text-center bg-red-950/40 border border-red-500/20 py-2.5 px-4 rounded-xl animate-shake">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#00524E] border border-[#006C67] hover:bg-[#006A65] py-3.5 text-sm font-semibold text-white transition duration-200"
            >
              دخول البوابة
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#132126]">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-black/8 bg-[#0f1d25] text-white lg:border-b-0 lg:border-l lg:border-black/8">
          <div className="p-6">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-16 w-16 object-contain shadow-sm" />
              <div className="text-xs uppercase tracking-[0.32em] text-white/55">Sawt Al-Hind News</div>
              <div className="mt-2 text-3xl font-bold leading-tight">Admin CMS</div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Manage live news, drafts, categories, media, and approvals from one clean dashboard.
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
              <div className="mb-3 flex items-center gap-3">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-14 w-14 object-contain shadow-sm" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6a7f86]">Admin CMS</div>
                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                    Arabic news workflow, built for daily publishing
                  </h1>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">
                No demo stories, no fake analytics. This panel is ready for real news operations:
                create, schedule, approve, upload media, and place stories on the homepage.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-brand-surfaceLow px-4 py-2 text-sm font-medium text-brand-onSurfaceVariant">
                {statusMessage}
              </div>
              <div className="mt-2 inline-flex rounded-full bg-[#eef4f4] px-4 py-2 text-xs font-semibold text-[#0f1d25]">
                Data source: {dataSource}
              </div>
              {debugInfo ? (
                <div className="mt-2 rounded-2xl border border-black/8 bg-[#f7faf9] px-4 py-3 text-xs leading-6 text-black/70">
                  <div className="font-semibold text-[#0f1d25]">Connection check</div>
                  <div>Supabase connected: {debugInfo.supabaseConfigured ? 'Yes' : 'No'}</div>
                  <div>News source: {debugInfo.newsSource}</div>
                  <div>News rows: {debugInfo.newsCount}</div>
                  {debugInfo.newsError ? <div className="text-red-600">Error: {debugInfo.newsError}</div> : null}
                </div>
              ) : null}
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

          {/* Dynamic Stats Cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
              <div className="text-sm text-black/55">أخبار منشورة | Published Articles</div>
              <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{savedNews.filter((item) => item.status === 'published').length}</div>
              <div className="mt-4 h-1.5 rounded-full bg-black/6">
                <div className="h-1.5 rounded-full bg-green-600" style={{ width: `${Math.min(100, Math.max(10, (savedNews.filter((item) => item.status === 'published').length / Math.max(1, savedNews.length)) * 100))}%` }} />
              </div>
            </div>
            
            <div className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
              <div className="text-sm text-black/55">المسودات | Drafts</div>
              <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{savedNews.filter((item) => item.status === 'draft').length}</div>
              <div className="mt-4 h-1.5 rounded-full bg-black/6">
                <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: `${Math.min(100, Math.max(10, (savedNews.filter((item) => item.status === 'draft').length / Math.max(1, savedNews.length)) * 100))}%` }} />
              </div>
            </div>

            <div className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
              <div className="text-sm text-black/55">مراجعة المعلقات | Pending Review</div>
              <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{savedNews.filter((item) => item.status === 'review').length}</div>
              <div className="mt-4 h-1.5 rounded-full bg-black/6">
                <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${Math.min(100, Math.max(10, (savedNews.filter((item) => item.status === 'review').length / Math.max(1, savedNews.length)) * 100))}%` }} />
              </div>
            </div>

            <div className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
              <div className="text-sm text-black/55">مجدولة للنشر | Scheduled Posts</div>
              <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{savedNews.filter((item) => item.status === 'scheduled').length}</div>
              <div className="mt-4 h-1.5 rounded-full bg-black/6">
                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(100, Math.max(10, (savedNews.filter((item) => item.status === 'scheduled').length / Math.max(1, savedNews.length)) * 100))}%` }} />
              </div>
            </div>
          </div>

          {/* Elegant Publishing Activity Trend Chart */}
          <div className="mt-6 rounded-[30px] border border-black/8 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">توزيع الأخبار حسب الأقسام | News Distribution by Category</h3>
                <p className="text-xs text-brand-onSurfaceVariant mt-1">نسبة التغطية الصحفية الحالية في مختلف الأقسام</p>
              </div>
              <span className="text-xs font-semibold text-brand-primary bg-brand-surfaceLow px-3 py-1.5 rounded-full">تحليل فوري</span>
            </div>
            <div className="relative h-56 w-full bg-gradient-to-t from-brand-surfaceLow/50 to-white rounded-2xl p-4 flex items-end justify-between border border-black/5 overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-20">
                <div className="border-b border-black w-full"></div>
                <div className="border-b border-black w-full"></div>
                <div className="border-b border-black w-full"></div>
              </div>
              
              <svg className="absolute inset-x-0 bottom-0 h-28 w-full text-brand-primary/5 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,100 C25,30 50,75 75,25 C90,65 100,10 100,100 Z" fill="currentColor" />
              </svg>

              {categoriesList.slice(0, 8).map((cat) => {
                const count = savedNews.filter(n => n.category === cat).length;
                const percent = Math.min(100, Math.max(8, count * 20));
                return (
                  <div key={cat} className="group relative flex flex-col items-center flex-1 h-full justify-end px-1">
                    <div className="absolute -top-7 bg-[#0f1d25] text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-md pointer-events-none z-10 whitespace-nowrap">
                      {cat}: {count} خبر
                    </div>
                    <div 
                      style={{ height: `${percent}%` }}
                      className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-brand-primary to-[#006C67] hover:from-gold hover:to-[#FED65B] transition-all duration-300 cursor-pointer shadow-sm"
                    />
                    <span className="mt-2 text-[10px] text-brand-onSurfaceVariant font-medium truncate max-w-[40px] sm:max-w-none">{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div ref={newsRef}>
              <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">محرر المقالات | News Editor</h2>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setPreviewTab('edit')} 
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${previewTab === 'edit' ? 'bg-brand-primary text-white' : 'bg-brand-surfaceLow text-brand-onSurfaceVariant'}`}
                  >
                    المحرر
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPreviewTab('preview')} 
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${previewTab === 'preview' ? 'bg-brand-primary text-white' : 'bg-brand-surfaceLow text-brand-onSurfaceVariant'}`}
                  >
                    المعاينة المباشرة
                  </button>
                </div>
              </div>

              {previewTab === 'preview' ? (
                <div className="rounded-2xl border border-black/5 bg-[#f4f7f6] p-4 sm:p-6 overflow-hidden">
                  <div className="text-center mb-4 text-xs font-bold text-brand-primary uppercase tracking-widest border-b border-black/5 pb-2">
                    معاينة حية للمقال قبل النشر | LIVE PREVIEW
                  </div>
                  <div className="mx-auto max-w-2xl bg-white rounded-3xl border border-black/6 shadow-lg overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover preview" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="h-52 w-full bg-brand-surfaceLow flex items-center justify-center text-brand-onSurfaceVariant/40 text-sm">
                        [لم يتم تحديد صورة غلاف بعد]
                      </div>
                    )}
                    <div className="p-6 text-right" dir="rtl">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                          {categoryRef.current?.value || 'تصنيف غير محدد'}
                        </span>
                        <span className="text-xs text-brand-onSurfaceVariant">الآن</span>
                      </div>
                      <h1 className="mt-3 text-2xl font-bold text-brand-onSurface leading-tight">
                        {seoTitle || 'عنوان المقال الافتراضي'}
                      </h1>
                      <div className="mt-2 text-xs text-brand-onSurfaceVariant">
                        الكاتب: {authorRef.current?.value || 'قسم التحرير'}
                      </div>
                      <div className="mt-5 text-sm text-brand-onSurfaceVariant leading-7 whitespace-pre-wrap border-t border-black/5 pt-4">
                        {seoBody || 'اكتب نص المقال في المحرر لتتمكن من معاينته هنا بشكل مباشر...'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={() => setPreviewTab('edit')} className="rounded-2xl border border-black/10 px-5 py-3 font-semibold text-sm">
                      العودة للمحرر
                    </button>
                    <button type="button" disabled={isSaving} onClick={() => saveNews('published')} className="rounded-2xl bg-[#d3ab57] px-5 py-3 font-semibold text-[#0f1d25] text-sm disabled:cursor-not-allowed disabled:opacity-60">
                      نشر المقال فوراً
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <input 
                      ref={titleRef} 
                      onChange={(e) => setSeoTitle(e.target.value)}
                      defaultValue={seoTitle}
                      className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" 
                      placeholder="عنوان الخبر" 
                    />
                    <input 
                      ref={slugRef} 
                      onChange={(e) => setSeoSlug(e.target.value)}
                      defaultValue={seoSlug}
                      className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" 
                      placeholder="الرابط الفرعي (Slug)" 
                    />
                    <input 
                      ref={authorRef} 
                      defaultValue="قسم التحرير"
                      className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" 
                      placeholder="اسم الكاتب" 
                    />
                    <select ref={categoryRef} className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none">
                      <option value="">اختر القسم</option>
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => saveNews('scheduled')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium text-sm">
                        جدولة النشر
                      </button>
                      <button type="button" onClick={() => saveNews('review')} className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium text-sm">
                        إرسال للمراجعة
                      </button>
                    </div>

                    {/* Google SEO Snippet Preview */}
                    <div className="rounded-2xl border border-black/8 bg-[#f7faf9] p-4 text-right">
                      <div className="text-xs font-bold text-black/55 mb-2.5 flex items-center justify-between">
                        <span>عرض نتائج بحث جوجل (معاينة)</span>
                        <span className="text-[#006C67] font-semibold text-[10px]">Google News Preview</span>
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl border border-black/5 font-sans leading-normal text-[13px] text-[#4d5156] text-left" dir="ltr">
                        <div className="text-[12px] text-[#202124] flex items-center gap-1 mb-1">
                          <span className="w-4 h-4 rounded-full bg-slate-100 inline-flex items-center justify-center text-[10px]">📰</span>
                          <div className="truncate">
                            https://sawtalhind.news <span className="text-gray-400">› news › {seoSlug || 'slug'}</span>
                          </div>
                        </div>
                        <div className="text-[19px] text-[#1a0dab] hover:underline cursor-pointer font-medium truncate mb-1">
                          {seoTitle || 'عنوان الخبر الرئيسي الذي يظهر في جوجل'} | جريدة صوت الهند
                        </div>
                        <div className="text-[14px] text-[#4d5156] line-clamp-2">
                          {seoBody ? seoBody.slice(0, 155) : 'اكتب نص الخبر في الجهة اليمنى وسيتم هنا عرض مقتطف محركات البحث تلقائياً...'}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-black/55">
                        <div>
                          العنوان: <span className={seoTitle.length > 60 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{seoTitle.length}/60 حرف</span>
                        </div>
                        <div>
                          المقتطف: <span className={seoBody.length > 155 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{seoBody.length}/155 حرف</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-dashed border-black/10 bg-brand-surfaceLow p-4">
                      <div className="text-sm font-semibold text-brand-onSurface">صورة الغلاف | Cover Photo</div>
                      <p className="mt-1 text-xs text-brand-onSurfaceVariant">
                        الصورة الرئيسية التي تظهر أعلى المقال وفي البطاقات الإخبارية.
                      </p>
                      <input
                        ref={coverPhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          setCoverImageName(file.name);
                          const formData = new FormData();
                          formData.append('bucket', 'news-media');
                          formData.append('files', file);

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          });
                          const result = (await response.json()) as { ok: boolean; uploaded?: Array<{ url?: string }>; error?: string };

                          if (!response.ok || !result.ok) {
                            flashStatus(result.error ?? 'Cover photo upload failed');
                            return;
                          }

                          const url = result.uploaded?.[0]?.url;
                          if (url) {
                            setCoverImage(url);
                            flashStatus(`Cover photo uploaded: ${file.name}`);
                          }
                        }}
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => coverPhotoRef.current?.click()} className="rounded-full bg-[#0f1d25] px-4 py-2 text-xs font-semibold text-white">
                          اختر صورة
                        </button>
                        <button type="button" onClick={() => flashStatus('Cover photo attached')} className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold">
                          ربط الصورة
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
                      onChange={(e) => setSeoBody(e.target.value)}
                      defaultValue={seoBody}
                      className="min-h-[250px] w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none text-sm leading-7"
                      placeholder="اكتب تفاصيل الخبر هنا..."
                    />
                    
                    <div className="flex flex-wrap gap-3">
                      <button type="button" disabled={isSaving} onClick={() => saveNews('draft')} className="rounded-2xl bg-[#0f1d25] px-4 py-3 font-semibold text-sm text-white disabled:cursor-not-allowed disabled:opacity-60">حفظ مسودة</button>
                      <button type="button" disabled={isSaving} onClick={() => saveNews('published')} className="rounded-2xl bg-[#d3ab57] px-4 py-3 font-semibold text-sm text-[#0f1d25] disabled:cursor-not-allowed disabled:opacity-60">نشر المقال</button>
                      <button type="button" onClick={resetEditor} className="rounded-2xl border border-black/10 px-4 py-3 font-semibold text-sm">مقال جديد</button>
                      <button type="button" onClick={() => setPreviewTab('preview')} className="rounded-2xl border border-black/10 px-4 py-3 font-semibold text-sm">معاينة</button>
                    </div>
                  </div>
                </div>
              )}
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

              <div className="mt-6 rounded-[26px] bg-[#f6f8f8] p-5 border border-black/5">
                <div className="text-sm font-semibold text-black/80 mb-3 text-right">مدير الأقسام | Category Manager</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="اسم القسم الجديد..."
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary text-right"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newCategory.trim();
                      if (!trimmed) return;
                      if (categoriesList.includes(trimmed)) {
                        flashStatus('القسم موجود بالفعل');
                        return;
                      }
                      setCategoriesList([...categoriesList, trimmed]);
                      setNewCategory('');
                      flashStatus(`تمت إضافة القسم: ${trimmed}`);
                    }}
                    className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#006A65] transition shrink-0"
                  >
                    إضافة
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-black/5 justify-start">
                  {categoriesList.map((cat) => (
                    <span 
                      key={cat} 
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-surfaceLow px-3 py-1 text-xs font-semibold text-brand-onSurfaceVariant border border-black/5"
                    >
                      {cat}
                      <button 
                        type="button" 
                        onClick={() => {
                          if (categoriesList.length <= 1) {
                            flashStatus('يجب أن يتبقى قسم واحد على الأقل');
                            return;
                          }
                          setCategoriesList(categoriesList.filter(c => c !== cat));
                          flashStatus(`تم حذف القسم: ${cat}`);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
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
                  <div key={item.id} className="grid gap-3 rounded-[22px] border border-black/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="text-xs text-black/45">{item.category}</div>
                      <div className="mt-1 font-medium leading-7">{item.title}</div>
                      {item.cover_image ? <div className="mt-3 overflow-hidden rounded-2xl border border-black/8"><img src={item.cover_image} alt={item.title} className="h-40 w-full object-cover" /></div> : null}
                      <div className="mt-1 text-sm text-black/55">{item.created_at}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <button type="button" disabled={isSaving} onClick={() => fillFormFromNews(item)} className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold disabled:opacity-60">Edit</button>
                      <button type="button" disabled={isSaving} onClick={() => togglePublicDraft(item)} className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold disabled:opacity-60">
                        {item.status === 'published' ? 'Make draft' : 'Make public'}
                      </button>
                      <button type="button" disabled={isSaving} onClick={() => removeNews(item.id)} className="rounded-full border border-red-200 px-3 py-1 text-sm font-semibold text-red-600 disabled:opacity-60">
                        Delete
                      </button>
                      <span className="rounded-full bg-[#0f1d25] px-3 py-1 text-sm text-white">{item.status}</span>
                    </div>
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

