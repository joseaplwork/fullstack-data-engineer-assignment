import { type Db, ObjectId } from "mongodb";
import { RecommendationSchema } from "@/models";
import { COLLECTIONS } from "../shared/constants";

/**
 * Creates a personalized course recommendation for a user based on their engagement history.
 *
 * Algorithm:
 * 1. If user has engagement history → recommend a course with matching difficulty level
 * 2. If no engagement history → recommend the newest course (popular fallback)
 *
 * @param userId - MongoDB ObjectId of the user to generate recommendation for
 * @param db - MongoDB database connection instance
 * @returns The created recommendation object, or null if no suitable course found
 */
export async function createRecommendation(userId: ObjectId, db: Db) {
  const latestEngagement = await db
    .collection(COLLECTIONS.ENGAGEMENTS)
    .find({ userId })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  let recommendedCourse = [];
  if (latestEngagement.length > 0) {
    const latestCourse = await db
      .collection("courses")
      .findOne({ _id: latestEngagement[0].courseId });

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
      .collection(COLLECTIONS.COURSES)
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
    courseId: recommendedCourse[0]._id,
    reasonCode: latestEngagement.length > 0 ? "personalized" : "popular",
    confidence: Math.random(),
    createdAt: new Date().toISOString(),
  });

  await db.collection(COLLECTIONS.RECOMMENDATIONS).insertOne(recommendation);
  return recommendation;
}
