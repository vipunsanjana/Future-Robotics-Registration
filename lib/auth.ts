import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findUserByEmail } from "./data";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
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
      if (user?.email) {
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.role = dbUser.role;
        }
        token.email = user.email;
        token.name = dbUser?.name ?? user.name;
        token.image = dbUser?.image ?? user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) || "manager";
        (session.user as { email?: string }).email = token.email as string;
      }
      return session;
    },
  },
};
