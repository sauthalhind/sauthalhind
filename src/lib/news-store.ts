import { supabaseServer } from '@/lib/supabase';

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  status: 'draft' | 'published' | 'review' | 'scheduled';
  created_at: string;
};

type NewsPayload = {
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  status: NewsRecord['status'];
};

export async function listNews() {
  if (!supabaseServer) {
    return { ok: true as const, items: [] as NewsRecord[], source: 'fallback' as const };
  }

  const { data, error } = await supabaseServer
    .from('news')
    .select('id,title,slug,author,category,body,status,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, items: (data ?? []) as NewsRecord[], source: 'supabase' as const };
}

export async function createNews(payload: NewsPayload) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const { data, error } = await supabaseServer
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

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, item: data as NewsRecord };
}
