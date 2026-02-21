import type { BallQueryFilters } from "@/types/api";

export const queryKeys = {
  user: {
    profile: (userId: string) => ["user", "profile", userId] as const,
    stats: (userId: string) => ["user", "stats", userId] as const,
    history: (userId: string, page: number) =>
      ["user", "history", userId, page] as const,
    favorites: (userId: string) => ["user", "favorites", userId] as const,
    triedBalls: (userId: string) => ["user", "tried-balls", userId] as const,
    profiles: (userId: string) => ["user", "profiles", userId] as const,
  },
  balls: {
    all: ["balls"] as const,
    list: (filters: BallQueryFilters) => ["balls", "list", filters] as const,
    compare: (ids: string[]) => ["balls", "compare", ids] as const,
    search: (query: string) => ["balls", "search", query] as const,
  },
} as const;
