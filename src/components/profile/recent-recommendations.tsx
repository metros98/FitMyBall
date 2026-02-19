"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BarChart3 } from "lucide-react";
import type { RecommendationHistoryItem } from "@/types/api";

interface RecentRecommendationsProps {
  history: RecommendationHistoryItem[] | undefined;
  isLoading: boolean;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

function getMatchColor(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 60) return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
}

export function RecentRecommendations({
  history,
  isLoading,
}: RecentRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <BarChart3 className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No recommendations yet. Take the quiz to find your perfect golf ball.
          </p>
          <Button asChild>
            <Link href="/quiz">Take the Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(item.createdAt)}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.topBallName}
              </span>
              <Badge
                variant="secondary"
                className={getMatchColor(item.topBallMatchScore)}
              >
                {item.topBallMatchScore}% match
              </Badge>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href={`/results/${item.sessionId}`}>
                View
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="text-center pt-2">
        <Button variant="link" asChild>
          <Link href="/profile/history">View All Recommendations</Link>
        </Button>
      </div>
    </div>
  );
}
