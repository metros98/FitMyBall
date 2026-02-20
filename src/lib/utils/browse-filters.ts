import type { BallQueryFilters } from "@/types/api";

export const MANUFACTURERS = [
  "Bridgestone",
  "Callaway",
  "Cut",
  "Maxfli",
  "Snell",
  "Srixon",
  "TaylorMade",
  "Titleist",
  "Vice",
  "Wilson",
] as const;

export const CONSTRUCTIONS = [
  "2-piece",
  "3-piece",
  "4-piece",
  "5-piece",
] as const;

export const COLORS = [
  "White",
  "Yellow",
  "Orange",
  "Pink",
  "Matte",
  "Neon",
  "Graphic",
] as const;

export const PRICE_RANGE = { min: 15, max: 60 } as const;

export const COMPRESSION_RANGE = { min: 30, max: 110 } as const;

export const SORT_OPTIONS = [
  { label: "Name (A–Z)", value: "name-asc", sortBy: "name", sortOrder: "asc" },
  { label: "Name (Z–A)", value: "name-desc", sortBy: "name", sortOrder: "desc" },
  { label: "Price (Low–High)", value: "price-asc", sortBy: "price", sortOrder: "asc" },
  { label: "Price (High–Low)", value: "price-desc", sortBy: "price", sortOrder: "desc" },
  { label: "Compression (Low–High)", value: "compression-asc", sortBy: "compression", sortOrder: "asc" },
  { label: "Compression (High–Low)", value: "compression-desc", sortBy: "compression", sortOrder: "desc" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: string;
  sortBy: BallQueryFilters["sortBy"];
  sortOrder: BallQueryFilters["sortOrder"];
}>;

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): BallQueryFilters {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const filters: BallQueryFilters = {};

  const q = get("q");
  if (q) filters.q = q;

  const manufacturer = get("manufacturer");
  if (manufacturer) filters.manufacturer = manufacturer;

  const construction = get("construction");
  if (construction) filters.construction = construction;

  const color = get("color");
  if (color) filters.color = color;

  const minPrice = get("minPrice");
  if (minPrice != null) {
    const n = Number(minPrice);
    if (!Number.isNaN(n)) filters.minPrice = n;
  }

  const maxPrice = get("maxPrice");
  if (maxPrice != null) {
    const n = Number(maxPrice);
    if (!Number.isNaN(n)) filters.maxPrice = n;
  }

  const compression = get("compression");
  if (compression != null) {
    const n = Number(compression);
    if (!Number.isNaN(n)) filters.compression = n;
  }

  const sortBy = get("sortBy");
  if (sortBy === "price" || sortBy === "compression" || sortBy === "name") {
    filters.sortBy = sortBy;
  }

  const sortOrder = get("sortOrder");
  if (sortOrder === "asc" || sortOrder === "desc") {
    filters.sortOrder = sortOrder;
  }

  const page = get("page");
  if (page != null) {
    const n = Number(page);
    if (!Number.isNaN(n) && n >= 1) filters.page = Math.floor(n);
  }

  const limit = get("limit");
  if (limit != null) {
    const n = Number(limit);
    if (!Number.isNaN(n) && n >= 1) filters.limit = Math.floor(n);
  }

  return filters;
}

export function countActiveFilters(filters: BallQueryFilters): number {
  let count = 0;

  if (filters.q) count++;
  if (filters.manufacturer) count++;
  if (filters.construction) count++;
  if (filters.color) count++;
  if (filters.minPrice != null) count++;
  if (filters.maxPrice != null) count++;
  if (filters.compression != null) count++;

  return count;
}
