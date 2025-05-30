import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // <-- maintenant importé proprement

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
