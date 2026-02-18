"use client";

/**
 * MatchPercentage - Circular progress indicator for match score
 * Apple Watch activity ring style with tier-based coloring
 * Animates count-up from 0 on mount (600ms, ease-out-cubic)
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { MatchTier } from "@/types/recommendation";

interface MatchPercentageProps {
  percentage: number;
  tier: MatchTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

// Match tier color mapping
const tierColors: Record<MatchTier, { ring: string; text: string; bg: string }> = {
  strong: {
    ring: "stroke-green-600",
    text: "text-green-600",
    bg: "bg-green-600/10",
  },
  good: {
    ring: "stroke-teal-500",
    text: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  moderate: {
    ring: "stroke-yellow-500",
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
};

const sizeClasses = {
  sm: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
  md: { container: "w-24 h-24", text: "text-2xl", label: "text-sm" },
  lg: { container: "w-32 h-32", text: "text-4xl", label: "text-base" },
};

// Ease-out cubic: decelerates toward the end
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function MatchPercentage({
  percentage,
  tier,
  size = "md",
  showLabel = false,
  className,
}: MatchPercentageProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 600;
    let startTime: number | null = null;
    let frameId: number;

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayValue(Math.round(easedProgress * percentage));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [percentage]);

  const colors = tierColors[tier];
  const sizes = sizeClasses[size];

  // Circle SVG properties
  const circleSize = size === "sm" ? 64 : size === "md" ? 96 : 128;
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn("flex flex-col items-center gap-2", className)}
      aria-label={`${Math.round(percentage)}% match score`}
    >
      <div className={cn("relative", sizes.container)}>
        {/* Background circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={circleSize}
          height={circleSize}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
        </svg>

        {/* Progress circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={circleSize}
          height={circleSize}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(colors.ring, "transition-all duration-700 ease-out")}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", colors.text, sizes.text)}>
            {displayValue}%
          </span>
        </div>
      </div>

      {showLabel && (
        <span className={cn("font-medium text-gray-600 dark:text-gray-400", sizes.label)}>
          Match Score
        </span>
      )}
    </div>
  );
}
