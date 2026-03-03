import type { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
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
    ...(process.env.NODE_ENV === "development" ? [
      CredentialsProvider({
        name: "Dev Login",
        credentials: {
          email: { label: "Email", type: "email" },
          userId: { label: "User ID", type: "text" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.userId) {
            return null
          }
          return {
            id: credentials.userId,
            email: credentials.email,
            name: credentials.email.split("@")[0],
          }
        },
      }),
    ] : []),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login",
    error: "/login",
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
