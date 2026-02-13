import { DefaultSession } from "next-auth"

// Extend NextAuth types to include user.id in session
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string | null
    emailVerified: Date | null
  }
}
