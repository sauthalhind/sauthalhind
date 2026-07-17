const { createClient } = require('@supabase/supabase-js');
process.loadEnvFile('.env.local');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testUpload() {
  const bucket = 'news-media';
  const fs = require('fs');
  fs.writeFileSync('dummy.txt', 'hello world');
  const fileData = fs.readFileSync('dummy.txt');

  try {
    await supabase.storage.getBucket(bucket).catch(async () => {
      await supabase.storage.createBucket(bucket, { public: true });
    });
  } catch (e) {}

  const safeName = Date.now() + '-dummy.txt';
  const path = `${bucket}/${safeName}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, fileData, {
    upsert: true,
    contentType: 'text/plain'
  });

  if (error) {
    console.error("Upload Error:", error.message);
  } else {
    console.log("Upload Success:", data);
  }
}
testUpload();
