// Recommendation database queries
import { prisma } from "@/lib/db";
import type {
  RecommendationResponse,
  Recommendation,
  AlternativeRecommendation,
  SeasonalPick,
  CategoryScores,
} from "@/types/recommendation";
import type { Prisma } from "@prisma/client";

export interface CreateRecommendationData {
  quizSessionId: string;
  userId?: string;
  confidenceLevel: string;
  confidenceMessage: string;
  tradeOffCallout: string | null;
  recommendations: Recommendation[];
  alternatives: {
    stepDown: AlternativeRecommendation | null;
    stepUp: AlternativeRecommendation | null;
    bestValue: AlternativeRecommendation | null;
    moneyNoObject: AlternativeRecommendation | null;
  };
  seasonalPicks: {
    warmWeather: SeasonalPick | null;
    coldWeather: SeasonalPick | null;
  } | null;
}

// Store metadata in recommendation as JSON since schema doesn't have these fields
interface RecommendationMetadata {
  confidenceLevel: string;
  confidenceMessage: string;
  tradeOffCallout: string | null;
  alternatives: CreateRecommendationData["alternatives"];
  seasonalPicks: CreateRecommendationData["seasonalPicks"];
}

/**
 * Create a new recommendation record with related balls
 * Note: The schema doesn't have fields for all recommendation data,
 * so we store metadata in the explanation field of the first ball temporarily.
 * This should be fixed in a schema migration later.
 */
export async function createRecommendation(
  data: CreateRecommendationData
): Promise<string> {
  // Store metadata with the first recommendation ball
  const metadata: RecommendationMetadata = {
    confidenceLevel: data.confidenceLevel,
    confidenceMessage: data.confidenceMessage,
    tradeOffCallout: data.tradeOffCallout,
    alternatives: data.alternatives,
    seasonalPicks: data.seasonalPicks,
  };

  const recommendation = await prisma.recommendation.create({
    data: {
      quizSessionId: data.quizSessionId,
      userId: data.userId,
      algorithmVersion: "1.1", // PRD v1.1
      // Create recommendation balls (top 5)
      recommendedBalls: {
        create: data.recommendations.map((rec, index) => ({
          ballId: rec.ballId,
          rank: index + 1,
          matchScore: rec.matchPercentage,
          swingSpeedScore: rec.categoryScores.swingSpeedMatch,
          performanceScore: rec.categoryScores.performancePriorities,
          preferencesScore: rec.categoryScores.preferences,
          conditionsScore: rec.categoryScores.playingConditions,
          currentBallScore: rec.categoryScores.currentBallAnalysis,
          // Store explanation with metadata in first ball
          explanation: (index === 0
            ? { ...rec.explanation, _metadata: metadata }
            : rec.explanation) as unknown as Prisma.InputJsonValue,
        })),
      },
    },
  });

  return recommendation.id;
}

/**
 * Get recommendation by session ID with full details
 */
export async function getRecommendationBySessionId(
  sessionId: string
): Promise<RecommendationResponse | null> {
  const recommendation = await prisma.recommendation.findUnique({
    where: {
      quizSessionId: sessionId,
    },
    include: {
      recommendedBalls: {
        include: {
          ball: true,
        },
        orderBy: {
          rank: "asc",
        },
      },
    },
  });

  if (!recommendation) {
    return null;
  }

  // Extract metadata from first ball's explanation
  const firstBallExplanation = recommendation.recommendedBalls[0]?.explanation as any;
  const metadata = firstBallExplanation?._metadata as RecommendationMetadata | undefined;

  // Convert to RecommendationResponse format
  const recommendations: Recommendation[] = recommendation.recommendedBalls.map(
    (rb) => {
      const explanation = rb.explanation as any;
      const { _metadata, ...cleanExplanation } = explanation;

      return {
        ballId: rb.ballId,
        ballName: rb.ball.name,
        manufacturer: rb.ball.manufacturer,
        matchPercentage: rb.matchScore,
        matchTier: determineMatchTier(rb.matchScore),
        categoryScores: {
          swingSpeedMatch: rb.swingSpeedScore,
          performancePriorities: rb.performanceScore,
          preferences: rb.preferencesScore,
          playingConditions: rb.conditionsScore,
          currentBallAnalysis: rb.currentBallScore,
        },
        explanation: cleanExplanation,
        headline: generateHeadline(rb.ball.name, rb.matchScore),
      };
    }
  );

  return {
    confidenceLevel: (metadata?.confidenceLevel || "medium") as RecommendationResponse["confidenceLevel"],
    confidenceMessage: metadata?.confidenceMessage || "Good match based on your preferences",
    recommendations,
    tradeOffCallout: metadata?.tradeOffCallout || null,
    alternatives: metadata?.alternatives || {
      stepDown: null,
      stepUp: null,
      bestValue: null,
      moneyNoObject: null,
    },
    seasonalPicks: metadata?.seasonalPicks || null,
  };
}

