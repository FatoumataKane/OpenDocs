'use client';

import { useState } from 'react';
import { Loader2, FileText, Sparkles } from 'lucide-react';

export default function SummaryAIPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setSummary('');
    setError('');

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      console.log('🧠 Résumé IA reçu :', data);

      if (res.ok && data?.summary) {
        setSummary(data.summary);
      } else {
        setError('❌ Résumé non généré.');
      }
    } catch (err) {
      setError('❌ Erreur de l’IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-indigo-50 to-blue-100 font-sans">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200 space-y-6 animate-fade-in">
        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-indigo-600" />
          Résumé Automatique par IA
        </h1>

        {/* Textarea d’entrée */}
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez ici le texte à résumer..."
          className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm"
        />

        {/* Bouton Générer */}
        <button
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Résumé en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Générer le résumé
            </>
          )}
        </button>

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Résultat du résumé */}
        {summary && (
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 whitespace-pre-line shadow-inner animate-fade-in">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
