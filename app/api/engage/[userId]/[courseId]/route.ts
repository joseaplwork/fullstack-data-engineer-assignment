import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { createSuccessResponse, handleApiError } from "@/lib/api-helpers";
import { COLLECTIONS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectIdSchema } from "@/lib/validation";
import { EngagementSchema } from "@/models";

interface Params {
  params: { userId: string; courseId: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { pathname } = request.nextUrl;

  try {
    logger.request("GET", pathname, params);

    const userId = new ObjectId(ObjectIdSchema.parse(params.userId));
    const courseId = new ObjectId(ObjectIdSchema.parse(params.courseId));

    const db = await connectToDatabase();

    const engagement = EngagementSchema.parse({
      _id: new ObjectId(),
      userId,
      courseId,
      timestamp: new Date().toISOString(),
      timeSpent: Math.floor(Math.random() * 10000),
    });

    await db.collection(COLLECTIONS.ENGAGEMENTS).insertOne(engagement);

    return createSuccessResponse({ engagement }, 201);
  } catch (error) {
    return handleApiError(error, pathname);
  }
}
export const dynamic = "force-dynamic";
