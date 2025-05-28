'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function GenerateTextPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/ai/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log('✅ Résultat OpenAI:', data.result); // debug temporaire

      if (res.ok && data.result?.trim()) {
        setResult(data.result);
      } else {
        setError('❌ Réponse vide ou incorrecte reçue de l’IA.');
      }
    } catch (err) {
      console.error('❌ Erreur de requête :', err);
      setError('Erreur lors de la requête.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-6 py-12 flex items-center justify-center font-sans">
      <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-800">
          <Sparkles className="text-purple-600 w-6 h-6" />
          Assistant IA – Génération de contenu
        </h1>

        <textarea
          placeholder="Ex: Rédige une introduction d’article sur l’IA en médecine"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Générer
            </>
          )}
        </button>

        {error && (
          <p className="text-red-600 mt-4 font-medium bg-red-50 border border-red-200 p-3 rounded">{error}</p>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-line text-gray-800">
            <h2 className="font-semibold mb-2 text-gray-700">📝 Résultat :</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
