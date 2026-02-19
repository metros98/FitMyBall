// Favorites database queries
import { prisma } from "@/lib/db";

const favoriteBallSelect = {
  id: true,
  ballId: true,
  createdAt: true,
  ball: {
    select: {
      id: true,
      name: true,
      manufacturer: true,
      pricePerDozen: true,
      imageUrl: true,
      compression: true,
      slug: true,
    },
  },
} as const;

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string) {
  const favorites = await prisma.userFavoriteBall.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: favoriteBallSelect,
  });

  return {
    favorites: favorites.map((f) => ({
      id: f.id,
      ballId: f.ballId,
      ball: {
        ...f.ball,
        pricePerDozen: Number(f.ball.pricePerDozen),
      },
      createdAt: f.createdAt.toISOString(),
    })),
    total: favorites.length,
  };
}

/**
 * Add a ball to favorites
 */
export async function addFavorite(userId: string, ballId: string) {
  const favorite = await prisma.userFavoriteBall.create({
    data: { userId, ballId },
    select: favoriteBallSelect,
  });

  return {
    id: favorite.id,
    ballId: favorite.ballId,
    ball: {
      ...favorite.ball,
      pricePerDozen: Number(favorite.ball.pricePerDozen),
    },
    createdAt: favorite.createdAt.toISOString(),
  };
}

/**
 * Remove a ball from favorites
 */
export async function removeFavorite(userId: string, ballId: string) {
  await prisma.userFavoriteBall.delete({
    where: {
      userId_ballId: { userId, ballId },
    },
  });
}

/**
 * Get all favorite ball IDs for a user (for batch UI checks)
 */
export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  const favorites = await prisma.userFavoriteBall.findMany({
    where: { userId },
    select: { ballId: true },
  });
  return favorites.map((f) => f.ballId);
}
