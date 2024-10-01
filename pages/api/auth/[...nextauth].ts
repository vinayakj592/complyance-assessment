import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'employee'; // Default to 'employee' if no role is set
      }
      return session;
    },
    async signIn({ user}) {
      if (user.email === 'complyance0@gmail.com') {
        user.role = 'manager';
      } else {
        user.role = 'employee';
      }
      return true;
    },
  },
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
