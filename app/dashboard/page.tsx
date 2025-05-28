import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/app/components/Header';
import {
  UploadCloud,
  FileText,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import FileList from '@/app/components/FileList';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <>
      <Header user={user!} />
      <main className="flex-1 p-10 font-sans bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        {/* Cartes d'action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ActionCard
            title="Téléverser un PDF"
            description="Ajoutez un document à traiter"
            icon={<UploadCloud className="text-blue-600 w-6 h-6" />}
            href="/upload"
            accent="blue"
          />
          <ActionCard
            title="Mes fichiers"
            description="Consultez votre bibliothèque"
            icon={<FileText className="text-green-600 w-6 h-6" />}
            href="/files"
            accent="green"
          />
          <ActionCard
            title="Résumé AI"
            description="Générez des résumés automatiques"
            icon={<Sparkles className="text-purple-600 w-6 h-6" />}
            href="/summary"
            accent="purple"
          />
        </div>

        {/* Fichiers récents */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            📄 Vos derniers fichiers
          </h2>
          <FileList />
        </section>
      </main>
    </>
  );
}

// COMPONENT: carte action stylisée
function ActionCard({
  title,
  description,
  icon,
  href,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accent: 'blue' | 'green' | 'purple';
}) {
  const ringColor = {
    blue: 'hover:ring-blue-300',
    green: 'hover:ring-green-300',
    purple: 'hover:ring-purple-300',
  }[accent];

  return (
    <Link
      href={href}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition p-6 flex items-start gap-4 group hover:ring-2 hover:ring-offset-2 ${ringColor}`}
    >
      <div className="p-2 bg-gray-100 rounded-md">{icon}</div>
      <div>
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition">
          {title}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
