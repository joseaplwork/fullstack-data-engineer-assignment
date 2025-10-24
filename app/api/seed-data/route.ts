import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api/helpers";
import { connectToDatabase } from "@/lib/data/connection";
import { generateSeedData } from "@/lib/data/seed";
import { logger } from "@/lib/shared/logger";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname);

    const db = await connectToDatabase();
    await generateSeedData(db);

    return createSuccessResponse(
      { message: "Database seeded successfully" },
      200
    );
  } catch (error) {
    return handleApiError(error, pathname);
  }
}

export const dynamic = "force-dynamic";
