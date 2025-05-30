import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await db
    .selectFrom('files')
    .select(['id', 'original_name', 'name', 'created_at'])
    .where('user_id', '=', session.user.id)
    .orderBy('created_at', 'desc')
    .execute();

  return NextResponse.json(files);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  const file = await db
    .selectFrom('files')
    .select(['name'])
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .executeTakeFirst();

  if (!file) {
    return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public/uploads', file.name);
  await fs.unlink(filePath).catch(() => null);

  await db.deleteFrom('files').where('id', '=', id).execute();

  return NextResponse.json({ success: true });
}
