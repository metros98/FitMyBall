"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  useUserFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/lib/query/hooks/use-user-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  ballId: string;
  className?: string;
}

export function FavoriteButton({ ballId, className }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: favorites } = useUserFavorites(userId);
  const addFavorite = useAddFavorite(userId ?? "");
  const removeFavorite = useRemoveFavorite(userId ?? "");

  if (!userId) return null;

  const isFavorited = favorites?.favorites.some((f) => f.ballId === ballId) ?? false;
  const isPending = addFavorite.isPending || removeFavorite.isPending;

  async function handleToggle() {
    try {
      if (isFavorited) {
        await removeFavorite.mutateAsync(ballId);
        toast.success("Removed from favorites");
      } else {
        await addFavorite.mutateAsync(ballId);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update favorites"
      );
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        )}
      />
    </Button>
  );
}
