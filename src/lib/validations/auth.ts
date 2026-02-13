import { z } from "zod"

// Reusable password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, "Password must contain at least one special character")

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the Terms of Service"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
})

// Type inference
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ResetRequestInput = z.infer<typeof resetRequestSchema>
