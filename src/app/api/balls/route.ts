// GET /api/balls - List all balls with filtering, sorting, and pagination
import { NextRequest } from "next/server";
import { ballQuerySchema } from "@/lib/validations/ball";
import { getAllBalls } from "@/lib/db/queries/balls";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/api-error";
import type { BallListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    // Convert URLSearchParams to object, preserving arrays for duplicate keys
    const searchParamsObj: Record<string, string | string[]> = {};
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      const existing = searchParamsObj[key];
      if (existing) {
        // If key already exists, convert to array or append to existing array
        searchParamsObj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        searchParamsObj[key] = value;
      }
    }

    const validationResult = ballQuerySchema.safeParse(searchParamsObj);

    if (!validationResult.success) {
      return validationError(validationResult.error);
    }

    const query = validationResult.data;

    // Extract filters, pagination, and sorting
    const filters = {
      q: query.q,
      manufacturer: query.manufacturer,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      compression: query.compression,
      construction: query.construction,
      color: query.color,
    };

    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const sort = {
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    // Fetch balls from database
    const result = await getAllBalls(filters, pagination, sort);

    // Build response
    const response: BallListResponse = {
      balls: result.balls,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
