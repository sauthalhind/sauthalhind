export async function GET() {
  return Response.json({ ok: true, service: 'sawt-al-hind-news', timestamp: new Date().toISOString() });
}
