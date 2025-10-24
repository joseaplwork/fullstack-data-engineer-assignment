import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api/helpers";
import { ObjectIdSchema } from "@/lib/api/validation";
import { createRecommendation } from "@/lib/business/recommendations";
import { connectToDatabase } from "@/lib/data/connection";
import { logger } from "@/lib/shared/logger";

interface Params {
  params: { userId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname, { userId: params.userId });

    const userId = new ObjectId(ObjectIdSchema.parse(params.userId));

    const db = await connectToDatabase();
    const recommendation = await createRecommendation(userId, db);

    return createSuccessResponse({ recommendation }, 200);
  } catch (error) {
    return handleApiError(error, pathname);
  }
}

export const dynamic = "force-dynamic";
