import type { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { sendMagicLinkEmail } from "@/lib/email"
import { clientPromise } from "@/lib/mongodb-client"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        await sendMagicLinkEmail(identifier, url)
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
