// POST /api/users/[id]/recommendations - Save recommendation to user account
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema, saveRecommendationSchema } from "@/lib/validations/ball";
import { saveRecommendationToUser } from "@/lib/db/queries/recommendations";
import { apiSuccess, HttpError, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { SaveRecommendationResponse } from "@/types/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to save recommendations");
    }

    const { id: userIdParam } = await params;

    // Validate user ID from route
    const userIdValidation = userIdSchema.safeParse(userIdParam);
    if (!userIdValidation.success) {
      throw badRequest("Invalid user ID format");
    }

    const userId = userIdValidation.data;

    // Verify user is accessing their own data
    if (session.user.id !== userId) {
      throw forbidden("You can only save recommendations to your own account");
    }

    // Parse and validate request body
    const body = await request.json();
    const bodyValidation = saveRecommendationSchema.safeParse(body);

    if (!bodyValidation.success) {
      return validationError(bodyValidation.error);
    }

    const { sessionId } = bodyValidation.data;

    // Save recommendation to user account
    const result = await saveRecommendationToUser(sessionId, userId);

    if (!result.success || !result.recommendationId) {
      return HttpError.notFound("Recommendation session");
    }

    // Build response
    const response: SaveRecommendationResponse = {
      saved: true,
      recommendationId: result.recommendationId,
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
