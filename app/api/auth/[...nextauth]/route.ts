// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // <- chemin correct si fichier est bien là

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
