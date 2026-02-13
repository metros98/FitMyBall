import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        // Validate credentials with Zod
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null

        // Find user by email (exclude soft-deleted accounts)
        const user = await prisma.user.findFirst({
          where: { email: validated.data.email, deletedAt: null },
        })
        if (!user || !user.passwordHash) return null

        // Verify password with bcrypt
        const isValid = await bcrypt.compare(validated.data.password, user.passwordHash)
        if (!isValid) return null

        // Return user object (will be added to JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          rememberMe: credentials.rememberMe === "true",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Required for Credentials provider
    maxAge: 30 * 24 * 60 * 60, // 30 days (maximum, for "Remember me")
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Set session duration based on "Remember me" preference
        const rememberMe = (user as unknown as Record<string, unknown>).rememberMe === true
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
        token.exp = Math.floor(Date.now() / 1000) + maxAge
      }
      return token
    },
    async session({ session, token }) {
      // Attach token.id to session.user
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
