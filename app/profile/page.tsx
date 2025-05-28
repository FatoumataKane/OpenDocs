'use client';

import { useSession } from 'next-auth/react';
import { Loader2, Mail, UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fade-in backdrop-blur-md border border-gray-100 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <img
            src={user?.image || '/avatar-default.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        <div className="mt-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-1">
            <UserCircle2 className="w-6 h-6 text-blue-500" />
            {user?.name || 'Utilisateur'}
          </h1>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Mail className="w-4 h-4" />
            {user?.email || 'Adresse email inconnue'}
          </p>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm text-center">
          Bienvenue sur votre espace personnel. Ici vous pouvez voir les informations liées à votre compte.
        </div>
      </div>
    </div>
  );
}
