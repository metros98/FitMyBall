// Recommendation database queries
import { prisma } from "@/lib/db";
import type {
  RecommendationResponse,
  Recommendation,
  AlternativeRecommendation,
  SeasonalPick,
} from "@/types/recommendation";
import { getMatchTier } from "@/types/recommendation";
import type { Ball, RetailerLink } from "@/types/ball";
import type { Prisma, Ball as PrismaBall } from "@prisma/client";

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

/**
 * Convert a Prisma Ball record to the API Ball type.
 */
function convertPrismaBall(ball: PrismaBall): Ball {
  return {
    id: ball.id,
    name: ball.name,
    manufacturer: ball.manufacturer,
    modelYear: ball.modelYear,
    description: ball.description,
    construction: ball.construction,
    coverMaterial: ball.coverMaterial,
    layers: ball.layers,
    compression: ball.compression,
    driverSpin: ball.driverSpin,
    ironSpin: ball.ironSpin,
    wedgeSpin: ball.wedgeSpin,
    launchProfile: ball.launchProfile,
    feelRating: ball.feelRating,
    durability: ball.durability,
    skillLevel: ball.skillLevel,
    pricePerDozen: Number(ball.pricePerDozen),
    availableColors: ball.availableColors,
    inStock: ball.inStock,
    discontinued: ball.discontinued,
    optimalTemp: ball.optimalTemp,
    coldSuitability: ball.coldSuitability,
    imageUrl: ball.imageUrl,
    manufacturerUrl: ball.manufacturerUrl,
    productUrls: ball.productUrls as unknown as RetailerLink[],
    slug: ball.slug,
  };
}

/**
 * Create a new recommendation record with related balls.
 * Stores metadata (confidence, alternatives, seasonal) in proper schema fields.
 */
export async function createRecommendation(
  data: CreateRecommendationData
): Promise<string> {
  const recommendation = await prisma.recommendation.create({
    data: {
      quizSessionId: data.quizSessionId,
      userId: data.userId,
      algorithmVersion: "1.1",
      confidenceLevel: data.confidenceLevel,
      confidenceMessage: data.confidenceMessage,
      tradeOffCallout: data.tradeOffCallout,
      alternatives: data.alternatives as unknown as Prisma.InputJsonValue,
      seasonalPicks: data.seasonalPicks as unknown as Prisma.InputJsonValue,
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
          headline: rec.headline,
          explanation: rec.explanation as unknown as Prisma.InputJsonValue,
        })),
      },
    },
  });

  return recommendation.id;
}

/** Return type for recommendation queries that include ball data */
export interface RecommendationWithBalls {
  response: RecommendationResponse;
  balls: Map<string, Ball>;
}

/**
 * Get recommendation by session ID with full details including ball data.
 */
export async function getRecommendationBySessionId(
  sessionId: string
): Promise<RecommendationWithBalls | null> {
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

  return convertToResponse(recommendation);
}

/**
 * Get recommendation by ID with full details including ball data.
 */
export async function getRecommendationById(
  id: string
): Promise<RecommendationWithBalls | null> {
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

  return convertToResponse(recommendation);
}

/**
 * Convert Prisma recommendation record to API response with ball data.
 */
function convertToResponse(
  recommendation: Prisma.RecommendationGetPayload<{
    include: {
      recommendedBalls: {
        include: { ball: true };
      };
    };
  }>
): RecommendationWithBalls {
  const balls = new Map<string, Ball>();

  const recommendations: Recommendation[] = recommendation.recommendedBalls.map(
    (rb) => {
      // Convert and collect ball data
      const ball = convertPrismaBall(rb.ball);
      balls.set(ball.id, ball);

      return {
        ballId: rb.ballId,
        ballName: rb.ball.name,
        manufacturer: rb.ball.manufacturer,
        matchPercentage: rb.matchScore,
        matchTier: getMatchTier(rb.matchScore),
        categoryScores: {
          swingSpeedMatch: rb.swingSpeedScore,
          performancePriorities: rb.performanceScore,
          preferences: rb.preferencesScore,
          playingConditions: rb.conditionsScore,
          currentBallAnalysis: rb.currentBallScore,
        },
        explanation: rb.explanation as unknown as Recommendation["explanation"],
        headline: rb.headline,
      };
    }
  );

  const alternatives = recommendation.alternatives as unknown as RecommendationResponse["alternatives"] | null;
  const seasonalPicks = recommendation.seasonalPicks as unknown as RecommendationResponse["seasonalPicks"];

  const response: RecommendationResponse = {
    confidenceLevel: recommendation.confidenceLevel as RecommendationResponse["confidenceLevel"],
    confidenceMessage: recommendation.confidenceMessage,
    recommendations,
    tradeOffCallout: recommendation.tradeOffCallout,
    alternatives: alternatives ?? {
      stepDown: null,
      stepUp: null,
      bestValue: null,
      moneyNoObject: null,
    },
    seasonalPicks: seasonalPicks ?? null,
  };

  return { response, balls };
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
    topBallMatchScore: rec.recommendedBalls[0]?.matchScore ?? 0,
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
