"use client";

/**
 * ResultsStagger - Wraps sections with stagger entry animation.
 *
 * Uses tailwindcss-animate classes (same system as quiz wizard transitions)
 * with inline styles for dynamic delay/duration per section.
 *
 * Spec timing:
 *   index 0 (hero):      0ms delay, 200ms duration
 *   index 1+ (secondary): 350ms + (index-1)*50ms delay, 300ms duration
 */

import { cn } from "@/lib/utils";

interface ResultsStaggerProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export function ResultsStagger({
  index,
  children,
  className,
}: ResultsStaggerProps) {
  const delay = index === 0 ? 0 : 350 + (index - 1) * 50;
  const duration = index === 0 ? 200 : 300;

  return (
    <div
      className={cn("animate-in fade-in slide-in-from-bottom-4", className)}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}
