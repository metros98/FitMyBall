import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header skeleton */}
      <section className="bg-surface-card border-b border-[#1E293B]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-9 w-64 bg-surface-active" />
                <Skeleton className="h-5 w-80 bg-surface-active" />
              </div>
              <Skeleton className="h-6 w-32 rounded-full bg-surface-active" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-9 w-28 bg-surface-active" />
              <Skeleton className="h-9 w-28 bg-surface-active" />
              <Skeleton className="h-9 w-24 bg-surface-active" />
              <Skeleton className="h-9 w-28 bg-surface-active" />
            </div>
          </div>
        </div>
      </section>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero card skeleton */}
          <section className="bg-surface-card border border-accent-cyan-dim/30 rounded-xl p-6">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24 bg-white/10" />
                  <Skeleton className="h-7 w-72 bg-white/10" />
                </div>
                <Skeleton className="h-32 w-32 rounded-full bg-white/10" />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Skeleton className="h-32 w-32 rounded-lg bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-48 bg-white/10" />
                  <Skeleton className="h-5 w-32 bg-white/10" />
                  <Skeleton className="h-6 w-24 bg-white/10" />
                </div>
              </div>

              {/* Explanation skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-5/6 bg-white/10" />
              </div>

              {/* Performance bars skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-3 flex-1 bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Secondary recommendations skeleton */}
          <section className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-surface-active" />
              <Skeleton className="h-5 w-64 bg-surface-active" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-card border border-[#1E293B] bg-surface-card p-4 space-y-4">
                  <Skeleton className="aspect-square w-full rounded-lg bg-surface-active" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-surface-active" />
                    <Skeleton className="h-4 w-1/2 bg-surface-active" />
                    <Skeleton className="h-5 w-16 bg-surface-active" />
                  </div>
                  <Skeleton className="h-9 w-full bg-surface-active" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
