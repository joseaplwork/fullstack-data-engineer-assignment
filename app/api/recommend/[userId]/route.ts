import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRecommendation } from "@/lib/create-recommendation";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const db = await connectToDatabase();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const recommendation = await createRecommendation(new ObjectId(userId), db);
    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: "No recommendations available" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, recommendation },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
