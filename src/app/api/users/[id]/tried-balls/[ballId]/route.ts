// PUT/DELETE /api/users/[id]/tried-balls/[ballId] - Update or remove tried ball
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema, ballIdSchema } from "@/lib/validations/ball";
import { updateTriedBallSchema } from "@/lib/validations/user";
import { updateTriedBall, removeTriedBall } from "@/lib/db/queries/tried-balls";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ballId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to update tried balls");
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
      throw forbidden("You can only modify your own tried balls");
    }

    const body = await request.json();
    const validation = updateTriedBallSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const updated = await updateTriedBall(
      userIdValidation.data,
      ballIdValidation.data,
      validation.data
    );
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; ballId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to remove tried balls");
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
      throw forbidden("You can only modify your own tried balls");
    }

    await removeTriedBall(userIdValidation.data, ballIdValidation.data);
    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
