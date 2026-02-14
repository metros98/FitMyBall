import type { Ball } from "./types";

interface FilterOptions {
  excludeDiscontinued?: boolean;
  excludeOutOfStock?: boolean;
}

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  excludeDiscontinued: true,
  excludeOutOfStock: false,
};

/**
 * Pre-filters the ball database before scoring.
 * - Excludes discontinued balls by default
 * - Optionally excludes out-of-stock balls
 */
export function filterBalls(
  balls: Ball[],
  options: FilterOptions = DEFAULT_FILTER_OPTIONS,
): Ball[] {
  return balls.filter((ball) => {
    if (options.excludeDiscontinued && ball.discontinued) return false;
    if (options.excludeOutOfStock && !ball.inStock) return false;
    return true;
  });
}
