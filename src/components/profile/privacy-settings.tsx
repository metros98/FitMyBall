"use client";

import { toast } from "sonner";
import { useUserProfile, useUpdatePrivacy } from "@/lib/query/hooks/use-user-profile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface PrivacySettingsProps {
  userId: string;
}

export function PrivacySettings({ userId }: PrivacySettingsProps) {
  const { data: profile, isLoading } = useUserProfile(userId);
  const updatePrivacy = useUpdatePrivacy(userId);

  async function handleToggle(
    field: "optInMarketing" | "optInAnalytics",
    value: boolean
  ) {
    try {
      await updatePrivacy.mutateAsync({ [field]: value });
      toast.success("Privacy settings updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update privacy settings"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="marketing" className="text-sm font-medium">
            Marketing Emails
          </Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Receive emails about new ball releases, price drops on favorites,
            and seasonal tips.
          </p>
        </div>
        <Switch
          id="marketing"
          checked={profile?.optInMarketing ?? false}
          onCheckedChange={(checked) =>
            handleToggle("optInMarketing", checked)
          }
          disabled={updatePrivacy.isPending}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="analytics" className="text-sm font-medium">
            Analytics
          </Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Allow anonymous usage analytics to help us improve the app. No
            personal data is shared.
          </p>
        </div>
        <Switch
          id="analytics"
          checked={profile?.optInAnalytics ?? true}
          onCheckedChange={(checked) =>
            handleToggle("optInAnalytics", checked)
          }
          disabled={updatePrivacy.isPending}
        />
      </div>
    </div>
  );
}
