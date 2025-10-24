import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api/helpers";
import { queryEngagementsWithDetails } from "@/lib/data/queries";
import { logger } from "@/lib/shared/logger";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname);

    const engagements = await queryEngagementsWithDetails();

    return createSuccessResponse({ engagements }, 200);
  } catch (error) {
    return handleApiError(error, pathname);
  }
}
export const dynamic = "force-dynamic";
