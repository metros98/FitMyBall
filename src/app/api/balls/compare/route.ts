// GET /api/balls/compare - Compare multiple balls by IDs
import { NextRequest } from "next/server";
import { ballCompareSchema } from "@/lib/validations/ball";
import { getBallsByIds } from "@/lib/db/queries/balls";
import { apiSuccess, validationError } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/api-error";
import type { BallCompareResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = ballCompareSchema.safeParse(searchParams);

    if (!validationResult.success) {
      return validationError(validationResult.error);
    }

    const { ids } = validationResult.data;

    // Fetch balls from database
    const balls = await getBallsByIds(ids);

    // Check if all requested balls were found
    if (balls.length !== ids.length) {
      const foundIds = balls.map((ball) => ball.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));

      return apiSuccess(
        {
          balls,
          warning: `Some balls were not found: ${missingIds.join(", ")}`,
        },
        200
      );
    }

    // Build response
    const response: BallCompareResponse = {
      balls,
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
