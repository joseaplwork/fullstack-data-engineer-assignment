import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectToDatabase();

    const engagementsWithDetails = await db.collection("engagements").aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course"
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
        course: { $arrayElemAt: ["$course", 0] }
      }
    },
    {
      $sort: { timestamp: -1 }
    }
  ]).toArray();


  return NextResponse.json(
    {
      success: true,
      engagements: engagementsWithDetails,
    },
    { status: 200 }
  );
}
export const dynamic = "force-dynamic";
