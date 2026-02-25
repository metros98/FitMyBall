"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useUserProfiles,
  useCreateProfile,
  useUpdateUserProfile,
  useDeleteProfile,
} from "@/lib/query/hooks/use-user-profiles";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileFormDialog } from "./profile-form-dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { UserProfileItem } from "@/types/api";
import type { UserProfileInput } from "@/lib/validations/user";

export function ProfilesSection() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useUserProfiles(userId);
  const createProfile = useCreateProfile(userId ?? "");
  const updateProfile = useUpdateUserProfile(userId ?? "");
  const deleteProfile = useDeleteProfile(userId ?? "");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfileItem | null>(null);

  function handleCreate() {
    setEditProfile(null);
    setDialogOpen(true);
  }

  function handleEdit(profile: UserProfileItem) {
    setEditProfile(profile);
    setDialogOpen(true);
  }

  async function handleDelete(profileId: string) {
    try {
      await deleteProfile.mutateAsync(profileId);
      toast.success("Profile deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete profile"
      );
    }
  }

  async function handleSubmit(data: UserProfileInput) {
    try {
      if (editProfile) {
        await updateProfile.mutateAsync({
          profileId: editProfile.id,
          data,
        });
        toast.success("Profile updated");
      } else {
        await createProfile.mutateAsync(data);
        toast.success("Profile created");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save profile"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.profiles.map((profile) => (
        <Card key={profile.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-100">
                  {profile.profileName}
                </p>
                {profile.isDefault && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                {profile.driverBallSpeed && (
                  <span>Ball speed: {profile.driverBallSpeed} mph</span>
                )}
                {profile.typicalTemp && (
                  <span>Temp: {profile.typicalTemp}</span>
                )}
                {profile.budgetRange && (
                  <span>Budget: {profile.budgetRange}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(profile)}
                aria-label="Edit profile"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDelete(profile.id)}
                disabled={deleteProfile.isPending}
                aria-label="Delete profile"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {(!data || data.profiles.length === 0) && (
        <p className="text-sm text-slate-400">
          No profiles yet. Create one to save your quiz preferences.
        </p>
      )}

      <Button variant="outline" onClick={handleCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Profile
      </Button>

      <ProfileFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editProfile={editProfile}
        onSubmit={handleSubmit}
        isPending={createProfile.isPending || updateProfile.isPending}
      />
    </div>
  );
}
