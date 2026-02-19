// POST /api/users/[id]/change-password - Change user password
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { changePasswordSchema } from "@/lib/validations/user";
import { changeUserPassword } from "@/lib/db/queries/users";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to change your password");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only change your own password");
    }

    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const result = await changeUserPassword(
      userIdValidation.data,
      validation.data.currentPassword,
      validation.data.newPassword
    );

    if (!result.success) {
      throw badRequest(result.error ?? "Failed to change password");
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
