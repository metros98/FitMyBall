// GET/POST /api/users/[id]/favorites - List and add favorites
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { addFavoriteSchema } from "@/lib/validations/user";
import { getUserFavorites, addFavorite } from "@/lib/db/queries/favorites";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { FavoritesResponse } from "@/types/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to view favorites");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only view your own favorites");
    }

    const result = await getUserFavorites(userIdValidation.data);
    return apiSuccess<FavoritesResponse>(result);
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
      throw unauthorized("You must be logged in to add favorites");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only modify your own favorites");
    }

    const body = await request.json();
    const validation = addFavoriteSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const favorite = await addFavorite(
      userIdValidation.data,
      validation.data.ballId
    );
    return apiSuccess(favorite, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
