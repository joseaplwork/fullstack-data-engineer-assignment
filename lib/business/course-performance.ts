import type { Course, Engagement } from "@/models";

export interface CoursePerformance {
  course: Course;
  totalEngagements: number;
  totalTimeSpent: number;
}

/**
 * Ranks courses by performance using a composite scoring algorithm.
 *
 * Performance Score = Total Engagements × Total Time Spent
 *
 * Rationale: This multiplicative metric balances popularity (engagement count)
 * with depth (time investment). Courses excelling in only one dimension receive
 * lower scores, encouraging both breadth and depth of engagement.
 *
 * @param courses - All available courses
 * @param engagements - All user engagement records
 * @returns Object containing top 3 and bottom 3 performing courses
 */
export function getCoursePerformance(
  courses: Course[],
  engagements: Engagement[]
): {
  topCourses: CoursePerformance[];
  bottomCourses: CoursePerformance[];
} {
  const performanceMap = new Map<
    string,
    {
      totalEngagements: number;
      totalTimeSpent: number;
    }
  >();

  for (const course of courses) {
    performanceMap.set(course._id.toString(), {
      totalEngagements: 0,
      totalTimeSpent: 0,
    });
  }

  for (const engagement of engagements) {
    const courseId = engagement.courseId.toString();
    const stats = performanceMap.get(courseId);

    if (stats) {
      stats.totalEngagements++;
      stats.totalTimeSpent += engagement.timeSpent;
    }
  }

  const allCourses: CoursePerformance[] = courses.map((course) => {
    const stats = performanceMap.get(course._id.toString());
    return {
      course,
      totalEngagements: stats?.totalEngagements || 0,
      totalTimeSpent: stats?.totalTimeSpent || 0,
    };
  });

  // Multiplicative scoring penalizes one-dimensional performance
  const sortedCourses = [...allCourses].sort((a, b) => {
    const scoreA = a.totalEngagements * a.totalTimeSpent;
    const scoreB = b.totalEngagements * b.totalTimeSpent;
    return scoreB - scoreA;
  });

  return {
    topCourses: sortedCourses.slice(0, 3),
    bottomCourses: sortedCourses.slice(-3),
  };
}
