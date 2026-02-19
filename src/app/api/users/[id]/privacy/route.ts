// PUT /api/users/[id]/privacy - Update privacy settings
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { updatePrivacySchema } from "@/lib/validations/user";
import { updateUserPrivacy } from "@/lib/db/queries/users";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to update privacy settings");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only update your own privacy settings");
    }

    const body = await request.json();
    const validation = updatePrivacySchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const updated = await updateUserPrivacy(userIdValidation.data, validation.data);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
