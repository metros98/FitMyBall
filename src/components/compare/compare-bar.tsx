"use client";

import { useCompare } from "./compare-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { selectedBalls, removeBall, clearAll, count } = useCompare();
  const router = useRouter();

  // Don't render if no balls selected
  if (count === 0) {
    return null;
  }

  const handleCompare = () => {
    const ids = selectedBalls.map((ball) => ball.id).join(",");
    router.push(`/compare?balls=${ids}`);
  };

  return (
    <div
      className={cn(
        "compare-bar",
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "shadow-lg",
        "animate-in slide-in-from-bottom-2 duration-300"
      )}
      data-print-hide
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Ball chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Compare ({count}/{4}):
            </span>
            {selectedBalls.map((ball) => (
              <Badge
                key={ball.id}
                variant="secondary"
                className="gap-1.5 pl-3 pr-2"
              >
                <span className="max-w-[120px] truncate sm:max-w-[200px]">
                  {ball.name}
                </span>
                <button
                  onClick={() => removeBall(ball.id)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={`Remove ${ball.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="h-9"
            >
              Clear
            </Button>
            <Button
              onClick={handleCompare}
              disabled={count < 2}
              size="sm"
              className="h-9"
            >
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
