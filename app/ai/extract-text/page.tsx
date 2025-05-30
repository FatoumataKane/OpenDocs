'use client';

import { useState } from 'react';

export default function ExtractTextPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return alert('Seuls les PDF sont autorisés.');

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    const res = await fetch('/api/ai/extract-text', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.text) {
      alert('❌ Erreur lors de l’analyse PDF');
      return;
    }

    setText(data.text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">📄 Extraire le texte d’un PDF</h1>

        <input type="file" accept="application/pdf" onChange={handleUpload} className="block w-full" />

        {loading && <p className="text-blue-600 font-medium text-center">Analyse en cours...</p>}

        {text && (
          <textarea
            value={text}
            rows={16}
            className="w-full border border-gray-300 p-4 rounded-lg resize-none"
            readOnly
          />
        )}
      </div>
    </div>
  );
}
