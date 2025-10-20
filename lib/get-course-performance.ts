import { Course, Engagement } from "@/models";

export interface CoursePerformance {
  course: Course;
  totalEngagements: number;
  totalTimeSpent: number;
}

export function getCoursePerformance(
  courses: Course[],
  engagements: Engagement[]
): {
  topCourses: CoursePerformance[];
  bottomCourses: CoursePerformance[];
} {
  const performanceMap = new Map<string, {
    totalEngagements: number;
    totalTimeSpent: number;
  }>();

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

  const allCourses: CoursePerformance[] = courses.map(course => {
    const stats = performanceMap.get(course._id.toString())!;
    return {
      course,
      totalEngagements: stats.totalEngagements,
      totalTimeSpent: stats.totalTimeSpent,
    };
  });

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
