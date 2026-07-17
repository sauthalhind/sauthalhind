import { supabaseServer } from '@/lib/supabase';
import { listNews } from '@/lib/news-store';

export async function GET() {
  const newsResult = await listNews();
  
  let directFetchResult: any = null;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    
    if (url && key) {
      const start = Date.now();
      const res = await fetch(`${url}/rest/v1/news?select=id&limit=1`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        },
        cache: 'no-store'
      });
      const duration = Date.now() - start;
      const text = await res.text();
      directFetchResult = {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        durationMs: duration,
        responseSnippet: text.slice(0, 100)
      };
    } else {
      directFetchResult = { error: 'Missing url or key env variables' };
    }
  } catch (err: any) {
    directFetchResult = {
      error: err?.message || String(err),
      name: err?.name,
      code: err?.code,
      stack: err?.stack ? err.stack.toString() : null,
      cause: err?.cause ? {
        message: err.cause.message,
        code: err.cause.code,
        name: err.cause.name,
        stack: err.cause.stack ? err.cause.stack.toString() : null
      } : null
    };
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(supabaseServer),
    newsSource: newsResult.ok ? newsResult.source : 'error',
    newsCount: newsResult.ok ? newsResult.items.length : 0,
    newsError: newsResult.ok ? null : newsResult.error,
    directFetch: directFetchResult
  };

  return Response.json({ ok: true, diagnostics });
}
