import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRecommendation } from "@/lib/business/recommendations";
import { mockCollection } from "../setup";

describe("createRecommendation", () => {
  let mockDb: Db;
  const userId = new ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = {
      collection: vi.fn(() => mockCollection),
    } as unknown as Db;
  });

  it("should return null if user has no engagements", async () => {
    mockCollection.find.mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
    });

    const result = await createRecommendation(userId, mockDb);
    expect(result).toBeNull();
  });

  it("should return null if no suitable courses found", async () => {
    const engagement = {
      courseId: new ObjectId(),
      course: {
        difficulty: "intermediate" as const,
      },
    };

    mockCollection.findOne.mockResolvedValue({
      difficulty: "intermediate" as const,
    });

    mockCollection.find
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([engagement]),
      })
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      });

    const result = await createRecommendation(userId, mockDb);
    expect(result).toBeNull();
  });

  it("should create recommendation with matching difficulty", async () => {
    const courseId = new ObjectId();
    const recommendedCourseId = new ObjectId();

    const engagement = {
      courseId,
      course: {
        difficulty: "intermediate" as const,
      },
    };

    const recommendedCourse = {
      _id: recommendedCourseId,
      title: "New Course",
      difficulty: "intermediate" as const,
    };

    mockCollection.findOne.mockResolvedValue({
      difficulty: "intermediate" as const,
    });

    mockCollection.find
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([engagement]),
      })
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([recommendedCourse]),
      });

    mockCollection.insertOne.mockResolvedValue({
      insertedId: new ObjectId(),
      acknowledged: true,
    });

    const result = await createRecommendation(userId, mockDb);

    expect(result).not.toBeNull();
    expect(result?.userId).toEqual(userId);
    expect(result?.courseId).toEqual(recommendedCourseId);
    expect(mockCollection.insertOne).toHaveBeenCalled();
  });
});
