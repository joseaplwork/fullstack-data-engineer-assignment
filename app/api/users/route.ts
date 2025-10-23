import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api-helpers";
import { COLLECTIONS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname);

    const db = await connectToDatabase();
    const users = await db.collection(COLLECTIONS.USERS).find().toArray();

    return createSuccessResponse({ users }, 200);
  } catch (error) {
    return handleApiError(error, pathname);
  }
}

export const dynamic = "force-dynamic";
