'use client';

import { useState } from 'react';
import { Brain, Sparkles, Loader2, RefreshCcw } from 'lucide-react';

export default function GenerateTextPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult('');

    const res = await fetch('/api/ai/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setResult(data.result);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl animate-fade-in space-y-6">

        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
          <Brain className="text-indigo-600 w-7 h-7" />
          Générer du contenu par IA
        </h1>

        <p className="text-sm text-gray-500">
          Donne une consigne claire à l’IA (ex. : "Rédige une introduction sur la transformation digitale").
        </p>

        <textarea
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={6}
          placeholder="Tapez votre requête ici..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm shadow-sm">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-5 border bg-gray-50 rounded-xl shadow-sm space-y-2 animate-fade-in-slow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Résultat généré
              </h2>
              <button
                onClick={() => setResult('')}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <RefreshCcw className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
