import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import { getRecommendationStats } from "@/lib/get-recommendation-stats";
import { createMockEngagement, createMockRecommendation } from "../setup";

describe("getRecommendationStats", () => {
  it("should return zero stats when no recommendations", () => {
    const result = getRecommendationStats([], []);

    expect(result.effectivenessRate).toBe(0);
    expect(result.usedRecommendations).toBe(0);
    expect(result.totalRecommendations).toBe(0);
  });

  it("should calculate effectiveness when engagement happens after recommendation", () => {
    const userId = new ObjectId();
    const courseId = new ObjectId();

    const recommendation = createMockRecommendation({
      userId,
      courseId,
      createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
    });

    const engagement = createMockEngagement({
      userId,
      courseId,
      timestamp: new Date("2024-01-01T11:00:00Z").toISOString(),
    });

    const result = getRecommendationStats([recommendation], [engagement]);

    expect(result.effectivenessRate).toBe(100);
    expect(result.usedRecommendations).toBe(1);
    expect(result.totalRecommendations).toBe(1);
  });

  it("should not count engagement that happened before recommendation", () => {
    const userId = new ObjectId();
    const courseId = new ObjectId();

    const recommendation = createMockRecommendation({
      userId,
      courseId,
      createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
    });

    const engagement = createMockEngagement({
      userId,
      courseId,
      timestamp: new Date("2024-01-01T09:00:00Z").toISOString(),
    });

    const result = getRecommendationStats([recommendation], [engagement]);

    expect(result.effectivenessRate).toBe(0);
    expect(result.usedRecommendations).toBe(0);
    expect(result.totalRecommendations).toBe(1);
  });

  it("should calculate partial effectiveness", () => {
    const userId1 = new ObjectId();
    const userId2 = new ObjectId();
    const courseId = new ObjectId();

    const recommendations = [
      createMockRecommendation({
        userId: userId1,
        courseId,
        createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
      }),
      createMockRecommendation({
        userId: userId2,
        courseId,
        createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
      }),
    ];

    // Only user1 engages after recommendation
    const engagements = [
      createMockEngagement({
        userId: userId1,
        courseId,
        timestamp: new Date("2024-01-01T11:00:00Z").toISOString(),
      }),
    ];

    const result = getRecommendationStats(recommendations, engagements);

    expect(result.effectivenessRate).toBe(50);
    expect(result.usedRecommendations).toBe(1);
    expect(result.totalRecommendations).toBe(2);
  });

  it("should round effectiveness rate to 2 decimal places", () => {
    const recommendations = Array.from({ length: 3 }, () =>
      createMockRecommendation({
        userId: new ObjectId(),
        courseId: new ObjectId(),
        createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
      })
    );

    // Only 1 out of 3 used = 33.333...%
    const engagements = [
      createMockEngagement({
        userId: recommendations[0].userId,
        courseId: recommendations[0].courseId,
        timestamp: new Date("2024-01-01T11:00:00Z").toISOString(),
      }),
    ];

    const result = getRecommendationStats(recommendations, engagements);

    expect(result.effectivenessRate).toBe(33.33);
  });

  it("should handle multiple engagements for same user-course pair", () => {
    const userId = new ObjectId();
    const courseId = new ObjectId();

    const recommendation = createMockRecommendation({
      userId,
      courseId,
      createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
    });

    const engagements = [
      createMockEngagement({
        userId,
        courseId,
        timestamp: new Date("2024-01-01T11:00:00Z").toISOString(),
      }),
      createMockEngagement({
        userId,
        courseId,
        timestamp: new Date("2024-01-01T12:00:00Z").toISOString(),
      }),
    ];

    const result = getRecommendationStats([recommendation], engagements);

    // Should still count as 1 used recommendation, not 2
    expect(result.effectivenessRate).toBe(100);
    expect(result.usedRecommendations).toBe(1);
  });

  it("should handle different users and courses", () => {
    const user1 = new ObjectId();
    const user2 = new ObjectId();
    const course1 = new ObjectId();
    const course2 = new ObjectId();

    const recommendations = [
      createMockRecommendation({
        userId: user1,
        courseId: course1,
        createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
      }),
      createMockRecommendation({
        userId: user2,
        courseId: course2,
        createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
      }),
    ];

    // User1 engages with course1, but user2 doesn't engage with course2
    const engagements = [
      createMockEngagement({
        userId: user1,
        courseId: course1,
        timestamp: new Date("2024-01-01T11:00:00Z").toISOString(),
      }),
    ];

    const result = getRecommendationStats(recommendations, engagements);

    expect(result.effectivenessRate).toBe(50);
    expect(result.usedRecommendations).toBe(1);
    expect(result.totalRecommendations).toBe(2);
  });
});
