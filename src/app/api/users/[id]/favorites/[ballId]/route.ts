// DELETE /api/users/[id]/favorites/[ballId] - Remove a favorite
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema, ballIdSchema } from "@/lib/validations/ball";
import { removeFavorite } from "@/lib/db/queries/favorites";
import { apiSuccess } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; ballId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to remove favorites");
    }

    const { id: userIdParam, ballId: ballIdParam } = await params;

    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    const ballIdValidation = ballIdSchema.safeParse(ballIdParam);
    if (!ballIdValidation.success) {
      throw badRequest("Invalid ball ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only modify your own favorites");
    }

    await removeFavorite(userIdValidation.data, ballIdValidation.data);
    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
