"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useUserFavorites,
  useRemoveFavorite,
} from "@/lib/query/hooks/use-user-favorites";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, X } from "lucide-react";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useUserFavorites(userId);
  const removeFavorite = useRemoveFavorite(userId ?? "");

  async function handleRemove(ballId: string) {
    try {
      await removeFavorite.mutateAsync(ballId);
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove favorite"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Balls you&apos;ve saved for later
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : !data || data.favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No favorites yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                  Save balls you&apos;re interested in from your quiz results to
                  easily find them later.
                </p>
                <Button asChild>
                  <Link href="/quiz">Take the Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.favorites.map((fav) => (
                <Card key={fav.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleRemove(fav.ballId)}
                    disabled={removeFavorite.isPending}
                    aria-label="Remove from favorites"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {fav.ball.imageUrl ? (
                        <div className="w-16 h-16 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={fav.ball.imageUrl}
                            alt={fav.ball.name}
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                          <span className="text-2xl">⛳</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {fav.ball.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {fav.ball.manufacturer}
                        </p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                          ${fav.ball.pricePerDozen}/dz
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Compression: {fav.ball.compression}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
