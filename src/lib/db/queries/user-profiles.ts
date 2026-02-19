// User profiles (seasonal) database queries
import { prisma } from "@/lib/db";
import type { UserProfileInput } from "@/lib/validations/user";

const profileSelect = {
  id: true,
  profileName: true,
  isDefault: true,
  preferredFeel: true,
  budgetRange: true,
  colorPreference: true,
  typicalTemp: true,
  driverBallSpeed: true,
  ironDistance8: true,
  createdAt: true,
  updatedAt: true,
} as const;

function formatProfile(p: {
  id: string;
  profileName: string;
  isDefault: boolean;
  preferredFeel: string | null;
  budgetRange: string | null;
  colorPreference: string | null;
  typicalTemp: string | null;
  driverBallSpeed: number | null;
  ironDistance8: number | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

/**
 * Get all profiles for a user
 */
export async function getUserProfiles(userId: string) {
  const profiles = await prisma.userProfile.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: profileSelect,
  });

  return { profiles: profiles.map(formatProfile) };
}

/**
 * Create a new user profile
 */
export async function createUserProfile(
  userId: string,
  data: UserProfileInput
) {
  // If setting as default, unset others in a transaction
  if (data.isDefault) {
    const [, profile] = await prisma.$transaction([
      prisma.userProfile.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.userProfile.create({
        data: {
          userId,
          ...data,
          isDefault: true,
        },
        select: profileSelect,
      }),
    ]);
    return formatProfile(profile);
  }

  const profile = await prisma.userProfile.create({
    data: {
      userId,
      ...data,
      isDefault: data.isDefault ?? false,
    },
    select: profileSelect,
  });

  return formatProfile(profile);
}

/**
 * Update an existing profile
 */
export async function updateUserProfile(
  profileId: string,
  userId: string,
  data: UserProfileInput
) {
  // If setting as default, unset others
  if (data.isDefault) {
    const [, profile] = await prisma.$transaction([
      prisma.userProfile.updateMany({
        where: { userId, isDefault: true, id: { not: profileId } },
        data: { isDefault: false },
      }),
      prisma.userProfile.update({
        where: { id: profileId, userId },
        data,
        select: profileSelect,
      }),
    ]);
    return formatProfile(profile);
  }

  const profile = await prisma.userProfile.update({
    where: { id: profileId, userId },
    data,
    select: profileSelect,
  });

  return formatProfile(profile);
}

/**
 * Delete a user profile
 */
export async function deleteUserProfile(profileId: string, userId: string) {
  await prisma.userProfile.delete({
    where: { id: profileId, userId },
  });
}
