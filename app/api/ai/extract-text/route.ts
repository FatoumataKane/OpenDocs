import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await req.json();

    const file = await db
      .selectFrom('files')
      .select(['name', 'user_id'])
      .where('id', '=', fileId)
      .executeTakeFirst();

    if (!file || file.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Fichier introuvable ou non autorisé' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', file.name);
    const fileBuffer = await fs.readFile(filePath);
    const parsed = await pdfParse(fileBuffer);

    return NextResponse.json({ text: parsed.text });
  } catch (err) {
    console.error('❌ Extraction texte erreur :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
