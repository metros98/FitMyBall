"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { RecommendationHistoryResponse } from "@/types/api";

async function fetchHistory(
  userId: string,
  page: number,
  limit: number
): Promise<RecommendationHistoryResponse> {
  const res = await fetch(
    `/api/users/${userId}/history?page=${page}&limit=${limit}`
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch history");
  }
  const json = await res.json();
  return json.data;
}

export function useRecommendationHistory(
  userId: string | undefined,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: queryKeys.user.history(userId ?? "", page),
    queryFn: () => fetchHistory(userId!, page, limit),
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  });
}
