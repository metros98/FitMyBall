/**
 * PerformanceBreakdown - Visualizes category scores as horizontal bars
 */

import { cn } from "@/lib/utils";
import type { CategoryScores } from "@/types/recommendation";

interface PerformanceBreakdownProps {
  scores: CategoryScores;
  className?: string;
}

const categoryLabels: Record<keyof CategoryScores, string> = {
  swingSpeedMatch: "Swing Speed",
  performancePriorities: "Performance",
  preferences: "Preferences",
  playingConditions: "Conditions",
  currentBallAnalysis: "vs Current Ball",
};

export function PerformanceBreakdown({ scores, className }: PerformanceBreakdownProps) {
  const categories = Object.entries(categoryLabels) as Array<
    [keyof CategoryScores, string]
  >;

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Performance Breakdown
      </h3>

      <div className="space-y-2.5">
        {categories.map(([key, label]) => {
          const score = scores[key];
          const percentage = Math.round(score);

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white tabular-nums">
                  {percentage}%
                </span>
              </div>
              
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    percentage >= 90
                      ? "bg-green-600"
                      : percentage >= 80
                      ? "bg-teal-500"
                      : percentage >= 70
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
