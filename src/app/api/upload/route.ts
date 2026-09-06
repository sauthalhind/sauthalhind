import { supabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files').filter((value): value is File => value instanceof File);
  const bucket = String(formData.get('bucket') ?? 'news-media');

  if (!supabaseServer) {
    return Response.json({
      ok: false,
      error: 'Supabase is not configured yet.'
    }, { status: 500 });
  }

  const storageClient = supabaseServer;

  try {
    const { data: bucketData, error: bucketError } = await storageClient.storage.getBucket(bucket);
    if (bucketError) {
      await storageClient.storage.createBucket(bucket, { public: true });
    }
  } catch {
    // ignore bucket creation issues and continue with upload attempt
  }

  const uploaded = [];
  for (const file of files) {
    let publicUrl: string | null = null;

    if (supabaseServer) {
      try {
        const safeName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${bucket}/${safeName}`;
        const { error } = await supabaseServer.storage.from(bucket).upload(path, file, {
          upsert: true,
          contentType: file.type || 'application/octet-stream'
        });

        if (!error) {
          const { data } = supabaseServer.storage.from(bucket).getPublicUrl(path);
          if (data?.publicUrl) {
            publicUrl = data.publicUrl;
          }
        }
      } catch {
        // Fall back to data URL below
      }
    }

    // Fallback: If Supabase Storage is restricted or failed, generate Base64 Data URL
    if (!publicUrl) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || 'image/jpeg';
      publicUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }

    uploaded.push({
      name: file.name,
      type: file.type,
      size: file.size,
      url: publicUrl
    });
  }

  return Response.json({
    ok: true,
    uploaded
  });
}
