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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'categories' | 'media'>('dashboard');

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setActiveTab('news');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'saw@123';
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

  const saveLocalNewsOnly = (
    items: Array<{ id: string; title: string; slug: string; category: string; status: string; created_at: string; cover_image?: string | null; body?: string; author?: string }>
  ) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(localNewsKey, JSON.stringify(items));
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
    flashStatus(`جاري التعديل: ${item.title}`);
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
    flashStatus('تم مسح المحرر');
  };

  const saveNews = async (status: 'draft' | 'published' | 'review' | 'scheduled') => {
    const payload = collectPayload();
    const tempId = editingId ?? crypto.randomUUID();
    const optimisticItem = {
      id: tempId,
      title: payload.title || 'Untitled story',
      slug: payload.slug,
      author: payload.author,
      category: payload.category,
      body: payload.body,
      cover_image: payload.cover_image,
      status,
      created_at: new Date().toISOString()
    };

    const originalSavedNews = savedNews;
    const originalLocalNews = readLocalNews();

    try {
      // 1. Instantly save locally and update UI state
      const nextLocalNews = editingId
        ? originalLocalNews.map((item) => (item.id === editingId ? { ...item, ...optimisticItem } : item))
        : [optimisticItem, ...originalLocalNews];
      saveLocalNewsOnly(nextLocalNews);

      const nextSavedNews = editingId
        ? savedNews.map((item) => (item.id === editingId ? { ...item, ...optimisticItem } : item))
        : [optimisticItem, ...savedNews];
      setSavedNews(nextSavedNews);

      resetEditor();
      flashStatus(status === 'published' ? 'تم النشر بنجاح (جاري المزامنة...)' : 'تم الحفظ كمسودة (جاري المزامنة...)');

      // 2. Perform background sync
      const response = await fetch('/api/news', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload, status } : { ...payload, status })
      });

      const result = (await response.json()) as
        | { ok: true; item?: { id: string; created_at: string; slug?: string; author?: string; body?: string; cover_image?: string | null } }
        | { ok: false; error?: string };

      if (!response.ok || !result.ok) {
        flashStatus(result && !result.ok ? `خطأ في المزامنة: ${result.error}` : 'تم الحفظ محلياً فقط (تعذرت المزامنة)');
        return;
      }

      // 3. Update the temporary ID with the real database ID
      const syncedLocalNews = readLocalNews().map((item) =>
        item.id === tempId
          ? {
              ...item,
              id: result.item?.id ?? tempId,
              created_at: result.item?.created_at ?? item.created_at
            }
          : item
      );
      saveLocalNewsOnly(syncedLocalNews);

      const syncedSavedNews = savedNews.map((item) =>
        item.id === tempId
          ? {
              ...item,
              id: result.item?.id ?? tempId,
              created_at: result.item?.created_at ?? item.created_at
            }
          : item
      );
      setSavedNews(syncedSavedNews);

      broadcastNewsUpdate();
      flashStatus(status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح');
    } catch (error) {
      console.error('saveNews background sync failed', error);
      setSavedNews(originalSavedNews);
      saveLocalNewsOnly(originalLocalNews);
      flashStatus('تعذرت المزامنة السحابية (تم الحفظ محلياً)');
    }
  };

  const publishSelectedFiles = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      flashStatus('يرجى اختيار ملف أولاً');
      return;
    }

    setIsUploading(true);
    try {
      flashStatus('جاري الرفع...');
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = (await response.json()) as { ok: boolean; uploaded?: Array<{ name: string; url?: string }>; error?: string };
      if (!response.ok || !result.ok) {
        flashStatus(result.error ?? 'فشل الرفع');
        return;
      }

      const firstUrl = result.uploaded?.[0]?.url;
      if (firstUrl) {
        setCoverImage(firstUrl);
      }
      flashStatus(`تم رفع ${result.uploaded?.length ?? 0} ملف(ات)`);
    } catch (error) {
      console.error('publishSelectedFiles failed', error);
      flashStatus('فشل الرفع');
    } finally {
      setIsUploading(false);
    }
  };

  const removeNews = async (id: string) => {
    const originalSavedNews = savedNews;
    const originalLocalNews = readLocalNews();
    
    // 1. Instantly update UI locally and local storage
    const nextSavedNews = savedNews.filter((item) => item.id !== id);
    setSavedNews(nextSavedNews);
    
    const nextLocalNews = originalLocalNews.filter((item) => item.id !== id);
    saveLocalNewsOnly(nextLocalNews);

    if (editingId === id) {
      resetEditor();
    }
    flashStatus('تم الحذف');

    // 2. Perform API sync in background
    try {
      const response = await fetch(`/api/news?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        // Revert on failure
        setSavedNews(originalSavedNews);
        saveLocalNewsOnly(originalLocalNews);
        flashStatus(result.error ?? 'فشلت مزامنة الحذف');
      } else {
        broadcastNewsUpdate();
      }
    } catch (error) {
      console.error('removeNews background sync failed', error);
      setSavedNews(originalSavedNews);
      saveLocalNewsOnly(originalLocalNews);
      flashStatus('فشلت مزامنة الحذف');
    }
  };

  const togglePublicDraft = async (item: { id: string; status: string }) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    const originalSavedNews = savedNews;
    const originalLocalNews = readLocalNews();

    // 1. Instantly update UI locally and local storage
    const nextSavedNews = savedNews.map((news) =>
      news.id === item.id ? { ...news, status: nextStatus } : news
    );
    setSavedNews(nextSavedNews);

    const nextLocalNews = originalLocalNews.map((news) =>
      news.id === item.id ? { ...news, status: nextStatus } : news
    );
    saveLocalNewsOnly(nextLocalNews);
    flashStatus(nextStatus === 'published' ? 'تم تعيينه كمنشور' : 'تم تعيينه كمسودة');

    // 2. Perform API sync in background
    try {
      const response = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: nextStatus })
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        // Revert on failure
        setSavedNews(originalSavedNews);
        saveLocalNewsOnly(originalLocalNews);
        flashStatus(result.error ?? 'فشلت مزامنة الحالة');
      } else {
        broadcastNewsUpdate();
      }
    } catch (error) {
      console.error('togglePublicDraft background sync failed', error);
      setSavedNews(originalSavedNews);
      saveLocalNewsOnly(originalLocalNews);
      flashStatus('فشلت مزامنة الحالة');
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
          const apiItems = result.items.map(normalizeNewsItem);
          const map = new Map();
          [...apiItems, ...localItems].forEach((item) => map.set(item.id, item));
          setSavedNews(Array.from(map.values()));
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
      <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
        <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
                <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">صوت الهند</span>
                <span className="text-[10px] uppercase tracking-widest text-white/80">Newsroom CMS</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto mt-20 p-4">
          <div className="bg-white border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">تسجيل الدخول</h2>
              <p className="text-sm text-gray-500">يرجى إدخال رمز المرور للوصول إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="passcode" className="block text-sm font-bold text-gray-700 mb-2">
                  رمز المرور (Passcode)
                </label>
                <input
                  id="passcode"
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-[#bb1919] transition"
                  dir="ltr"
                />
              </div>

              {authError && (
                <div className="text-[#bb1919] text-sm text-center bg-[#ffebeb] border border-[#bb1919]/20 py-3 px-4 font-bold">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#bb1919] hover:bg-[#901414] py-3.5 text-sm font-bold text-white transition duration-200"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#3f3f3f] antialiased" dir="rtl">
      {/* BBC Style Brand Header */}
      <header className="bg-[#bb1919] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white p-1 rounded-sm flex items-center justify-center shrink-0">
              <img src="/sauthalhind.png" alt="Sauthalhind logo" className="h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-lg leading-none">صوت الهند</span>
              <span className="text-[10px] uppercase tracking-widest text-white/80">Newsroom CMS</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <span className="bg-white/10 px-3 py-1.5 rounded text-white/90">
              {statusMessage}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 grid lg:grid-cols-[280px_1fr] gap-4 sm:gap-6 items-start">
        <div className="sm:hidden w-full">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${activeTab === 'news' ? 'bg-[#bb1919] text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-[#bb1919] text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              Posts
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className="bg-white border border-black/5 p-2 hidden lg:block sticky top-24">
          <nav className="flex flex-col gap-1">
            {menu.map((item, index) => {
              const refs = [dashboardRef, newsRef, categoriesRef, mediaRef, workflowRef, moderationRef];
              const target = refs[index] ?? dashboardRef;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => scrollToSection(target)}
                  className={`text-right px-4 py-3 text-sm font-bold border-l-4 transition-all ${
                    index === 0 ? 'border-[#bb1919] bg-[#fdf2f2] text-[#bb1919]' : 'border-transparent text-[#5a5a5a] hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="space-y-6">
          <div ref={dashboardRef} />
          
          {/* Editor Section */}
          <section ref={newsRef} className={`bg-white border border-black/5 p-4 sm:p-6 relative ${activeTab === 'news' ? 'block' : 'hidden lg:block'}`}>
            <div className="absolute top-0 right-0 w-full h-1 bg-[#bb1919]"></div>
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-black">محرر الأخبار</h2>
                <p className="text-sm text-gray-500 mt-1">اكتب وانشر الأخبار بشكل فوري</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={resetEditor} className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-black transition">
                  مقال جديد
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_300px]">
              {/* Left/Main Editor Col */}
              <div className="space-y-3 sm:space-y-4">
                <input 
                  ref={titleRef} 
                  onChange={(e) => setSeoTitle(e.target.value)}
                  defaultValue={seoTitle}
                  className="w-full border border-gray-300 bg-white px-3 sm:px-4 py-3 outline-none focus:border-[#bb1919] focus:ring-1 focus:ring-[#bb1919] text-lg sm:text-xl font-bold transition-shadow" 
                  placeholder="عنوان الخبر..." 
                />
                
                <textarea
                  ref={bodyRef}
                  onChange={(e) => setSeoBody(e.target.value)}
                  defaultValue={seoBody}
                  className="min-h-[220px] sm:min-h-[300px] w-full border border-gray-300 bg-white px-3 sm:px-4 py-3 outline-none focus:border-[#bb1919] focus:ring-1 focus:ring-[#bb1919] text-sm leading-7 sm:leading-8 transition-shadow"
                  placeholder="نص المقال يكتب هنا..."
                />
                
                <div className="flex flex-wrap gap-2 pt-2 sm:pt-4">
                  <button type="button" disabled={isSaving} onClick={() => saveNews('published')} className="bg-[#bb1919] hover:bg-[#a01515] px-4 sm:px-6 py-3 font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm">
                    نشر المقال فوراً
                  </button>
                  <button type="button" disabled={isSaving} onClick={() => saveNews('draft')} className="bg-gray-800 hover:bg-black px-4 sm:px-6 py-3 font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm">
                    حفظ مسودة
                  </button>
                </div>
              </div>

              {/* Right/Meta Col */}
              <div className="space-y-4 sm:space-y-5 bg-gray-50 p-3 sm:p-4 border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">الرابط الفرعي (Slug)</label>
                  <input 
                    ref={slugRef} 
                    onChange={(e) => setSeoSlug(e.target.value)}
                    defaultValue={seoSlug}
                    className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#bb1919]" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">التصنيف</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select ref={categoryRef} className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#bb1919]">
                      <option value="">اختر القسم...</option>
                      {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="flex gap-1 sm:w-1/3">
                      <input 
                        type="text" 
                        placeholder="قسم جديد (New)" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                        className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#bb1919]"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if(newCategory.trim() && !categoriesList.includes(newCategory.trim())) {
                            setCategoriesList([...categoriesList, newCategory.trim()]);
                            setTimeout(() => {
                              if(categoryRef.current) categoryRef.current.value = newCategory.trim();
                            }, 50);
                            setNewCategory('');
                          }
                        }}
                        className="bg-gray-800 text-white px-3 py-2 text-xs font-bold whitespace-nowrap hover:bg-black transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">صورة الغلاف</label>
                  <input
                    ref={coverPhotoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      setCoverImageName(file.name);
                      flashStatus('جاري رفع الصورة...');
                      
                      const formData = new FormData();
                      formData.append('bucket', 'news-media');
                      formData.append('files', file);

                      try {
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const result = (await response.json()) as { ok: boolean; uploaded?: Array<{ url?: string }>; error?: string };
                        if (!response.ok || !result.ok) {
                          flashStatus(result.error ?? 'Upload failed');
                        } else {
                          const url = result.uploaded?.[0]?.url;
                          if (url) {
                            setCoverImage(url);
                            flashStatus('Image uploaded successfully');
                          }
                        }
                      } catch(e) {
                        flashStatus('Upload error');
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                  
                  <div 
                    onClick={() => coverPhotoRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 bg-white p-4 text-center cursor-pointer hover:border-[#bb1919] transition-colors ${isUploading ? 'opacity-50' : ''}`}
                  >
                    {coverImage ? (
                      <div className="relative">
                        <img src={coverImage} alt="Cover preview" className="h-32 w-full object-cover mb-2" />
                        <span className="text-[10px] bg-black/60 text-white px-2 py-1 absolute bottom-2 right-2">تغيير الصورة</span>
                      </div>
                    ) : (
                      <div className="py-6">
                        <div className="text-xl mb-1 text-gray-400">📷</div>
                        <div className="text-xs font-bold text-gray-600">{isUploading ? 'جاري الرفع...' : 'اختر صورة من جهازك'}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">الكاتب</label>
                  <input 
                    ref={authorRef} 
                    defaultValue="قسم التحرير"
                    className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#bb1919]" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* List of News */}
          <section className={`bg-white border border-black/5 p-4 sm:p-6 ${activeTab === 'dashboard' ? 'block' : 'hidden lg:block'}`}>
            <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-black">
                الأخبار المنشورة <span key={savedNews.length} translate="no">({savedNews.length})</span>
              </h2>
            </div>
            
            <div className="grid gap-4">
              {savedNews.length === 0 ? (
                <div className="text-center py-10 sm:py-12 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200">
                  لا توجد أخبار بعد.
                </div>
              ) : (
                savedNews.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-colors">
                    {item.cover_image && (
                      <div className="w-full sm:w-32 h-28 sm:h-20 shrink-0 bg-gray-100 overflow-hidden rounded-lg">
                        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#bb1919] uppercase tracking-wider mb-1">{item.category}</div>
                      <div className="font-bold text-sm sm:text-base text-gray-900 break-words">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.created_at}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 shrink-0">
                      <a href={`/news/${item.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 transition">عرض الخبر</a>
                      <button type="button" disabled={isSaving} onClick={() => fillFormFromNews(item)} className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 transition">تعديل</button>
                      <button type="button" disabled={isSaving} onClick={() => togglePublicDraft(item)} className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 transition">
                        {item.status === 'published' ? 'إلى مسودة' : 'نشر'}
                      </button>
                      <button type="button" disabled={isSaving} onClick={() => removeNews(item.id)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 transition">حذف</button>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.status === 'published' ? 'bg-[#bb1919] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {item.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

