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
      try {
        if (session.user) {
          session.user.id = user.id;
          session.user.role = user.role || 'employee'; // Default role
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    },
    async signIn({ user }) {
      try {
        if (user.email === 'complyance0@gmail.com') {
          user.role = 'manager';
        } else {
          user.role = 'employee';
        }
        return true;
      } catch (error) {
        console.error('Sign-in callback error:', error);
        throw error;
      }
    },
  },
  pages: {
    signIn: '/', // Ensure this route exists
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure NEXTAUTH_SECRET is set
  debug: true, // Enables debug messages in the console
}

export default NextAuth(authOptions)