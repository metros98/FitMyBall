"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Heart, ClipboardCheck } from "lucide-react";
import type { UserStatsResponse } from "@/types/api";

interface DashboardStatsProps {
  stats: UserStatsResponse | undefined;
  isLoading: boolean;
}

const statItems = [
  {
    key: "totalRecommendations" as const,
    label: "Recommendations",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-950/50",
  },
  {
    key: "totalFavorites" as const,
    label: "Favorites",
    icon: Heart,
    color: "text-red-500 text-red-400",
    bg: "bg-red-950/50",
  },
  {
    key: "totalTriedBalls" as const,
    label: "Balls Tried",
    icon: ClipboardCheck,
    color: "text-green-400",
    bg: "bg-green-950/50",
  },
];

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card key={item.key}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              {isLoading ? (
                <div className="h-7 w-8 bg-surface-active rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-slate-100">
                  {stats?.[item.key] ?? 0}
                </p>
              )}
              <p className="text-sm text-slate-400">
                {item.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
