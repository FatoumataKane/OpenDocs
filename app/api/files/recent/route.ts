import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const files = await db
    .selectFrom('files')
    .select(['id', 'original_name', 'name', 'created_at']) // 👈 ajoute "name"
    .where('user_id', '=', session.user.id)
    .orderBy('created_at', 'desc')
    .limit(5)
    .execute();

  return NextResponse.json(files);
}
