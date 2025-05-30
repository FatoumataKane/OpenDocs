import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Fichier invalide' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = randomUUID();
    const filename = `${fileId}.pdf`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(uploadPath, buffer);

   await db
  .insertInto('files')
  .values({
    id: fileId,
    user_id: session.user.id,
    name: filename,
    original_name: file.name,
    created_at: new Date(), 
  })
  .execute();

    // ✅ Émettre l'événement WebSocket
    const io = (global as any).io;
    if (io) {
      io.emit('file-uploaded', file.name);
    }

    return NextResponse.json({ success: true, id: fileId });
  } catch (error) {
    console.error('❌ Erreur API /upload :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
