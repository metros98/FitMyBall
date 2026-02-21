"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { BallSearchResponse } from "@/types/api";

async function searchBalls(
  query: string,
  limit?: number
): Promise<BallSearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (limit != null) {
    params.set("limit", String(limit));
  }

  const res = await fetch(`/api/balls/search?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to search balls");
  }
  const json = await res.json();
  return json.data;
}

/**
 * Hook to search balls by name or manufacturer
 * @param query - Search query (minimum 2 characters)
 * @param limit - Maximum number of results (1-20, default 8)
 * @returns Query result with search results
 */
export function useBallSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.balls.search(query),
    queryFn: () => searchBalls(query, limit),
    enabled: query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}
