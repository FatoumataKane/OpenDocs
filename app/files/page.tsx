'use client';

import { useEffect, useState } from 'react';
import { Trash2, Eye, Download, Loader2, FileText } from 'lucide-react';

interface FileEntry {
  id: string;
  original_name: string;
  name: string;
  created_at: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Voulez-vous vraiment supprimer ce fichier ?');
    if (!confirmDelete) return;

    setDeleting(id);
    const res = await fetch('/api/files', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();

    if (result.success) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
    setDeleting(null);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        Mes fichiers PDF
      </h1>

      {loading ? (
        <div className="text-gray-500 flex items-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" />
          Chargement...
        </div>
      ) : files.length === 0 ? (
        <p className="text-gray-500">Aucun fichier trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-5 py-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800 truncate max-w-[250px]">
                  {file.original_name}
                </p>
                <p className="text-xs text-gray-400">Ajouté le {new Date(file.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/uploads/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <a
                  href={`/uploads/${file.name}`}
                  download={file.original_name}
                  className="text-green-600 hover:underline flex items-center gap-1 text-sm"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                  disabled={deleting === file.id}
                >
                  {deleting === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
