import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CompareLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Search Box Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-full max-w-2xl" />
      </div>

      <div className="space-y-12">
        {/* Selected Balls Skeleton */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-3" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Table Skeleton */}
        <section>
          <Skeleton className="mb-4 h-7 w-36" />
          <div className="rounded-lg border p-4">
            <div className="space-y-3">
              {/* Header row */}
              <div className="flex gap-4">
                <Skeleton className="h-20 w-32" />
                <Skeleton className="h-20 flex-1" />
                <Skeleton className="h-20 flex-1" />
                <Skeleton className="h-20 flex-1" />
                <Skeleton className="h-20 flex-1" />
              </div>
              {/* Data rows */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Chart Skeleton */}
        <section>
          <Skeleton className="mb-4 h-7 w-28" />
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <Skeleton className="h-[400px] w-[400px] rounded-full" />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Guidance Cards Skeleton */}
        <section>
          <Skeleton className="mb-4 h-7 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom Actions Skeleton */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
