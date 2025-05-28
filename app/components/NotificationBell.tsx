'use client';

import { Bell, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const LOCAL_KEY = 'notifications';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 🔁 Charger depuis localStorage au chargement
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  // 🧠 Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // WebSocket
  useEffect(() => {
    const socket = io({ path: '/api/socket' });

    socket.on('connect', () => {
      console.log('✅ Socket connecté');
    });

    socket.on('file-uploaded', (fileName: string) => {
      const message = `📄 Nouveau fichier : ${fileName}`;
      setNotifications((prev) => [message, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const deleteNotification = (index: number) => {
    const updated = [...notifications];
    updated.splice(index, 1);
    setNotifications(updated);
  };

  const hasNew = notifications.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {hasNew && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🔔 Notifications</h4>
            <ul className="text-sm text-gray-700 max-h-64 overflow-auto space-y-2">
              {notifications.length === 0 ? (
                <li className="text-gray-400">Aucune notification</li>
              ) : (
                notifications.map((notif, index) => (
                  <li
                    key={index}
                    className="border-b pb-1 last:border-none flex justify-between items-start gap-2"
                  >
                    <span className="flex-1">{notif}</span>
                    <button
                      onClick={() => deleteNotification(index)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
