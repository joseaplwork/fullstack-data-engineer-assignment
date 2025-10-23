import type { Document } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
import type { Course, EngagementWithDetails, Recommendation } from "@/models";
import { COLLECTIONS } from "./constants";

export async function queryEngagementsWithDetails(): Promise<
  EngagementWithDetails[]
> {
  const db = await connectToDatabase();
  const pipeline: Document[] = [
    {
      $lookup: {
        from: COLLECTIONS.USERS,
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: COLLECTIONS.COURSES,
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
    {
      $match: {
        user: { $ne: null },
        course: { $ne: null },
      },
    },
    { $sort: { timestamp: -1 } },
  ];
  const engagementsWithDetails = await db
    .collection(COLLECTIONS.ENGAGEMENTS)
    .aggregate(pipeline)
    .toArray();

  return engagementsWithDetails as EngagementWithDetails[];
}

export async function queryRecommendations(): Promise<Recommendation[]> {
  const db = await connectToDatabase();
  const recommendations = await db
    .collection(COLLECTIONS.RECOMMENDATIONS)
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return recommendations as Recommendation[];
}

export async function queryCourses(): Promise<Course[]> {
  const db = await connectToDatabase();
  const courses = await db.collection(COLLECTIONS.COURSES).find().toArray();

  return courses as Course[];
}
