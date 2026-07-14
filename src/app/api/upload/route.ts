export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files').filter((value): value is File => value instanceof File);

  return Response.json({
    ok: true,
    uploaded: files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size
    }))
  });
}
