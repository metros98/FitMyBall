"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import { useBallsCompare } from "@/lib/query/hooks/use-balls-compare";
import { BallSearchCombobox } from "@/components/compare/ball-search-combobox";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { SpinRadarChart } from "@/components/compare/spin-radar-chart";
import { GuidanceSection } from "@/components/compare/guidance-section";
import { CompareActions } from "@/components/compare/compare-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ComparePageProps {
  searchParams: Promise<{
    balls?: string;
  }>;
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  const params = use(searchParams);
  const router = useRouter();
  const { selectedBalls, clearAll } = useCompare();

  // Parse ball IDs from URL
  const urlIds = params.balls?.split(",").filter(Boolean) ?? [];

  // Sync URL to context on mount (if URL has balls but context doesn't)
  useEffect(() => {
    if (urlIds.length > 0 && selectedBalls.length === 0) {
      // URL has balls but context is empty - this will be handled by showing the fetched balls
      // The context will be populated when user interacts with the comparison
    }
  }, [urlIds.length, selectedBalls.length]);

  // Sync context to URL when context changes
  useEffect(() => {
    const contextIds = selectedBalls.map((b) => b.id).join(",");
    const currentUrlIds = urlIds.join(",");

    if (contextIds !== currentUrlIds) {
      if (contextIds) {
        router.replace(`/compare?balls=${contextIds}`, { scroll: false });
      } else if (urlIds.length > 0) {
        router.replace("/compare", { scroll: false });
      }
    }
  }, [selectedBalls, router, urlIds]);

  // Use URL IDs for data fetching (prefer URL as source of truth)
  const displayIds = urlIds.length > 0 ? urlIds : selectedBalls.map((b) => b.id);

  const { data, isLoading, error } = useBallsCompare(displayIds);

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compare Golf Balls</h1>
          <p className="mt-2 text-muted-foreground">
            Compare specifications, spin profiles, and performance
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load comparison data. Please try again.
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button onClick={() => router.push("/browse")}>Browse Balls</Button>
        </div>
      </div>
    );
  }

  // Empty State (< 2 balls)
  if (displayIds.length < 2 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Compare Golf Balls</h1>
          <p className="mt-2 text-muted-foreground">
            Compare specifications, spin profiles, and performance
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <div className="mb-6">
              <BallSearchCombobox />
            </div>

            <div className="rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
              <div className="mx-auto max-w-md space-y-3">
                <h3 className="text-lg font-semibold">Start Comparing</h3>
                <p className="text-sm text-muted-foreground">
                  Search and add at least 2 golf balls to compare their
                  specifications, spin profiles, and performance characteristics
                  side-by-side.
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  You can compare up to 4 balls at once.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => router.push("/browse")}>
                Browse All Balls
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const balls = data?.balls ?? [];

  // Loaded State (2-4 balls)
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Golf Balls</h1>
          <p className="mt-2 text-muted-foreground">
            Comparing {balls.length} {balls.length === 1 ? "ball" : "balls"}
          </p>
        </div>
        {balls.length >= 2 && <CompareActions />}
      </div>

      {/* Search */}
      <div className="mb-8">
        <BallSearchCombobox />
      </div>

      {balls.length < 2 && isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading comparison...
        </div>
      )}

      {balls.length >= 2 && (
        <div className="space-y-12">
          {/* Selected Ball Cards Summary */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Selected Balls</h2>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {balls.map((ball) => (
                <Card key={ball.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">{ball.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ball.manufacturer}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      ${ball.pricePerDozen}/doz • {ball.compression} compression
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Specifications Table */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Specifications</h2>
            <div className="rounded-lg border">
              <ComparisonTable balls={balls} />
            </div>
          </section>

          <Separator />

          {/* Spin Profile Chart */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Spin Profile</h2>
            <Card>
              <CardContent className="pt-6">
                <SpinRadarChart balls={balls} />
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Recommendations */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              Which Ball is Right for You?
            </h2>
            <GuidanceSection balls={balls} />
          </section>

          {/* Bottom Actions */}
          <div className="flex justify-center">
            <CompareActions />
          </div>
        </div>
      )}
    </div>
  );
}
