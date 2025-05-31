'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, FileText, Loader2 } from 'lucide-react';

interface File {
  id: string;
  original_name: string;
  name: string;
  created_at: string;
}

export default function FileList() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/files/recent')
      .then(res => res.json())
      .then(data => setFiles(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement des fichiers...
      </div>
    );
  }

  if (!files.length) {
    return <p className="text-gray-500">Aucun fichier récemment ajouté.</p>;
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="group flex justify-between items-center bg-white border border-gray-200 rounded-lg px-5 py-3 hover:shadow-sm transition"
        >
          <div>
            <p className="font-medium text-gray-900 truncate max-w-xs">
              {file.original_name}
            </p>
            <p className="text-xs text-gray-400">
              Ajouté le {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* ✅ Corrigé pour production */}
          <a
            href={`/api/view/${file.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 flex items-center gap-1 text-sm font-medium group-hover:underline"
          >
            Voir <ArrowRight className="w-4 h-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
