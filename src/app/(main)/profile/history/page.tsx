"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRecommendationHistory } from "@/lib/query/hooks/use-recommendation-history";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowLeft, BarChart3 } from "lucide-react";

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

export default function RecommendationHistoryPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isPlaceholderData } = useRecommendationHistory(
    userId,
    page,
    limit
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommendation History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              All your past ball fitting results
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : !data || data.history.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No recommendations yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                  Take the quiz to get personalized golf ball recommendations
                  based on your game.
                </p>
                <Button asChild>
                  <Link href="/quiz">Take the Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {data.history.map((item) => (
                  <Card
                    key={item.id}
                    className={isPlaceholderData ? "opacity-60" : ""}
                  >
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
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="shrink-0"
                      >
                        <Link href={`/results/${item.sessionId}`}>
                          View
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1)
                      )
                    }
                    disabled={page >= data.pagination.totalPages}
                  >
                    Next
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
