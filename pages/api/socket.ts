// /pages/api/socket.ts
import { Server } from 'socket.io';

export const config = {
  api: { bodyParser: false },
};

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    console.log('🔌 Initialisation de Socket.IO...');

    const io = new Server(res.socket.server, {
      path: '/api/socket',
    });

    res.socket.server.io = io;
    (global as any).io = io;

    io.on('connection', (socket) => {
      console.log('✅ Client connecté :', socket.id);
    });
  }

  res.end();
}
