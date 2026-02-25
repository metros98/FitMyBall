"use client";

import { useSession } from "next-auth/react";
import { useUserProfile } from "@/lib/query/hooks/use-user-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { PrivacySettings } from "@/components/profile/privacy-settings";
import { DeleteAccountDialog } from "@/components/profile/delete-account-dialog";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: profile } = useUserProfile(userId);

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Settings
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your account and preferences
            </p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm userId={userId} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.hasPassword === false ? (
                    <p className="text-sm text-slate-400">
                      Your account uses social login. Password management is not
                      available.
                    </p>
                  ) : (
                    <ChangePasswordForm userId={userId} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy &amp; Communications</CardTitle>
                  <CardDescription>
                    Control your email preferences and data usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrivacySettings userId={userId} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        Delete Account
                      </p>
                      <p className="text-sm text-slate-400">
                        Permanently remove your account and all associated data
                      </p>
                    </div>
                    <DeleteAccountDialog userId={userId} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
