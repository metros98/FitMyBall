// GET/POST /api/users/[id]/tried-balls - List and add tried balls
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema } from "@/lib/validations/ball";
import { addTriedBallSchema } from "@/lib/validations/user";
import { getUserTriedBalls, addTriedBall } from "@/lib/db/queries/tried-balls";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { TriedBallsResponse } from "@/types/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to view tried balls");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only view your own tried balls");
    }

    const result = await getUserTriedBalls(userIdValidation.data);
    return apiSuccess<TriedBallsResponse>(result);
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
      throw unauthorized("You must be logged in to add tried balls");
    }

    const { id: userIdParam } = await params;
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    if (session.user.id !== userIdValidation.data) {
      throw forbidden("You can only modify your own tried balls");
    }

    const body = await request.json();
    const validation = addTriedBallSchema.safeParse(body);
    if (!validation.success) {
      return validationError(validation.error);
    }

    const triedBall = await addTriedBall(userIdValidation.data, validation.data);
    return apiSuccess(triedBall, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
