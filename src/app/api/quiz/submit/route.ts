// POST /api/quiz/submit - Submit quiz and generate recommendations
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { quizSchema } from "@/lib/validations/quiz";
import { generateRecommendations } from "@/lib/matching-algorithm";
import { getAllBallsForMatching } from "@/lib/db/queries/balls";
import { createQuizSession } from "@/lib/db/queries/quiz-sessions";
import { createRecommendation } from "@/lib/db/queries/recommendations";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/api-error";
import type { QuizSubmitResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate quiz data
    const validationResult = quizSchema.safeParse(body.quizData);
    if (!validationResult.success) {
      return validationError(validationResult.error);
    }

    const quizData = validationResult.data;

    // Get authenticated user (optional)
    const session = await auth();
    const userId = session?.user?.id;

    // Get IP address for guest tracking
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Create quiz session in database
    const sessionId = await createQuizSession({
      quizData,
      userId,
      ipAddress,
    });

    // Fetch all balls for matching algorithm
    const allBalls = await getAllBallsForMatching();

    if (allBalls.length === 0) {
      throw new Error("No balls available in database");
    }

    // Run matching algorithm
    const algorithmOutput = generateRecommendations(quizData, allBalls);

    // Convert MatchResult[] to Recommendation[] format
    const recommendations = algorithmOutput.recommendations.map((result) => ({
      ballId: result.ball.id,
      ballName: result.ball.name,
      manufacturer: result.ball.manufacturer,
      matchPercentage: result.matchScore,
      matchTier: result.matchTier,
      categoryScores: result.categoryScores,
      explanation: result.explanation,
      headline: result.headline,
    }));

    // Save recommendation to database
    const recommendationId = await createRecommendation({
      quizSessionId: sessionId,
      userId,
      confidenceLevel: algorithmOutput.confidenceLevel,
      confidenceMessage: algorithmOutput.confidenceMessage,
      tradeOffCallout: algorithmOutput.tradeOffCallout,
      recommendations,
      alternatives: algorithmOutput.alternatives,
      seasonalPicks: algorithmOutput.seasonalPicks,
    });

    // Build response
    const response: QuizSubmitResponse = {
      sessionId,
      recommendation: {
        confidenceLevel: algorithmOutput.confidenceLevel,
        confidenceMessage: algorithmOutput.confidenceMessage,
        recommendations,
        tradeOffCallout: algorithmOutput.tradeOffCallout,
        alternatives: algorithmOutput.alternatives,
        seasonalPicks: algorithmOutput.seasonalPicks,
      },
      timestamp: new Date().toISOString(),
    };

    // Return 201 Created with Location header
    const nextResponse = apiSuccess(response, 201);
    nextResponse.headers.set(
      "Location",
      `/api/recommendations/${sessionId}`
    );

    return nextResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
