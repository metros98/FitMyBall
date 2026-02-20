"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/common/favorite-button";
import type { Ball } from "@/types/ball";

interface BrowseBallCardProps {
  ball: Ball;
}

export function BrowseBallCard({ ball }: BrowseBallCardProps) {
  return (
    <Card className="group transition-all hover:shadow-lg">
      <Link href={`/balls/${ball.slug}`} className="block">
        <div className="p-4 space-y-4">
          {/* Top row: badges + favorite */}
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-1.5">
              {ball.discontinued && (
                <Badge
                  variant="outline"
                  className="text-xs border-amber-500 text-amber-500"
                >
                  Discontinued
                </Badge>
              )}
              {!ball.inStock && !ball.discontinued && (
                <Badge variant="outline" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <FavoriteButton ballId={ball.id} />
            </div>
          </div>

          {/* Ball image */}
          <div className="aspect-square relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            {ball.imageUrl ? (
              <Image
                src={ball.imageUrl}
                alt={ball.name}
                fill
                className="object-contain p-6 transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                /doz
              </span>
            </p>

            {/* Spec badges */}
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
          </div>
        </div>
      </Link>
    </Card>
  );
}
