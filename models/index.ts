import { ObjectId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1).max(100),
});

export const CourseSchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1).max(200),
  difficulty: z.enum(["easy", "medium", "hard"]),
  createdAt: z.string(),
});

export const EngagementSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  courseId: z.instanceof(ObjectId),
  timestamp: z.string(),
  timeSpent: z.number(),
});

export const RecommendationSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  courseId: z.instanceof(ObjectId),
  createdAt: z.string(),
  reasonCode: z.enum(["personalized", "popular"]),
  confidence: z.number().min(0).max(1),
});

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Engagement = z.infer<typeof EngagementSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;

export type EngagementWithDetails = Engagement & {
  user: User;
  course: Course;
};
