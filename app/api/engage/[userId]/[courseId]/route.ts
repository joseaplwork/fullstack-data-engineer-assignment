import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EngagementSchema } from "@/models";

export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string; courseId: string } }
) {
  try {
    const db = await connectToDatabase();
    const { userId, courseId } = params;

    const engagement = EngagementSchema.parse({
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      timestamp: new Date().toISOString(),
      timeSpent: Math.floor(Math.random() * 10000),
    });

    await db.collection("engagements").insertOne(engagement);
    return NextResponse.json({ success: true, engagement }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create engagement",
      },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
