'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

export default function WebSocketInitializer() {
  useEffect(() => {
    const socket = io({ path: '/api/socket' });

    socket.on('connect', () => {
      console.log('✅ Connecté à Socket.IO');
    });

    socket.on('file-uploaded', (fileName: string) => {
      toast.success(`📄 Nouveau fichier : ${fileName}`);
    });

    // ✅ Fix TypeScript ici
    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
