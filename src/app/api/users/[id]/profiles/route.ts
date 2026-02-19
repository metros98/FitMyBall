// GET/POST /api/users/[id]/profiles - List and create user profiles
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { userProfileSchema } from "@/lib/validations/user";
import { getUserProfiles, createUserProfile } from "@/lib/db/queries/user-profiles";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { UserProfilesResponse } from "@/types/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to view profiles");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only view your own profiles");
    }

    const result = await getUserProfiles(userIdValidation.data);
    return apiSuccess<UserProfilesResponse>(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to create profiles");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only create your own profiles");
    }

    const body = await request.json();
    const validation = userProfileSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const profile = await createUserProfile(
      userIdValidation.data,
      validation.data
    );
    return apiSuccess(profile, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
