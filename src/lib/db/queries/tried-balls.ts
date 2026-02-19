// Tried balls database queries
import { prisma } from "@/lib/db";
import type { AddTriedBallInput, UpdateTriedBallInput } from "@/lib/validations/user";

const triedBallSelect = {
  id: true,
  ballId: true,
  rating: true,
  notes: true,
  roundsPlayed: true,
  wouldRecommend: true,
  distanceVsExpected: true,
  spinVsExpected: true,
  feelVsExpected: true,
  createdAt: true,
  updatedAt: true,
  ball: {
    select: {
      id: true,
      name: true,
      manufacturer: true,
      pricePerDozen: true,
      imageUrl: true,
      slug: true,
    },
  },
} as const;

function formatTriedBall(tb: {
  id: string;
  ballId: string;
  rating: number | null;
  notes: string | null;
  roundsPlayed: number | null;
  wouldRecommend: boolean | null;
  distanceVsExpected: string | null;
  spinVsExpected: string | null;
  feelVsExpected: string | null;
  createdAt: Date;
  updatedAt: Date;
  ball: {
    id: string;
    name: string;
    manufacturer: string;
    pricePerDozen: unknown;
    imageUrl: string | null;
    slug: string;
  };
}) {
  return {
    id: tb.id,
    ballId: tb.ballId,
    rating: tb.rating,
    notes: tb.notes,
    roundsPlayed: tb.roundsPlayed,
    wouldRecommend: tb.wouldRecommend,
    distanceVsExpected: tb.distanceVsExpected,
    spinVsExpected: tb.spinVsExpected,
    feelVsExpected: tb.feelVsExpected,
    createdAt: tb.createdAt.toISOString(),
    updatedAt: tb.updatedAt.toISOString(),
    ball: {
      ...tb.ball,
      pricePerDozen: Number(tb.ball.pricePerDozen),
    },
  };
}

/**
 * Get all tried balls for a user
 */
export async function getUserTriedBalls(userId: string) {
  const triedBalls = await prisma.userTriedBall.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: triedBallSelect,
  });

  return {
    triedBalls: triedBalls.map(formatTriedBall),
    total: triedBalls.length,
  };
}

/**
 * Add a tried ball record
 */
export async function addTriedBall(userId: string, data: AddTriedBallInput) {
  const { ballId, ...rest } = data;
  const triedBall = await prisma.userTriedBall.create({
    data: {
      userId,
      ballId,
      ...rest,
    },
    select: triedBallSelect,
  });

  return formatTriedBall(triedBall);
}

/**
 * Update a tried ball review
 */
export async function updateTriedBall(
  userId: string,
  ballId: string,
  data: UpdateTriedBallInput
) {
  const triedBall = await prisma.userTriedBall.update({
    where: {
      userId_ballId: { userId, ballId },
    },
    data,
    select: triedBallSelect,
  });

  return formatTriedBall(triedBall);
}

/**
 * Remove a tried ball record
 */
export async function removeTriedBall(userId: string, ballId: string) {
  await prisma.userTriedBall.delete({
    where: {
      userId_ballId: { userId, ballId },
    },
  });
}
