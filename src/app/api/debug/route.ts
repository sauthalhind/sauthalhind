import { supabaseServer } from '@/lib/supabase';
import { listNews } from '@/lib/news-store';

export async function GET() {
  const newsResult = await listNews();
  const diagnostics = {
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(supabaseServer),
    newsSource: newsResult.ok ? newsResult.source : 'error',
    newsCount: newsResult.ok ? newsResult.items.length : 0,
    newsError: newsResult.ok ? null : newsResult.error
  };

  return Response.json({ ok: true, diagnostics });
}
