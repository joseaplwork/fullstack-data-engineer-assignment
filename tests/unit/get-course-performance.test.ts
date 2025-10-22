import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import { getCoursePerformance } from "@/lib/get-course-performance";
import { createMockCourse, createMockEngagement } from "../setup";

describe("getCoursePerformance", () => {
  it("should return empty arrays when no courses or engagements", () => {
    const result = getCoursePerformance([], []);
    expect(result.topCourses).toHaveLength(0);
    expect(result.bottomCourses).toHaveLength(0);
  });

  it("should calculate engagement counts correctly", () => {
    const courseId = new ObjectId();
    const courses = [createMockCourse({ _id: courseId })];

    const engagements = [
      createMockEngagement({ courseId, timeSpent: 100 }),
      createMockEngagement({ courseId, timeSpent: 200 }),
      createMockEngagement({ courseId, timeSpent: 300 }),
    ];

    const result = getCoursePerformance(courses, engagements);

    expect(result.topCourses).toHaveLength(1);
    expect(result.topCourses[0].totalEngagements).toBe(3);
    expect(result.topCourses[0].totalTimeSpent).toBe(600);
  });

  it("should return top 3 and bottom 3 courses", () => {
    const courses = Array.from({ length: 10 }, (_, i) =>
      createMockCourse({ _id: new ObjectId(), title: `Course ${i}` })
    );

    const engagements = courses.flatMap((course, index) =>
      Array.from({ length: index + 1 }, () =>
        createMockEngagement({
          courseId: course._id,
          timeSpent: (index + 1) * 100,
        })
      )
    );

    const result = getCoursePerformance(courses, engagements);

    expect(result.topCourses).toHaveLength(3);
    expect(result.bottomCourses).toHaveLength(3);
  });

  it("should sort by engagement * timeSpent score", () => {
    const course1 = createMockCourse({
      _id: new ObjectId(),
      title: "Course 1",
    });
    const course2 = createMockCourse({
      _id: new ObjectId(),
      title: "Course 2",
    });

    // Course 1: 2 engagements * totalTime 200 = 2 * 200 = 400 score
    // Course 2: 1 engagement * totalTime 500 = 1 * 500 = 500 score
    const engagements = [
      createMockEngagement({ courseId: course1._id, timeSpent: 100 }),
      createMockEngagement({ courseId: course1._id, timeSpent: 100 }),
      createMockEngagement({ courseId: course2._id, timeSpent: 500 }),
    ];

    const result = getCoursePerformance([course1, course2], engagements);

    // Sorted high to low: [Course2(500), Course1(400)]
    // topCourses: first 3 (or all if less) = [Course2, Course1]
    expect(result.topCourses[0].course.title).toBe("Course 2");
    expect(result.topCourses[1].course.title).toBe("Course 1");

    // bottomCourses: last 3 (slice(-3)) = still [Course2, Course1] in same order
    expect(result.bottomCourses[0].course.title).toBe("Course 2");
    expect(result.bottomCourses[1].course.title).toBe("Course 1");
  });

  it("should handle courses with no engagements", () => {
    const courseWithEngagement = createMockCourse({ _id: new ObjectId() });
    const courseWithoutEngagement = createMockCourse({ _id: new ObjectId() });

    const engagements = [
      createMockEngagement({
        courseId: courseWithEngagement._id,
        timeSpent: 100,
      }),
    ];

    const result = getCoursePerformance(
      [courseWithEngagement, courseWithoutEngagement],
      engagements
    );

    // Course without engagement should be at the bottom
    const courseWithoutEngagementInResults = result.bottomCourses.find(
      (c) => c.course._id.toString() === courseWithoutEngagement._id.toString()
    );

    expect(courseWithoutEngagementInResults).toBeDefined();
    expect(courseWithoutEngagementInResults?.totalEngagements).toBe(0);
    expect(courseWithoutEngagementInResults?.totalTimeSpent).toBe(0);
  });

  it("should handle single course", () => {
    const course = createMockCourse({ _id: new ObjectId() });
    const engagements = [
      createMockEngagement({ courseId: course._id, timeSpent: 100 }),
    ];

    const result = getCoursePerformance([course], engagements);

    expect(result.topCourses).toHaveLength(1);
    expect(result.bottomCourses).toHaveLength(1);
    expect(result.topCourses[0]).toEqual(result.bottomCourses[0]);
  });
});
