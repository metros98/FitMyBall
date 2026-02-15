// GET /api/balls/[id] - Get single ball details
import { NextRequest } from "next/server";
import { ballIdSchema } from "@/lib/validations/ball";
import { getBallById } from "@/lib/db/queries/balls";
import { apiSuccess, HttpError } from "@/lib/utils/api-response";
import { handleApiError, badRequest } from "@/lib/utils/api-error";
import type { BallDetailResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ballIdParam } = await params;
    
    // Validate ball ID
    const validationResult = ballIdSchema.safeParse(ballIdParam);
    if (!validationResult.success) {
      throw badRequest("Invalid ball ID format");
    }

    const ballId = validationResult.data;

    // Fetch ball from database
    const ball = await getBallById(ballId);

    if (!ball) {
      return HttpError.notFound("Ball");
    }

    // Build response
    const response: BallDetailResponse = {
      ball,
    };

    return apiSuccess(response);
  } catch (error) {
    return handleApiError(error);
  }
}
