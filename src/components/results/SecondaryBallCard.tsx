/**
 * SecondaryBallCard - Compact card for recommendations 2-5
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchPercentage } from "./MatchPercentage";
import type { Recommendation } from "@/types/recommendation";
import type { Ball } from "@/types/ball";
import Image from "next/image";

interface SecondaryBallCardProps {
  recommendation: Recommendation;
  ball: Ball;
  rank: number;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function SecondaryBallCard({
  recommendation,
  ball,
  rank,
  onSelect,
  isSelected,
}: SecondaryBallCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-green-600" : ""
      }`}
      onClick={onSelect}
    >
      <div className="p-4 space-y-4">
        {/* Rank badge */}
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="font-mono text-xs">
            #{rank}
          </Badge>
          <MatchPercentage
            percentage={recommendation.matchPercentage}
            tier={recommendation.matchTier}
            size="sm"
          />
        </div>

        {/* Ball image */}
        <div className="aspect-square relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
          {ball.imageUrl ? (
            <Image
              src={ball.imageUrl}
              alt={ball.name}
              fill
              className="object-contain p-6"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        {/* Ball info */}
        <div className="space-y-2">
          <div>
            <h3 className="font-bold text-base line-clamp-1">{ball.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {ball.manufacturer}
            </p>
          </div>

          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${ball.pricePerDozen.toFixed(2)}
          </p>

          {/* Key features */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {ball.compression} comp
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {ball.layers}-pc
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {ball.coverMaterial}
            </Badge>
          </div>

          {/* Top reason */}
          {recommendation.explanation.whyThisMatches[0] && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {recommendation.explanation.whyThisMatches[0]}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
