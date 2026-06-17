import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    if (password !== ADMIN_PASSWORD) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const file = formData.get('file') as Blob | null;
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = (file as any).name || 'upload.png';
    const ext = path.extname(originalName) || '.png';
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err: any) {
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}
