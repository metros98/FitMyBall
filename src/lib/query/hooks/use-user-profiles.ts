"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { UserProfilesResponse } from "@/types/api";
import type { UserProfileInput } from "@/lib/validations/user";

async function fetchProfiles(userId: string): Promise<UserProfilesResponse> {
  const res = await fetch(`/api/users/${userId}/profiles`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch profiles");
  }
  const json = await res.json();
  return json.data;
}

export function useUserProfiles(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.profiles(userId ?? ""),
    queryFn: () => fetchProfiles(userId!),
    enabled: !!userId,
  });
}

export function useCreateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserProfileInput) => {
      const res = await fetch(`/api/users/${userId}/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create profile");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profiles(userId),
      });
    },
  });
}

export function useUpdateUserProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      data,
    }: {
      profileId: string;
      data: UserProfileInput;
    }) => {
      const res = await fetch(
        `/api/users/${userId}/profiles/${profileId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update profile");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profiles(userId),
      });
    },
  });
}

export function useDeleteProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const res = await fetch(
        `/api/users/${userId}/profiles/${profileId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete profile");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profiles(userId),
      });
    },
  });
}
