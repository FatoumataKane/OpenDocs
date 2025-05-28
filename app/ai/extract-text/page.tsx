'use client';

import { useEffect, useState } from 'react';
import { Loader2, FileSearch } from 'lucide-react';

interface FileMeta {
  id: string;
  original_name: string;
}

export default function ExtractTextPage() {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => setFiles(data));
  }, []);

  const handleExtract = async () => {
    if (!selectedId) return;
    setLoading(true);
    setText('');
    const res = await fetch('/api/ai/extract-text', {
      method: 'POST',
      body: JSON.stringify({ fileId: selectedId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setText(data.text || '');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-6 flex flex-col items-center font-sans">
      <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-3xl animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <FileSearch className="text-blue-600 w-6 h-6" />
          Extraire le contenu d’un fichier PDF
        </h1>

        {/* Choix du fichier */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Choisissez un document :</label>
          <select
            className="w-full border px-4 py-2 rounded-md"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">-- Sélectionner un fichier --</option>
            {files.map((f) => (
              <option key={f.id} value={f.id}>
                {f.original_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExtract}
          disabled={!selectedId || loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Analyse en cours...
            </span>
          ) : (
            'Extraire le texte'
          )}
        </button>

        {text && (
          <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-md overflow-auto max-h-[400px] whitespace-pre-wrap text-sm text-gray-800">
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
