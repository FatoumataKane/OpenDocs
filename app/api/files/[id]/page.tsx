import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

interface Props {
  params: { id: string };
}

export default async function FileDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const file = await db
    .selectFrom('files')
    .selectAll()
    .where('id', '=', params.id)
    .where('user_id', '=', session.user.id)
    .executeTakeFirst();

  if (!file) return notFound();

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-gray-800">
          🗂️ {file.original_name}
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <iframe
            src={`/uploads/${file.name}`}
            className="w-full h-[80vh]"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
}
