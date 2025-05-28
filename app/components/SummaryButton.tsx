'use client';

import { useState } from 'react';

export default function SummaryButton({ fileId }: { fileId: string }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setSummary('');

    const res = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });

    const data = await res.json();
    setSummary(data.summary || 'Résumé indisponible');
    setLoading(false);
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
      >
        {loading ? 'Génération en cours...' : '🧠 Générer le résumé'}
      </button>

      {summary && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Résumé :</h3>
          <p className="text-gray-700 whitespace-pre-wrap text-sm">{summary}</p>
        </div>
      )}
    </div>
  );
}
