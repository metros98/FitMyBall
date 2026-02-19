"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useUserTriedBalls,
  useUpdateTriedBall,
  useRemoveTriedBall,
} from "@/lib/query/hooks/use-user-tried-balls";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck } from "lucide-react";
import { TriedBallCard } from "@/components/profile/tried-ball-card";
import { AddTriedBallDialog } from "@/components/profile/add-tried-ball-dialog";
import type { TriedBallItem } from "@/types/api";
import type { UpdateTriedBallInput } from "@/lib/validations/user";

export default function TriedBallsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = useUserTriedBalls(userId);
  const updateTriedBall = useUpdateTriedBall(userId ?? "");
  const removeTriedBall = useRemoveTriedBall(userId ?? "");

  const [editItem, setEditItem] = useState<TriedBallItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleEdit(item: TriedBallItem) {
    setEditItem(item);
    setDialogOpen(true);
  }

  async function handleRemove(ballId: string) {
    try {
      await removeTriedBall.mutateAsync(ballId);
      toast.success("Ball removed from your list");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove ball"
      );
    }
  }

  async function handleSubmit(data: UpdateTriedBallInput) {
    if (!editItem) return;
    try {
      await updateTriedBall.mutateAsync({
        ballId: editItem.ballId,
        data,
      });
      toast.success("Review updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Balls I&apos;ve Tried
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your experience with different golf balls
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : !data || data.triedBalls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <ClipboardCheck className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No balls reviewed yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                  Track your experience with golf balls to remember what works
                  for your game.
                </p>
                <Button asChild>
                  <Link href="/quiz">Find Balls to Try</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.triedBalls.map((item) => (
                <TriedBallCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                  isRemoving={removeTriedBall.isPending}
                />
              ))}
            </div>
          )}

          <AddTriedBallDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            editItem={editItem}
            onSubmit={handleSubmit}
            isPending={updateTriedBall.isPending}
          />
        </div>
      </div>
    </div>
  );
}
