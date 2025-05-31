import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  if (!filename) {
    return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const filePath = isProd
    ? path.join('/tmp', filename)
    : path.join(process.cwd(), 'public/uploads', filename);

  try {
    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
  }
}
