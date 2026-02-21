"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { BallCompareResponse } from "@/types/api";

async function fetchBallsCompare(ids: string[]): Promise<BallCompareResponse> {
  const params = new URLSearchParams({
    ids: ids.join(","),
  });

  const res = await fetch(`/api/balls/compare?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch balls for comparison");
  }
  const json = await res.json();
  return json.data;
}

/**
 * Hook to compare multiple balls by IDs
 * @param ids - Array of ball IDs (minimum 2, maximum 4)
 * @returns Query result with ball comparison data
 */
export function useBallsCompare(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.balls.compare(ids),
    queryFn: () => fetchBallsCompare(ids),
    enabled: ids.length >= 2 && ids.length <= 4,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
