'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login?logout=1' })}
      className="text-sm text-red-600 font-medium border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition"
    >
      Se déconnecter
    </button>
  );
}
