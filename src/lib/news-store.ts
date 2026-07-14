import { supabaseServer } from '@/lib/supabase';

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  cover_image?: string | null;
  status: 'draft' | 'published' | 'review' | 'scheduled';
  created_at: string;
};

type NewsPayload = {
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  cover_image?: string | null;
  status: NewsRecord['status'];
};

export async function listNews() {
  if (!supabaseServer) {
    return { ok: true as const, items: [] as NewsRecord[], source: 'fallback' as const };
  }

  const selectWithCover = await supabaseServer
    .from('news')
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .order('created_at', { ascending: false });

  let data = selectWithCover.data;
  let error = selectWithCover.error;

  if (error?.message?.toLowerCase().includes('cover_image')) {
    const fallback = await supabaseServer
      .from('news')
      .select('id,title,slug,author,category,body,status,created_at')
      .order('created_at', { ascending: false });
    data = (fallback.data ?? []).map((item) => ({ ...item, cover_image: null }));
    error = fallback.error;
  }

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, items: (data ?? []) as NewsRecord[], source: 'supabase' as const };
}

export async function createNews(payload: NewsPayload) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const baseInsert = {
    title: payload.title,
    slug: payload.slug,
    author: payload.author,
    category: payload.category,
    body: payload.body,
    cover_image: payload.cover_image ?? null,
    status: payload.status
  };

  let insertResult = await supabaseServer
    .from('news')
    .insert(baseInsert)
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .single();

  if (insertResult.error?.message?.toLowerCase().includes('cover_image')) {
    insertResult = await supabaseServer
      .from('news')
      .insert({
        title: payload.title,
        slug: payload.slug,
        author: payload.author,
        category: payload.category,
        body: payload.body,
        status: payload.status
      })
      .select('id,title,slug,author,category,body,status,created_at')
      .single();
  }

  if (insertResult.error) {
    return { ok: false as const, error: insertResult.error.message };
  }

  return { ok: true as const, item: insertResult.data as NewsRecord };
}

export async function getNewsBySlug(slug: string) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const withCover = await supabaseServer
    .from('news')
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .eq('slug', slug)
    .maybeSingle();

  if (withCover.error?.message?.toLowerCase().includes('cover_image')) {
    const fallback = await supabaseServer
      .from('news')
      .select('id,title,slug,author,category,body,status,created_at')
      .eq('slug', slug)
      .maybeSingle();

    if (fallback.error) {
      return { ok: false as const, error: fallback.error.message };
    }

    return {
      ok: true as const,
      item: fallback.data ? ({ ...fallback.data, cover_image: null } as NewsRecord) : null
    };
  }

  if (withCover.error) {
    return { ok: false as const, error: withCover.error.message };
  }

  return { ok: true as const, item: withCover.data as NewsRecord | null };
}
