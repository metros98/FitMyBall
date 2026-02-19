"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { Pencil, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import type { TriedBallItem } from "@/types/api";

interface TriedBallCardProps {
  item: TriedBallItem;
  onEdit: (item: TriedBallItem) => void;
  onRemove: (ballId: string) => void;
  isRemoving: boolean;
}

const comparisonLabels: Record<string, Record<string, string>> = {
  distance: { BETTER: "Better", AS_EXPECTED: "As Expected", WORSE: "Worse" },
  spin: { MORE: "More", AS_EXPECTED: "As Expected", LESS: "Less" },
  feel: { SOFTER: "Softer", AS_EXPECTED: "As Expected", FIRMER: "Firmer" },
};

export function TriedBallCard({
  item,
  onEdit,
  onRemove,
  isRemoving,
}: TriedBallCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {item.ball.imageUrl ? (
            <div className="w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={item.ball.imageUrl}
                alt={item.ball.name}
                className="w-12 h-12 object-contain"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <span className="text-xl">⛳</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.ball.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.ball.manufacturer}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(item)}
                  aria-label="Edit review"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onRemove(item.ballId)}
                  disabled={isRemoving}
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <StarRating value={item.rating} readonly size="sm" />
              {item.roundsPlayed != null && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.roundsPlayed} round{item.roundsPlayed !== 1 ? "s" : ""}
                </span>
              )}
              {item.wouldRecommend != null && (
                <Badge
                  variant="secondary"
                  className={
                    item.wouldRecommend
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {item.wouldRecommend ? (
                    <ThumbsUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ThumbsDown className="h-3 w-3 mr-1" />
                  )}
                  {item.wouldRecommend ? "Recommend" : "Don't Recommend"}
                </Badge>
              )}
            </div>

            {/* Performance comparisons */}
            {(item.distanceVsExpected ||
              item.spinVsExpected ||
              item.feelVsExpected) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.distanceVsExpected && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Distance: {comparisonLabels.distance[item.distanceVsExpected]}
                  </span>
                )}
                {item.spinVsExpected && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Spin: {comparisonLabels.spin[item.spinVsExpected]}
                  </span>
                )}
                {item.feelVsExpected && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Feel: {comparisonLabels.feel[item.feelVsExpected]}
                  </span>
                )}
              </div>
            )}

            {item.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
