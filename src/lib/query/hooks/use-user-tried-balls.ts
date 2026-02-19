"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { TriedBallsResponse } from "@/types/api";
import type { AddTriedBallInput, UpdateTriedBallInput } from "@/lib/validations/user";

async function fetchTriedBalls(userId: string): Promise<TriedBallsResponse> {
  const res = await fetch(`/api/users/${userId}/tried-balls`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch tried balls");
  }
  const json = await res.json();
  return json.data;
}

export function useUserTriedBalls(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.triedBalls(userId ?? ""),
    queryFn: () => fetchTriedBalls(userId!),
    enabled: !!userId,
  });
}

export function useAddTriedBall(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddTriedBallInput) => {
      const res = await fetch(`/api/users/${userId}/tried-balls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to add tried ball");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.triedBalls(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.stats(userId),
      });
    },
  });
}

export function useUpdateTriedBall(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ballId,
      data,
    }: {
      ballId: string;
      data: UpdateTriedBallInput;
    }) => {
      const res = await fetch(`/api/users/${userId}/tried-balls/${ballId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update tried ball");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.triedBalls(userId),
      });
    },
  });
}

export function useRemoveTriedBall(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ballId: string) => {
      const res = await fetch(`/api/users/${userId}/tried-balls/${ballId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to remove tried ball");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.triedBalls(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.stats(userId),
      });
    },
  });
}
