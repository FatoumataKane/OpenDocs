'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUpload,
  FiFolder,
  FiFileText,
  FiUser,
  FiEdit,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiZap,
  FiSearch,
  FiPenTool,
} from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const mainLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { href: '/upload', label: 'Téléverser un PDF', icon: <FiUpload /> },
  { href: '/files', label: 'Mes fichiers', icon: <FiFolder /> },
  { href: '/generate', label: 'Générer un document', icon: <FiEdit /> },
  { href: '/profile', label: 'Profil', icon: <FiUser /> },
  
];

const aiLinks = [
  { href: '/ai/summary', label: 'Résumé', icon: <FiZap /> },
  { href: '/ai/extract-text', label: 'Extraction de texte', icon: <FiSearch /> },
  { href: '/ai/generate-text', label: 'Génération de contenu', icon: <FiPenTool /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [aiOpen, setAiOpen] = useState(true); // sous-menu ouvert par défaut

  return (
    <aside className="w-64 min-h-screen sticky top-0 flex flex-col justify-between bg-white border-r border-gray-100 shadow-sm px-6 py-8 font-sans">
      {/* Logo */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <img src="/logo.jpg" alt="OpenDOCS" className="h-12" />
        </div>

        {/* Menu principal */}
        <nav className="flex flex-col gap-4">
          {mainLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-5 py-3 rounded-lg text-base font-medium transition ${
                pathname === href
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}

          {/* Assistant IA section */}
          <div>
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center justify-between w-full text-gray-700 px-5 py-3 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              <span className="flex items-center gap-3">
                <FiFileText className="text-xl" />
                Assistant IA
              </span>
              {aiOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
            </button>

            {aiOpen && (
              <div className="ml-7 mt-2 flex flex-col gap-2">
                {aiLinks.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                      pathname === href
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Déconnexion */}
      <div className="space-y-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-4 px-5 py-3 text-base font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          <FiLogOut className="text-xl" />
          Déconnexion
        </button>
        <div className="text-xs text-gray-400 text-center">© 2025 OpenDOCS</div>
      </div>
    </aside>
  );
}
