"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { UserStatsResponse } from "@/types/api";

async function fetchStats(userId: string): Promise<UserStatsResponse> {
  const res = await fetch(`/api/users/${userId}/stats`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch stats");
  }
  const json = await res.json();
  return json.data;
}

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.stats(userId ?? ""),
    queryFn: () => fetchStats(userId!),
    enabled: !!userId,
  });
}
