import { z } from "zod";

// Reuse the same password strength rules as registration
const passwordStrengthSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/,
    "Password must contain at least one special character"
  );

// Profile update (PUT /api/users/[id]/profile)
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  handicap: z.number().min(-5).max(54).nullable().optional(),
  homeCourseName: z.string().max(100).trim().nullable().optional(),
  homeLocation: z.string().max(100).trim().nullable().optional(),
  preferredUnits: z.enum(["imperial", "metric"]).optional(),
});

// Privacy settings update (PUT /api/users/[id]/privacy)
export const updatePrivacySchema = z.object({
  optInMarketing: z.boolean().optional(),
  optInAnalytics: z.boolean().optional(),
});

// Password change (POST /api/users/[id]/change-password)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordStrengthSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Account deletion (POST /api/users/[id]/delete-account)
export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Favorite ball (POST /api/users/[id]/favorites)
export const addFavoriteSchema = z.object({
  ballId: z.string().cuid(),
});

// Tried ball (POST /api/users/[id]/tried-balls)
export const addTriedBallSchema = z.object({
  ballId: z.string().cuid(),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).trim().optional(),
  roundsPlayed: z.number().int().min(0).max(9999).optional(),
  wouldRecommend: z.boolean().optional(),
  distanceVsExpected: z.enum(["BETTER", "AS_EXPECTED", "WORSE"]).optional(),
  spinVsExpected: z.enum(["MORE", "AS_EXPECTED", "LESS"]).optional(),
  feelVsExpected: z.enum(["SOFTER", "AS_EXPECTED", "FIRMER"]).optional(),
});

// Update tried ball (PUT /api/users/[id]/tried-balls/[ballId])
export const updateTriedBallSchema = addTriedBallSchema.omit({ ballId: true });

// Seasonal profile (POST/PUT /api/users/[id]/profiles)
export const userProfileSchema = z.object({
  profileName: z.string().min(1, "Profile name is required").max(50).trim(),
  isDefault: z.boolean().optional(),
  preferredFeel: z.string().optional(),
  budgetRange: z.string().optional(),
  colorPreference: z.string().optional(),
  typicalTemp: z.string().optional(),
  driverBallSpeed: z.number().int().min(100).max(200).nullable().optional(),
  ironDistance8: z.number().int().min(50).max(300).nullable().optional(),
});

// Type exports
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePrivacyInput = z.infer<typeof updatePrivacySchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type AddTriedBallInput = z.infer<typeof addTriedBallSchema>;
export type UpdateTriedBallInput = z.infer<typeof updateTriedBallSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
