// lib/auth.ts

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .selectFrom('users')
          .selectAll()
          .where('email', '=', credentials.email)
          .executeTakeFirst();

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account }) {
      const exists = await db
        .selectFrom('users')
        .select('id')
        .where('id', '=', user.id!)
        .executeTakeFirst();

      if (!exists && account?.provider === 'google') {
        await db
          .insertInto('users')
          .values({
            id: user.id!,
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
            password: null,
          })
          .execute();
      }
    },
  },
};
