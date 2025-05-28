'use client';

import NotificationBell from './NotificationBell';

interface HeaderProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex justify-between items-center bg-white px-8 py-6 border-b border-gray-100 shadow-sm font-sans">
      {/* Partie gauche : message de bienvenue */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Hi, Welcome back 👋</h2>
        <p className="text-sm text-gray-500">{user.name}</p>
      </div>

      {/* Partie droite : icône notif + avatar */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <img
          src={user.image || '/avatar-default.png'}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      </div>
    </header>
  );
}
