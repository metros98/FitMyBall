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
} as const;
