import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import { afterAll, vi } from "vitest";

// @ts-expect-error
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://test:27017";
process.env.DATABASE_NAME = "test_db";

export const mockDb = {
  collection: vi.fn(),
} as unknown as Db;

export const mockCollection = {
  find: vi.fn(),
  findOne: vi.fn(),
  insertOne: vi.fn(),
  aggregate: vi.fn(),
  drop: vi.fn(),
};

export const createMockUser = (overrides = {}) => ({
  _id: new ObjectId(),
  name: "Test User",
  ...overrides,
});

export const createMockCourse = (overrides = {}) => ({
  _id: new ObjectId(),
  title: "Test Course",
  difficulty: "hard" as const,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockEngagement = (overrides = {}) => ({
  _id: new ObjectId(),
  userId: new ObjectId(),
  courseId: new ObjectId(),
  timestamp: new Date().toISOString(),
  timeSpent: 100,
  ...overrides,
});

export const createMockRecommendation = (overrides = {}) => ({
  _id: new ObjectId(),
  userId: new ObjectId(),
  courseId: new ObjectId(),
  createdAt: new Date().toISOString(),
  reasonCode: "personalized" as const,
  confidence: 0.8,
  ...overrides,
});

afterAll(() => {
  vi.clearAllMocks();
});
