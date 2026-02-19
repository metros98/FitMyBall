// User profile database queries
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { UpdateProfileInput, UpdatePrivacyInput } from "@/lib/validations/user";

const BCRYPT_SALT_ROUNDS = 12;

const profileSelect = {
  id: true,
  name: true,
  email: true,
  handicap: true,
  homeCourseName: true,
  homeLocation: true,
  preferredUnits: true,
  optInMarketing: true,
  optInAnalytics: true,
  passwordHash: true,
  createdAt: true,
} as const;

/**
 * Get user profile by ID (excludes soft-deleted)
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: profileSelect,
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    handicap: user.handicap,
    homeCourseName: user.homeCourseName,
    homeLocation: user.homeLocation,
    preferredUnits: user.preferredUnits,
    optInMarketing: user.optInMarketing,
    optInAnalytics: user.optInAnalytics,
    hasPassword: user.passwordHash != null,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Update user profile fields
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      handicap: data.handicap,
      homeCourseName: data.homeCourseName,
      homeLocation: data.homeLocation,
      preferredUnits: data.preferredUnits,
    },
    select: profileSelect,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    handicap: user.handicap,
    homeCourseName: user.homeCourseName,
    homeLocation: user.homeLocation,
    preferredUnits: user.preferredUnits,
    optInMarketing: user.optInMarketing,
    optInAnalytics: user.optInAnalytics,
    hasPassword: user.passwordHash != null,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Update user privacy settings
 */
export async function updateUserPrivacy(
  userId: string,
  data: UpdatePrivacyInput
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      optInMarketing: data.optInMarketing,
      optInAnalytics: data.optInAnalytics,
    },
    select: {
      optInMarketing: true,
      optInAnalytics: true,
    },
  });

  return user;
}

/**
 * Change user password (verify current, hash new, update)
 */
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    return { success: false, error: "Account does not support password authentication" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return { success: true };
}

/**
 * Soft-delete user account (anonymize email, clear sessions)
 */
export async function softDeleteUser(
  userId: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { email: true, passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    return { success: false, error: "Account not found" };
  }

  // Verify email matches
  if (user.email !== email.toLowerCase()) {
    return { success: false, error: "Email does not match" };
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Password is incorrect" };
  }

  // Soft delete: anonymize and mark deleted
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        email: `deleted-${userId}@deleted.fitmyball.com`,
        name: null,
        handicap: null,
        homeCourseName: null,
        homeLocation: null,
      },
    }),
    // Remove active sessions
    prisma.session.deleteMany({
      where: { userId },
    }),
  ]);

  return { success: true };
}

/**
 * Get user stats (recommendation count, favorites count, tried balls count)
 */
export async function getUserStats(userId: string) {
  const [totalRecommendations, totalFavorites, totalTriedBalls] =
    await Promise.all([
      prisma.recommendation.count({ where: { userId } }),
      prisma.userFavoriteBall.count({ where: { userId } }),
      prisma.userTriedBall.count({ where: { userId } }),
    ]);

  return { totalRecommendations, totalFavorites, totalTriedBalls };
}
