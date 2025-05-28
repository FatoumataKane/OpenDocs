import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const files = await db
    .selectFrom('files')
    .select(['id', 'original_name'])
    .where('user_id', '=', session.user.id)
    .orderBy('created_at', 'desc')
    .execute();

  return NextResponse.json(files);
}
