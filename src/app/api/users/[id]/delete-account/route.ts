// POST /api/users/[id]/delete-account - Soft-delete user account
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { deleteAccountSchema } from "@/lib/validations/user";
import { softDeleteUser } from "@/lib/db/queries/users";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to delete your account");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only delete your own account");
    }

    const body = await request.json();
    const validation = deleteAccountSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const result = await softDeleteUser(
      userIdValidation.data,
      validation.data.confirmEmail,
      validation.data.password
    );

    if (!result.success) {
      throw badRequest(result.error ?? "Failed to delete account");
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
