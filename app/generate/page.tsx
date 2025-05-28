'use client';

import { useState } from 'react';
import { FilePlus, Loader2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GeneratedPDF from './components/GeneratedPDF';

export default function GenerateDocumentPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canGenerate = title.trim() !== '' && content.trim() !== '';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-10">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md">
              <FilePlus className="w-5 h-5" />
            </span>
            Générer un document PDF
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre du document</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Rapport de projet"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tapez ici le contenu du document..."
                rows={8}
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {canGenerate ? (
              <PDFDownloadLink
                document={<GeneratedPDF title={title} content={content} />}
                fileName={`${title.replace(/\s+/g, '_')}.pdf`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-4 h-4" />
                      Télécharger le PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Remplissez les champs pour générer le PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
