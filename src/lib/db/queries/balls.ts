// Ball database queries
import { prisma } from "@/lib/db";
import type { Ball, RetailerLink } from "@/types/ball";
import type { Prisma, Ball as PrismaBall } from "@prisma/client";

/**
 * Convert Prisma Ball record to API Ball type.
 * Only needs Decimal→number for pricing and Json[]→RetailerLink[] for productUrls.
 * All enum fields (driverSpin, ironSpin, etc.) are structurally compatible.
 */
function convertBall(ball: PrismaBall): Ball {
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

export interface BallFilters {
  q?: string;
  manufacturer?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  compression?: number;
  construction?: string | string[];
  color?: string | string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  sortBy: "price" | "compression" | "name" | "manufacturer";
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
  const andConditions: Prisma.BallWhereInput[] = [
    { inStock: true }, // Only show in-stock balls
  ];

  // Search query (name OR manufacturer contains search term)
  if (filters?.q) {
    andConditions.push({
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { manufacturer: { contains: filters.q, mode: "insensitive" } },
      ],
    });
  }

  // Manufacturer filter (single or multiple)
  if (filters?.manufacturer) {
    if (Array.isArray(filters.manufacturer)) {
      andConditions.push({
        manufacturer: {
          in: filters.manufacturer,
        },
      });
    } else {
      andConditions.push({
        manufacturer: {
          equals: filters.manufacturer,
          mode: "insensitive",
        },
      });
    }
  }

  // Price range filter
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    const priceFilter: Prisma.BallWhereInput = { pricePerDozen: {} };
    if (filters.minPrice !== undefined) {
      (priceFilter.pricePerDozen as any).gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      (priceFilter.pricePerDozen as any).lte = filters.maxPrice;
    }
    andConditions.push(priceFilter);
  }

  // Compression filter (within ±5)
  if (filters?.compression !== undefined) {
    andConditions.push({
      compression: {
        gte: filters.compression - 5,
        lte: filters.compression + 5,
      },
    });
  }

  // Construction filter (single or multiple)
  if (filters?.construction) {
    if (Array.isArray(filters.construction)) {
      andConditions.push({
        construction: {
          in: filters.construction,
        },
      });
    } else {
      andConditions.push({
        construction: {
          equals: filters.construction,
          mode: "insensitive",
        },
      });
    }
  }

  // Color filter (single or multiple)
  if (filters?.color) {
    if (Array.isArray(filters.color)) {
      andConditions.push({
        OR: filters.color.map(c => ({
          availableColors: { has: c }
        })),
      });
    } else {
      andConditions.push({
        availableColors: {
          has: filters.color,
        },
      });
    }
  }

  const where: Prisma.BallWhereInput = {
    AND: andConditions,
  };

  // Build orderBy clause
  const orderBy: Prisma.BallOrderByWithRelationInput = {};
  const sortBy = sort?.sortBy ?? "name";
  const sortOrder = sort?.sortOrder ?? "asc";

  if (sortBy === "price") {
    orderBy.pricePerDozen = sortOrder;
  } else if (sortBy === "compression") {
    orderBy.compression = sortOrder;
  } else if (sortBy === "manufacturer") {
    orderBy.manufacturer = sortOrder;
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

  // Convert Prisma Decimal to number for price
  const convertedBalls = balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
  }));

  return {
    balls: convertedBalls as Ball[],
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

  return convertBall(ball);
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

  return balls.map(convertBall);
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

  // Convert Prisma Decimal to number for price
  return balls.map(ball => ({
    ...ball,
    pricePerDozen: Number(ball.pricePerDozen),
  })) as Ball[];
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

  return balls.map(convertBall);
}
