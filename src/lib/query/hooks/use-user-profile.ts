"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { UserProfileResponse, UpdateProfileRequest } from "@/types/api";

async function fetchProfile(userId: string): Promise<UserProfileResponse> {
  const res = await fetch(`/api/users/${userId}/profile`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to fetch profile");
  }
  const json = await res.json();
  return json.data;
}

async function putProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserProfileResponse> {
  const res = await fetch(`/api/users/${userId}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update profile");
  }
  const json = await res.json();
  return json.data;
}

async function putPrivacy(
  userId: string,
  data: { optInMarketing?: boolean; optInAnalytics?: boolean }
) {
  const res = await fetch(`/api/users/${userId}/privacy`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update privacy settings");
  }
  const json = await res.json();
  return json.data;
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user.profile(userId ?? ""),
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => putProfile(userId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.user.profile(userId), updated);
    },
  });
}

export function useUpdatePrivacy(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { optInMarketing?: boolean; optInAnalytics?: boolean }) =>
      putPrivacy(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(userId),
      });
    },
  });
}
