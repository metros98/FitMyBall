// Ball database queries
import { prisma } from "@/lib/db";
import type { Ball } from "@/types/ball";
import type { Prisma } from "@prisma/client";

export interface BallFilters {
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  compression?: number;
  construction?: string;
  color?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  sortBy: "price" | "compression" | "name";
  sortOrder: "asc" | "desc";
}

export interface BallListResult {
  balls: Ball[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get all balls with optional filtering, sorting, and pagination
 */
export async function getAllBalls(
  filters?: BallFilters,
  pagination?: PaginationOptions,
  sort?: SortOptions
): Promise<BallListResult> {
  const page = pagination?.page ?? 1;
  const limit = Math.min(pagination?.limit ?? 20, 100); // Max 100 per page
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.BallWhereInput = {
    inStock: true, // Only show in-stock balls
  };

  if (filters?.manufacturer) {
    where.manufacturer = {
      equals: filters.manufacturer,
      mode: "insensitive",
    };
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.pricePerDozen = {};
    if (filters.minPrice !== undefined) {
      where.pricePerDozen.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.pricePerDozen.lte = filters.maxPrice;
    }
  }

  if (filters?.compression !== undefined) {
    // Match compression within ±5
    where.compression = {
      gte: filters.compression - 5,
      lte: filters.compression + 5,
    };
  }

  if (filters?.construction) {
    where.construction = {
      equals: filters.construction,
      mode: "insensitive",
    };
  }

  if (filters?.color) {
    where.availableColors = {
      has: filters.color,
    };
  }

  // Build orderBy clause
  const orderBy: Prisma.BallOrderByWithRelationInput = {};
  const sortBy = sort?.sortBy ?? "name";
  const sortOrder = sort?.sortOrder ?? "asc";

  if (sortBy === "price") {
    orderBy.pricePerDozen = sortOrder;
  } else if (sortBy === "compression") {
    orderBy.compression = sortOrder;
  } else {
    orderBy.name = sortOrder;
  }

  // Execute query with select to minimize data transfer
  const [balls, total] = await Promise.all([
    prisma.ball.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        manufacturer: true,
        pricePerDozen: true,
        imageUrl: true,
        compression: true,
        construction: true,
        driverSpin: true,
        ironSpin: true,
        wedgeSpin: true,
        launchProfile: true,
        feelRating: true,
        availableColors: true,
      },
    }),
    prisma.ball.count({ where }),
  ]);

  // Convert Prisma result to Ball type
  const convertedBalls = balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
    spinProfile: {
      driver: ball.driverSpin.toLowerCase() as "low" | "mid" | "high",
      iron: ball.ironSpin.toLowerCase() as "low" | "mid" | "high",
      wedge: ball.wedgeSpin.toLowerCase() as "low" | "mid" | "high",
    },
    launchCharacteristic: ball.launchProfile.toLowerCase() as "low" | "mid" | "high",
    feelRating: ball.feelRating.toLowerCase().replace("_", "_") as Ball["feelRating"],
    image: ball.imageUrl,
  }));

  return {
    balls: convertedBalls as unknown as Ball[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single ball by ID with all fields
 */
export async function getBallById(id: string): Promise<Ball | null> {
  const ball = await prisma.ball.findUnique({
    where: { id },
  });

  if (!ball) {
    return null;
  }

  // Convert Prisma types to Ball type
  return {
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
    msrp: Number(ball.msrp),
    spinProfile: {
      driver: ball.driverSpin.toLowerCase() as "low" | "mid" | "high",
      iron: ball.ironSpin.toLowerCase() as "low" | "mid" | "high",
      wedge: ball.wedgeSpin.toLowerCase() as "low" | "mid" | "high",
    },
    launchCharacteristic: ball.launchProfile.toLowerCase() as "low" | "mid" | "high",
    feelRating: ball.feelRating.toLowerCase().replace("_", "_") as Ball["feelRating"],
    image: ball.imageUrl,
    temperaturePerformance: {
      optimal: ball.optimalTemp.toLowerCase() as "warm" | "moderate" | "cold" | "all",
      coldSuitability: ball.coldSuitability,
    },
    targetHandicap: ball.targetHandicapMin && ball.targetHandicapMax
      ? `${ball.targetHandicapMin}-${ball.targetHandicapMax}`
      : "All",
  } as unknown as Ball;
}

/**
 * Get multiple balls by IDs (for recommendation results)
 */
export async function getBallsByIds(ids: string[]): Promise<Ball[]> {
  const balls = await prisma.ball.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  // Convert Prisma types to Ball type
  return balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
    msrp: Number(ball.msrp),
    spinProfile: {
      driver: ball.driverSpin.toLowerCase() as "low" | "mid" | "high",
      iron: ball.ironSpin.toLowerCase() as "low" | "mid" | "high",
      wedge: ball.wedgeSpin.toLowerCase() as "low" | "mid" | "high",
    },
    launchCharacteristic: ball.launchProfile.toLowerCase() as "low" | "mid" | "high",
    feelRating: ball.feelRating.toLowerCase().replace("_", "_") as Ball["feelRating"],
    image: ball.imageUrl,
    temperaturePerformance: {
      optimal: ball.optimalTemp.toLowerCase() as "warm" | "moderate" | "cold" | "all",
      coldSuitability: ball.coldSuitability,
    },
    targetHandicap: ball.targetHandicapMin && ball.targetHandicapMax
      ? `${ball.targetHandicapMin}-${ball.targetHandicapMax}`
      : "All",
  })) as unknown as Ball[];
}

