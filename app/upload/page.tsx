'use client';

import { useState } from 'react';
import { FilePlus2 } from 'lucide-react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Seuls les fichiers PDF sont acceptés.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Seuls les fichiers PDF sont acceptés.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      alert('✅ Fichier téléversé avec succès !');
      setSelectedFile(null); // Reset après envoi
    } else {
      alert(`❌ Erreur : ${result.error || 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 font-sans overflow-hidden">
      {/* 🖼 Illustration de fond */}
      <img
        src="/illustration-upload.png"
        alt="upload illustration"
        className="absolute inset-0 w-full h-full object-contain opacity-25 pointer-events-none select-none"
      />

      {/* 🧊 Contenu principal */}
      <div className="z-10 w-full max-w-xl bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-3">
          <FilePlus2 className="w-7 h-7 text-blue-600" />
          Téléverser un document PDF
        </h1>

        {/* 📤 Zone de drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-300 rounded-xl p-10 hover:border-blue-500 hover:bg-blue-50/40 transition"
        >
          <p className="font-medium text-gray-700">
            Glissez votre fichier ici
          </p>
          <p className="text-sm text-gray-500">ou cliquez pour en sélectionner un</p>

          <label className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer transition">
            Choisir un fichier
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* ✅ Affichage du fichier sélectionné */}
        {selectedFile && (
          <>
            <div className="mt-6 flex items-center gap-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2l4 -4"
                />
              </svg>
              <div className="text-sm">
                <p className="font-semibold">Fichier prêt à être téléversé :</p>
                <p className="text-blue-700">{selectedFile.name}</p>
              </div>
            </div>

            {/* 🔘 BOUTON TÉLÉVERSER */}
            <button
              onClick={handleUpload}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              Envoyer le fichier
            </button>
          </>
        )}
      </div>
    </div>
  );
}
