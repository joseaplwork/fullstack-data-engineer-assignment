import type { Document } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
import type { Course, EngagementWithDetails, Recommendation } from "@/models";

export async function queryEngagementsWithDetails(
  limit = 0
): Promise<EngagementWithDetails[]> {
  const db = await connectToDatabase();

  const pipeline: Document[] = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
        course: { $arrayElemAt: ["$course", 0] },
      },
    },
    { $sort: { timestamp: -1 } },
  ];

  if (limit && Number(limit) > 0) {
    pipeline.push({ $limit: Number(limit) });
  }

  const results = await db
    .collection("engagements")
    .aggregate(pipeline)
    .toArray();
  return results as EngagementWithDetails[];
}

export async function queryRecommendations(): Promise<Recommendation[]> {
  const db = await connectToDatabase();
  const recommendations = await db
    .collection("recommendations")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return recommendations as Recommendation[];
}

export async function queryCourses(): Promise<Course[]> {
  const db = await connectToDatabase();
  const courses = await db.collection("courses").find().toArray();
  return courses as Course[];
}

export default {
  queryEngagementsWithDetails,
  queryRecommendations,
  queryCourses,
};
