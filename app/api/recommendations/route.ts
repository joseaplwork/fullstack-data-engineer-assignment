import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api-helpers";
import { logger } from "@/lib/logger";
import { queryRecommendations } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname);

    const recommendations = await queryRecommendations();

    return createSuccessResponse({ recommendations }, 200);
  } catch (error) {
    return handleApiError(error, pathname);
  }
}

export const dynamic = "force-dynamic";
