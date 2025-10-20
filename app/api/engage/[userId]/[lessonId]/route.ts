import { connectToDatabase } from "@/lib/mongodb";
import { EngagementSchema } from "@/models";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string; courseId: string } }
) {
  const db = await connectToDatabase();
  const { userId, courseId } = params;

  const engagement = EngagementSchema.parse({
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    courseId: new ObjectId(courseId),
    timestamp: new Date().toISOString(),
  });

  await db.collection("engagements").insertOne(engagement);
  return NextResponse.json({ success: true, engagement }, { status: 200 });
}
export const dynamic = "force-dynamic";
