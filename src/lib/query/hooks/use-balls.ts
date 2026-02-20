"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { BallQueryFilters, BallListResponse } from "@/types/api";

async function fetchBalls(filters: BallQueryFilters): Promise<BallListResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.compression != null) params.set("compression", String(filters.compression));
  if (filters.construction) params.set("construction", filters.construction);
  if (filters.color) params.set("color", filters.color);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.page != null) params.set("page", String(filters.page));
  if (filters.limit != null) params.set("limit", String(filters.limit));

  const res = await fetch(`/api/balls?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch balls");
  }
  const json = await res.json();
  return json.data;
}

export function useBalls(filters: BallQueryFilters = {}) {
  return useQuery({
    queryKey: queryKeys.balls.list(filters),
    queryFn: () => fetchBalls(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
