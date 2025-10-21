import { type Db, ObjectId } from "mongodb";
import { RecommendationSchema } from "@/models";

export async function createRecommendation(userId: ObjectId, db: Db) {
  const latestEngagement = await db
    .collection("engagements")
    .find({ userId })
    .sort({ startTime: -1 })
    .limit(1)
    .toArray();

  let recommendedCourse: unknown[] = [];
  if (latestEngagement.length > 0) {
    const latestCourseId = latestEngagement[0].courseId;
    const [latestCourse] = await db
      .collection("courses")
      .find({ _id: { $eq: latestCourseId } })
      .limit(1)
      .toArray();

    // Recommend course with similar difficulty
    recommendedCourse = await db
      .collection("courses")
      .find({ difficulty: { $eq: latestCourse?.difficulty } })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
  } else {
    // If no engagement history, recommend the newest course
    recommendedCourse = await db
      .collection("courses")
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
  }

  if (recommendedCourse.length === 0) {
    return null;
  }

  const recommendation = RecommendationSchema.parse({
    _id: new ObjectId(),
    userId,
    courseId: (recommendedCourse[0] as { _id: ObjectId })._id,
    reasonCode: latestEngagement.length > 0 ? "personalized" : "popular",
    confidence: 0.8,
    createdAt: new Date().toISOString(),
  });

  await db.collection("recommendations").insertOne(recommendation);
  return recommendation;
}
