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
      <h3 className="text-sm font-semibold text-slate-100">
        Performance Breakdown
      </h3>

      <div className="space-y-2.5">
        {categories.map(([key, label]) => {
          const score = scores[key];
          const percentage = Math.round(score);

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="font-medium text-slate-100 tabular-nums">
                  {percentage}%
                </span>
              </div>
              
              <div className="h-2 bg-surface-active rounded-full overflow-hidden">
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
