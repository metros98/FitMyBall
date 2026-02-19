"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { FavoritesResponse, FavoriteBallItem } from "@/types/api";

async function fetchFavorites(userId: string): Promise<FavoritesResponse> {
  const res = await fetch(`/api/users/${userId}/favorites`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch favorites");
  }
  const json = await res.json();
  return json.data;
}

export function useUserFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.favorites(userId ?? ""),
    queryFn: () => fetchFavorites(userId!),
    enabled: !!userId,
  });
}

export function useAddFavorite(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ballId: string) => {
      const res = await fetch(`/api/users/${userId}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ballId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to add favorite");
      }
      const json = await res.json();
      return json.data as FavoriteBallItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.favorites(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.stats(userId),
      });
    },
  });
}

export function useRemoveFavorite(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ballId: string) => {
      const res = await fetch(`/api/users/${userId}/favorites/${ballId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to remove favorite");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.favorites(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.stats(userId),
      });
    },
  });
}
