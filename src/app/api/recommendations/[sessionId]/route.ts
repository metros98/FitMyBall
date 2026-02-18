// GET /api/recommendations/[sessionId] - Retrieve recommendation by session ID
import { NextRequest } from "next/server";
import { sessionIdSchema } from "@/lib/validations/ball";
import { getQuizSessionById } from "@/lib/db/queries/quiz-sessions";
import { getRecommendationBySessionId } from "@/lib/db/queries/recommendations";
import { isSessionExpired } from "@/lib/db/queries/quiz-sessions";
import { apiSuccess, HttpError } from "@/lib/utils/api-response";
import { handleApiError, badRequest, gone } from "@/lib/utils/api-error";
import type { RecommendationDetailResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: sessionIdParam } = await params;
    
    // Validate session ID
    const validationResult = sessionIdSchema.safeParse(sessionIdParam);
    if (!validationResult.success) {
      throw badRequest("Invalid session ID format");
    }

    const sessionId = validationResult.data;

    // Get quiz session
    const session = await getQuizSessionById(sessionId);
    if (!session) {
      return HttpError.notFound("Recommendation session");
    }

    // Check if session is expired (>30 days)
    if (isSessionExpired(session.createdAt)) {
      throw gone("This recommendation session has expired");
    }

    // Get recommendation data
    const result = await getRecommendationBySessionId(sessionId);
    if (!result) {
      return HttpError.notFound("Recommendation data");
    }

    // Build response
    const response: RecommendationDetailResponse = {
      sessionId: session.id,
      quizData: session.quizData,
      recommendation: result.response,
      createdAt: session.createdAt.toISOString(),
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
