"use client";

import { useSession } from "next-auth/react";
import { useUserProfile } from "@/lib/query/hooks/use-user-profile";
import { useUserStats } from "@/lib/query/hooks/use-user-stats";
import { useRecommendationHistory } from "@/lib/query/hooks/use-recommendation-history";
import { DashboardStats } from "@/components/profile/dashboard-stats";
import { QuickActions } from "@/components/profile/quick-actions";
import { RecentRecommendations } from "@/components/profile/recent-recommendations";
import { ProfilesSection } from "@/components/profile/profiles-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileDashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: stats, isLoading: statsLoading } = useUserStats(userId);
  const { data: historyData, isLoading: historyLoading } =
    useRecommendationHistory(userId, 1, 5);

  const greeting = profile?.name
    ? `Welcome back, ${profile.name}!`
    : "Welcome back!";

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome */}
          <div>
            {profileLoading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                {greeting}
              </h1>
            )}
            <p className="text-slate-400 mt-1">
              Your golf ball fitting dashboard
            </p>
          </div>

          {/* Stats */}
          <DashboardStats stats={stats} isLoading={statsLoading} />

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Quick Actions
            </h2>
            <QuickActions />
          </section>

          {/* Recent Recommendations */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Recent Recommendations
            </h2>
            <RecentRecommendations
              history={historyData?.history}
              isLoading={historyLoading}
            />
          </section>

          {/* My Profiles */}
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              My Profiles
            </h2>
            <ProfilesSection />
          </section>
        </div>
      </div>
    </div>
  );
}
