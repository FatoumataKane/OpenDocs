'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');

  useEffect(() => {
  if (searchParams.get('logout') === '1') {
    setLogoutMessage('✅ Vous avez bien été déconnecté');

    const timer = setTimeout(() => {
      setLogoutMessage('');
    }, 5000); // 5 secondes

    return () => clearTimeout(timer);
  }
}, [searchParams]);

  const handleLogin = async () => {
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Email ou mot de passe incorrect');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Login section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-sm bg-white shadow-xl rounded-xl p-8">
          <img src="/logo.jpg" alt="OpenDOCS" className="w-32 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
            Connexion à OpenDOCS
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Continue avec Google ou identifiants
          </p>

         {logoutMessage && (
  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 w-[90%] md:w-[500px] text-center rounded shadow-md text-sm z-50 font-medium">
    {logoutMessage}
  </div>
)}
          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-100 py-2 px-3 rounded text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition mb-4"
          >
            Connexion
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">OU</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 hover:shadow-md py-2 rounded-md transition"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Continuer avec Google</span>
          </button>
        </div>
       
      </div>

      {/* Illustration section */}
      <div className="hidden md:flex items-center justify-center w-full md:w-1/2 p-6">
        <img
          src="/illustration.png"
          alt="Illustration"
          className="max-w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
