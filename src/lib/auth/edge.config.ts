import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Lightweight auth config for Edge middleware — no Prisma, no bcrypt
export const { auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Actual auth logic runs in the full config (auth.config.ts)
        // This stub satisfies the Edge runtime requirement
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string
      return session
    },
  },
})
