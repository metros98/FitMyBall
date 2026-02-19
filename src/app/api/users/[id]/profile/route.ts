// GET/PUT /api/users/[id]/profile - Get or update user profile
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { updateProfileSchema } from "@/lib/validations/user";
import { getUserProfile, updateUserProfile } from "@/lib/db/queries/users";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { UserProfileResponse } from "@/types/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to view your profile");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only view your own profile");
    }

    const profile = await getUserProfile(userIdValidation.data);
    if (!profile) {
      throw badRequest("User not found");
    }

    return apiSuccess<UserProfileResponse>(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to update your profile");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only update your own profile");
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const updated = await updateUserProfile(userIdValidation.data, validation.data);
    return apiSuccess<UserProfileResponse>(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