/**
 * Search balls by name or manufacturer
 */
export async function searchBalls(
  query: string,
  limit: number = 10
): Promise<Ball[]> {
  const maxLimit = Math.min(limit, 20); // Max 20 results for search

  const balls = await prisma.ball.findMany({
    where: {
      AND: [
        { inStock: true },
        {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              manufacturer: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
    take: maxLimit,
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      manufacturer: true,
      pricePerDozen: true,
      imageUrl: true,
      compression: true,
      construction: true,
      driverSpin: true,
      ironSpin: true,
      wedgeSpin: true,
      launchProfile: true,
      feelRating: true,
      availableColors: true,
    },
  });

  // Convert Prisma result to Ball type
  return balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
    spinProfile: {
      driver: ball.driverSpin.toLowerCase() as "low" | "mid" | "high",
      iron: ball.ironSpin.toLowerCase() as "low" | "mid" | "high",
      wedge: ball.wedgeSpin.toLowerCase() as "low" | "mid" | "high",
    },
    launchCharacteristic: ball.launchProfile.toLowerCase() as "low" | "mid" | "high",
    feelRating: ball.feelRating.toLowerCase().replace("_", "_") as Ball["feelRating"],
    image: ball.imageUrl,
  })) as unknown as Ball[];
}

/**
 * Get all balls without pagination (for algorithm use)
 * Fetches complete ball data for matching
 */
export async function getAllBallsForMatching(): Promise<Ball[]> {
  const balls = await prisma.ball.findMany({
    where: {
      inStock: true,
    },
  });

  // Convert Prisma types to Ball type
  return balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
    msrp: Number(ball.msrp),
    spinProfile: {
      driver: ball.driverSpin.toLowerCase() as "low" | "mid" | "high",
      iron: ball.ironSpin.toLowerCase() as "low" | "mid" | "high",
      wedge: ball.wedgeSpin.toLowerCase() as "low" | "mid" | "high",
    },
    launchCharacteristic: ball.launchProfile.toLowerCase() as "low" | "mid" | "high",
    feelRating: ball.feelRating.toLowerCase().replace("_", "_") as Ball["feelRating"],
    image: ball.imageUrl,
    temperaturePerformance: {
      optimal: ball.optimalTemp.toLowerCase() as "warm" | "moderate" | "cold" | "all",
      coldSuitability: ball.coldSuitability,
    },
    targetHandicap: ball.targetHandicapMin && ball.targetHandicapMax
      ? `${ball.targetHandicapMin}-${ball.targetHandicapMax}`
      : "All",
  })) as unknown as Ball[];
}