/**
 * Get recommendation by ID
 */
export async function getRecommendationById(
  id: string
): Promise<RecommendationResponse | null> {
  const recommendation = await prisma.recommendation.findUnique({
    where: {
      id,
    },
    include: {
      recommendedBalls: {
        include: {
          ball: true,
        },
        orderBy: {
          rank: "asc",
        },
      },
    },
  });

  if (!recommendation) {
    return null;
  }

  // Extract metadata from first ball's explanation
  const firstBallExplanation = recommendation.recommendedBalls[0]?.explanation as any;
  const metadata = firstBallExplanation?._metadata as RecommendationMetadata | undefined;

  // Convert to RecommendationResponse format
  const recommendations: Recommendation[] = recommendation.recommendedBalls.map(
    (rb) => {
      const explanation = rb.explanation as any;
      const { _metadata, ...cleanExplanation } = explanation;

      return {
        ballId: rb.ballId,
        ballName: rb.ball.name,
        manufacturer: rb.ball.manufacturer,
        matchPercentage: rb.matchScore,
        matchTier: determineMatchTier(rb.matchScore),
        categoryScores: {
          swingSpeedMatch: rb.swingSpeedScore,
          performancePriorities: rb.performanceScore,
          preferences: rb.preferencesScore,
          playingConditions: rb.conditionsScore,
          currentBallAnalysis: rb.currentBallScore,
        },
        explanation: cleanExplanation,
        headline: generateHeadline(rb.ball.name, rb.matchScore),
      };
    }
  );

  return {
    confidenceLevel: (metadata?.confidenceLevel || "medium") as RecommendationResponse["confidenceLevel"],
    confidenceMessage: metadata?.confidenceMessage || "Good match based on your preferences",
    recommendations,
    tradeOffCallout: metadata?.tradeOffCallout || null,
    alternatives: metadata?.alternatives || {
      stepDown: null,
      stepUp: null,
      bestValue: null,
      moneyNoObject: null,
    },
    seasonalPicks: metadata?.seasonalPicks || null,
  };
}

/**
 * Get user's recommendation history with pagination
 */
export async function getUserRecommendationHistory(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [recommendations, total] = await Promise.all([
    prisma.recommendation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        recommendedBalls: {
          where: {
            rank: 1, // Top recommendation
          },
          include: {
            ball: {
              select: {
                name: true,
              },
            },
          },
        },
        quizSession: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.recommendation.count({
      where: {
        userId,
      },
    }),
  ]);

  const history = recommendations.map((rec) => ({
    id: rec.id,
    createdAt: rec.createdAt.toISOString(),
    topBallName: rec.recommendedBalls[0]?.ball.name ?? "Unknown",
    sessionId: rec.quizSession.id,
  }));

  return {
    history,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Save recommendation to user account
 * Links an existing recommendation to a user (if it was created as guest)
 */
export async function saveRecommendationToUser(
  sessionId: string,
  userId: string
): Promise<{ success: boolean; recommendationId: string | null }> {
  // Find recommendation by session
  const recommendation = await prisma.recommendation.findUnique({
    where: {
      quizSessionId: sessionId,
    },
  });

  if (!recommendation) {
    return { success: false, recommendationId: null };
  }

  // If already linked to this user, return existing
  if (recommendation.userId === userId) {
    return { success: true, recommendationId: recommendation.id };
  }

  // Update to link to user and mark as saved
  const updated = await prisma.recommendation.update({
    where: {
      id: recommendation.id,
    },
    data: {
      userId,
      saved: true,
    },
  });

  // Also update the quiz session
  await prisma.quizSession.update({
    where: {
      id: sessionId,
    },
    data: {
      userId,
    },
  });

  return { success: true, recommendationId: updated.id };
}

/**
 * Helper: Determine match tier from score
 */
function determineMatchTier(score: number): Recommendation["matchTier"] {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  return "moderate";
}

/**
 * Helper: Generate headline from ball name and score
 */
function generateHeadline(ballName: string, score: number): string {
  if (score >= 90) return `Excellent match for your game`;
  if (score >= 80) return `Great fit based on your preferences`;
  if (score >= 70) return `Good option to consider`;
  return `Solid choice with some trade-offs`;
}
