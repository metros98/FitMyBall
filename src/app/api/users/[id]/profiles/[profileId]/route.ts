// PUT/DELETE /api/users/[id]/profiles/[profileId] - Update or delete profile
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { userProfileSchema } from "@/lib/validations/user";
import { updateUserProfile, deleteUserProfile } from "@/lib/db/queries/user-profiles";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import { z } from "zod";

const profileIdSchema = z.string().cuid();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; profileId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to update profiles");
    }

    const { id: userIdParam, profileId: profileIdParam } = await params;

    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    const profileIdValidation = profileIdSchema.safeParse(profileIdParam);
    if (!profileIdValidation.success) {
      throw badRequest("Invalid profile ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only update your own profiles");
    }

    const body = await request.json();
    const validation = userProfileSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const updated = await updateUserProfile(
      profileIdValidation.data,
      userIdValidation.data,
      validation.data
    );
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; profileId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to delete profiles");
    }

    const { id: userIdParam, profileId: profileIdParam } = await params;

    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    const profileIdValidation = profileIdSchema.safeParse(profileIdParam);
    if (!profileIdValidation.success) {
      throw badRequest("Invalid profile ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only delete your own profiles");
    }

    await deleteUserProfile(profileIdValidation.data, userIdValidation.data);
    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
