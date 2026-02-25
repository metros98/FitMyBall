"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBalls } from "@/lib/query/hooks/use-balls";
import {
  parseFiltersFromSearchParams,
  PRICE_RANGE,
  COMPRESSION_RANGE,
  SORT_OPTIONS,
} from "@/lib/utils/browse-filters";
import type { BallQueryFilters } from "@/types/api";

import { SearchBar } from "@/components/browse/search-bar";
import { SortSelect } from "@/components/browse/sort-select";
import { BrandFilter } from "@/components/browse/brand-filter";
import { ConstructionFilter } from "@/components/browse/construction-filter";
import { ColorFilter } from "@/components/browse/color-filter";
import { RangeFilter } from "@/components/browse/range-filter";
import { ActiveFilters } from "@/components/browse/active-filters";
import { MobileFilterSheet } from "@/components/browse/mobile-filter-sheet";
import { BrowseBallCard } from "@/components/browse/browse-ball-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";

const ITEMS_PER_PAGE = 20;

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive filters from URL search params
  const urlFilters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  // Local multi-select state for filter types
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    urlFilters.manufacturer
      ? Array.isArray(urlFilters.manufacturer)
        ? urlFilters.manufacturer
        : [urlFilters.manufacturer]
      : []
  );
  const [selectedConstructions, setSelectedConstructions] = useState<string[]>(
    urlFilters.construction
      ? Array.isArray(urlFilters.construction)
        ? urlFilters.construction
        : [urlFilters.construction]
      : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    urlFilters.color
      ? Array.isArray(urlFilters.color)
        ? urlFilters.color
        : [urlFilters.color]
      : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlFilters.minPrice ?? PRICE_RANGE.min,
    urlFilters.maxPrice ?? PRICE_RANGE.max,
  ]);
  const [compressionRange, setCompressionRange] = useState<[number, number]>([
    urlFilters.compression
      ? Math.max(COMPRESSION_RANGE.min, urlFilters.compression - 5)
      : COMPRESSION_RANGE.min,
    urlFilters.compression
      ? Math.min(COMPRESSION_RANGE.max, urlFilters.compression + 5)
      : COMPRESSION_RANGE.max,
  ]);

  // Build query filters from local state + URL params
  const filters: BallQueryFilters = useMemo(() => {
    const f: BallQueryFilters = {
      page: urlFilters.page ?? 1,
      limit: ITEMS_PER_PAGE,
      sortBy: urlFilters.sortBy ?? "name",
      sortOrder: urlFilters.sortOrder ?? "asc",
    };

    if (urlFilters.q) f.q = urlFilters.q;
    if (selectedBrands.length > 0) {
      f.manufacturer = selectedBrands.length === 1 ? selectedBrands[0] : selectedBrands;
    }
    if (selectedConstructions.length > 0) {
      f.construction = selectedConstructions.length === 1 ? selectedConstructions[0] : selectedConstructions;
    }
    if (selectedColors.length > 0) {
      f.color = selectedColors.length === 1 ? selectedColors[0] : selectedColors;
    }
    if (priceRange[0] !== PRICE_RANGE.min) f.minPrice = priceRange[0];
    if (priceRange[1] !== PRICE_RANGE.max) f.maxPrice = priceRange[1];
    if (
      compressionRange[0] !== COMPRESSION_RANGE.min ||
      compressionRange[1] !== COMPRESSION_RANGE.max
    ) {
      // Use midpoint for the API's single compression value
      f.compression = Math.round(
        (compressionRange[0] + compressionRange[1]) / 2
      );
    }

    return f;
  }, [
    urlFilters,
    selectedBrands,
    selectedConstructions,
    selectedColors,
    priceRange,
    compressionRange,
  ]);

  const { data, isLoading, isPlaceholderData } = useBalls(filters);
  const page = filters.page ?? 1;

  // Sync URL with filter changes
  const updateUrl = useCallback(
    (updates: Partial<BallQueryFilters> & { page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // Reset to page 1 when filters change (unless explicitly setting page)
      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`/browse?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handlers
  function handleSearch(q: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filters.sortBy && filters.sortBy !== "name")
      params.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "asc")
      params.set("sortOrder", filters.sortOrder);
    router.push(`/browse?${params.toString()}`, { scroll: false });
    setSelectedBrands([]);
    setSelectedConstructions([]);
    setSelectedColors([]);
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    setCompressionRange([COMPRESSION_RANGE.min, COMPRESSION_RANGE.max]);
  }

  function handleSortChange(sortBy: string, sortOrder: string) {
    updateUrl({ sortBy: sortBy as BallQueryFilters["sortBy"], sortOrder: sortOrder as BallQueryFilters["sortOrder"] });
  }

  function handlePageChange(newPage: number) {
    updateUrl({ page: newPage > 1 ? newPage : undefined });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleResetAll() {
    setSelectedBrands([]);
    setSelectedConstructions([]);
    setSelectedColors([]);
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    setCompressionRange([COMPRESSION_RANGE.min, COMPRESSION_RANGE.max]);
    router.push("/browse", { scroll: false });
  }

  function handleMobileApply(mobileFilters: {
    brands: string[];
    constructions: string[];
    colors: string[];
    priceRange: [number, number];
    compressionRange: [number, number];
  }) {
    setSelectedBrands(mobileFilters.brands);
    setSelectedConstructions(mobileFilters.constructions);
    setSelectedColors(mobileFilters.colors);
    setPriceRange(mobileFilters.priceRange);
    setCompressionRange(mobileFilters.compressionRange);
  }

  function handleRemoveFilter(key: string, value: string) {
    switch (key) {
      case "q":
        updateUrl({ q: undefined });
        break;
      case "manufacturer":
        setSelectedBrands((prev) => prev.filter((b) => b !== value));
        break;
      case "construction":
        setSelectedConstructions((prev) => prev.filter((c) => c !== value));
        break;
      case "color":
        setSelectedColors((prev) => prev.filter((c) => c !== value));
        break;
      case "price":
        setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
        break;
      case "compression":
        setCompressionRange([COMPRESSION_RANGE.min, COMPRESSION_RANGE.max]);
        break;
    }
  }

  // Build active filter pills
  const activeFilterPills = useMemo(() => {
    const pills: { key: string; label: string; value: string }[] = [];

    if (urlFilters.q) {
      pills.push({ key: "q", label: "Search", value: urlFilters.q });
    }
    for (const brand of selectedBrands) {
      pills.push({ key: "manufacturer", label: "Brand", value: brand });
    }
    for (const construction of selectedConstructions) {
      pills.push({
        key: "construction",
        label: "Construction",
        value: construction,
      });
    }
    for (const color of selectedColors) {
      pills.push({ key: "color", label: "Color", value: color });
    }
    if (
      priceRange[0] !== PRICE_RANGE.min ||
      priceRange[1] !== PRICE_RANGE.max
    ) {
      pills.push({
        key: "price",
        label: "Price",
        value: `$${priceRange[0]}–$${priceRange[1]}`,
      });
    }
    if (
      compressionRange[0] !== COMPRESSION_RANGE.min ||
      compressionRange[1] !== COMPRESSION_RANGE.max
    ) {
      pills.push({
        key: "compression",
        label: "Compression",
        value: `${compressionRange[0]}–${compressionRange[1]}`,
      });
    }

    return pills;
  }, [
    urlFilters.q,
    selectedBrands,
    selectedConstructions,
    selectedColors,
    priceRange,
    compressionRange,
  ]);

  const mobileActiveCount =
    selectedBrands.length +
    selectedConstructions.length +
    selectedColors.length +
    (priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max
      ? 1
      : 0) +
    (compressionRange[0] !== COMPRESSION_RANGE.min ||
    compressionRange[1] !== COMPRESSION_RANGE.max
      ? 1
      : 0);

  // Current sort value for the select
  const currentSortValue = useMemo(() => {
    const sortBy = filters.sortBy ?? "name";
    const sortOrder = filters.sortOrder ?? "asc";
    return (
      SORT_OPTIONS.find(
        (o) => o.sortBy === sortBy && o.sortOrder === sortOrder
      )?.value ?? "name-asc"
    );
  }, [filters.sortBy, filters.sortOrder]);

  const balls = data?.balls ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100">
            Browse All Golf Balls
          </h1>
          <p className="text-slate-400 mt-1">
            Explore our full database of golf balls. Filter by brand, price,
            construction, and more.
          </p>
        </div>

        {/* Search bar */}
        <SearchBar value={urlFilters.q ?? ""} onChange={handleSearch} />

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-2">
            <BrandFilter
              selected={selectedBrands}
              onChange={setSelectedBrands}
            />
            <ConstructionFilter
              selected={selectedConstructions}
              onChange={setSelectedConstructions}
            />
            <ColorFilter
              selected={selectedColors}
              onChange={setSelectedColors}
            />
            <RangeFilter
              label="Price"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={1}
              value={priceRange}
              onChange={setPriceRange}
              formatValue={(v) => `$${v}`}
            />
            <RangeFilter
              label="Compression"
              min={COMPRESSION_RANGE.min}
              max={COMPRESSION_RANGE.max}
              step={1}
              value={compressionRange}
              onChange={setCompressionRange}
            />
          </div>

          {/* Mobile filter button */}
          <MobileFilterSheet
            filters={{
              brands: selectedBrands,
              constructions: selectedConstructions,
              colors: selectedColors,
              priceRange,
              compressionRange,
            }}
            onApply={handleMobileApply}
            activeCount={mobileActiveCount}
          />
        </div>

        {/* Active filters */}
        <ActiveFilters
          filters={activeFilterPills}
          onRemove={handleRemoveFilter}
          onResetAll={handleResetAll}
        />

        {/* Sort + count row */}
        <div className="flex items-center justify-between">
          <SortSelect
            value={currentSortValue}
            onChange={handleSortChange}
          />
          {!isLoading && (
            <span className="text-sm text-slate-400">
              Showing {balls.length} of {total}
            </span>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          /* Loading state — 12 skeleton cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4 p-4">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : balls.length === 0 ? (
          /* Empty state */
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <SearchX className="h-12 w-12 text-slate-500 mb-4" />
              <h2 className="text-lg font-semibold text-slate-100 mb-2">
                No balls found
              </h2>
              <p className="text-slate-400 mb-6 max-w-sm">
                Try adjusting your filters or search terms to find what
                you&apos;re looking for.
              </p>
              <Button variant="outline" onClick={handleResetAll}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ball grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
                isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              {balls.map((ball) => (
                <BrowseBallCard key={ball.id} ball={ball} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
