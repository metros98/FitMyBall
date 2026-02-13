"use server"

import { prisma } from "@/lib/db"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import bcrypt from "bcryptjs"
import { signIn } from "@/lib/auth/auth.config"

export async function registerUser(data: RegisterInput) {
  try {
    // Validate input
    const validated = registerSchema.parse(data)

    // Check if email already exists (exclude soft-deleted accounts)
    const existingUser = await prisma.user.findFirst({
      where: { email: validated.email, deletedAt: null },
    })

    if (existingUser) {
      return { error: "An account with this email already exists" }
    }

    // Hash password (12 salt rounds minimum per PRD)
    const passwordHash = await bcrypt.hash(validated.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
      },
    })

    // Auto sign-in after registration
    try {
      await signIn("credentials", {
        email: validated.email,
        password: validated.password,
        redirect: false,
      })
    } catch {
      // Account created but auto-sign-in failed — user can log in manually
      return { success: true, userId: user.id, signInFailed: true }
    }

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An error occurred during registration" }
  }
}
