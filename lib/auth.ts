import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findUserByEmail } from "./data";

const timeoutMinutes = Number(process.env.SESSION_TIMEOUT_MINUTES ?? 10);
const timeoutSeconds = timeoutMinutes * 60;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: timeoutSeconds,
    updateAge: 0,
  },
  jwt: {
    maxAge: timeoutSeconds,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existing = await findUserByEmail(user.email);

      if (!existing) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      // On initial sign-in, `user` is present — stamp issue time + role.
      if (user?.email) {
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.role = dbUser.role;
        }
        token.email = user.email;
        token.name = dbUser?.name ?? user.name;
        token.image = dbUser?.image ?? user.image;
        token.iat = Math.floor(Date.now() / 1000);
      }

      // Explicit hard-expiry check every time the token is decoded.
      const issuedAt = (token.iat as number) ?? 0;
      const now = Math.floor(Date.now() / 1000);
      if (now - issuedAt > timeoutSeconds) {
        return {}; // empty token -> treated as unauthenticated
      }

      return token;
    },
    async session({ session, token }) {
      if (!token || !token.email) {
        return { ...session, user: undefined, expires: session.expires };
      }

      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) || "manager";
        (session.user as { email?: string }).email = token.email as string;
      }
      return session;
    },
  },
};