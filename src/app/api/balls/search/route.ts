// GET /api/balls/search - Search balls by name or manufacturer
import { NextRequest } from "next/server";
import { ballSearchSchema } from "@/lib/validations/ball";
import { searchBalls } from "@/lib/db/queries/balls";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/api-error";
import type { BallSearchResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = ballSearchSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return validationError(validationResult.error);
    }

    const { q, limit } = validationResult.data;

    // Search balls in database
    const results = await searchBalls(q, limit);

    // Build response
    const response: BallSearchResponse = {
      results,
      query: q,
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
