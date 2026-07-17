import { supabaseServer } from '@/lib/supabase';

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
    const safeName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${bucket}/${safeName}`;
    const { error } = await storageClient.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || 'application/octet-stream'
    });

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    const { data } = storageClient.storage.from(bucket).getPublicUrl(path);
    uploaded.push({
      name: file.name,
      type: file.type,
      size: file.size,
      url: data.publicUrl
    });
  }

  return Response.json({
    ok: true,
    uploaded
  });
}
