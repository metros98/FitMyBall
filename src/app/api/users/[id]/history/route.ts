// GET /api/users/[id]/history - Get user's recommendation history
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { userIdSchema, paginationSchema } from "@/lib/validations/ball";
import { getUserRecommendationHistory } from "@/lib/db/queries/recommendations";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError, unauthorized, forbidden, badRequest } from "@/lib/utils/api-error";
import type { RecommendationHistoryResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      throw unauthorized("You must be logged in to view recommendation history");
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
      throw forbidden("You can only view your own recommendation history");
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const paginationValidation = paginationSchema.safeParse(searchParams);

    if (!paginationValidation.success) {
      return validationError(paginationValidation.error);
    }

    const { page, limit } = paginationValidation.data;

    // Fetch user's recommendation history
    const result = await getUserRecommendationHistory(userId, page, limit);

    // Build response
    const response: RecommendationHistoryResponse = {
      history: result.history,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
