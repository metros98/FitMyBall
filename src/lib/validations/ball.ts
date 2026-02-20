// Ball API validation schemas
import { z } from "zod";

/**
 * Schema for ball query parameters (GET /api/balls)
 */
export const ballQuerySchema = z.object({
  q: z.string().min(2, "Search query must be at least 2 characters").optional(),
  manufacturer: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  compression: z.coerce.number().min(0).max(120).optional(),
  construction: z.string().optional(),
  color: z.string().optional(),
  sortBy: z.enum(["price", "compression", "name"]).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type BallQuery = z.infer<typeof ballQuerySchema>;

/**
 * Schema for pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * Schema for ball ID parameter (CUID validation)
 */
export const ballIdSchema = z.string().cuid();

/**
 * Schema for search query (GET /api/balls/search)
 */
export const searchQuerySchema = z.object({
  q: z.string().min(2, "Search query must be at least 2 characters"),
  limit: z.coerce.number().int().min(1).max(20).optional().default(10),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Schema for session ID parameter (CUID validation)
 */
export const sessionIdSchema = z.string().cuid();

/**
 * Schema for save recommendation request
 */
export const saveRecommendationSchema = z.object({
  sessionId: z.string().cuid(),
});

export type SaveRecommendationRequest = z.infer<typeof saveRecommendationSchema>;

/**
 * Schema for user ID parameter (CUID validation)
 */
export const userIdSchema = z.string().cuid();
