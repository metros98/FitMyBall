// Quiz session database queries
import { prisma } from "@/lib/db";
import type { QuizData } from "@/types/quiz";
import type { Prisma } from "@prisma/client";

export interface CreateQuizSessionData {
  quizData: QuizData;
  userId?: string;
  ipAddress?: string;
}

/**
 * Create a new quiz session
 * Supports both guest and authenticated users
 */
export async function createQuizSession(
  data: CreateQuizSessionData
): Promise<string> {
  // Calculate expiration (30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Build session data - only include userId for authenticated users
  const sessionData: any = {
    ipAddress: data.ipAddress,
    quizData: data.quizData as unknown as Prisma.InputJsonValue,
    expiresAt,
    completed: true,
  };

  // Add userId only if provided (authenticated users)
  if (data.userId) {
    sessionData.userId = data.userId;
  }

  const session = await prisma.quizSession.create({
    data: sessionData,
  });

  return session.id;
}

/**
 * Get quiz session by ID
 */
export async function getQuizSessionById(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return null;
  }

  // Quiz data is stored as JSON
  const quizData = session.quizData as unknown as QuizData;

  return {
    id: session.id,
    userId: session.userId,
    quizData,
    createdAt: session.createdAt,
  };
}

/**
 * Get quiz session with recommendations
 */
export async function getQuizSessionWithRecommendations(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      recommendation: {
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
      },
    },
  });

  return session;
}

/**
 * Delete expired quiz sessions (>30 days old)
 * Run this periodically via cron job
 */
export async function deleteExpiredSessions(): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await prisma.quizSession.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo,
      },
      userId: null, // Only delete guest sessions
    },
  });

  return result.count;
}

/**
 * Check if session is expired (>30 days)
 */
export function isSessionExpired(createdAt: Date): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return createdAt < thirtyDaysAgo;
}
