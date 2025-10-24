import { expect, test } from "@playwright/test";

test.describe("API Routes - Courses", () => {
  test("GET /api/courses should return list of courses", async ({
    request,
  }) => {
    const response = await request.get("/api/courses");
    expect(response.ok()).toBeTruthy();

    const { data } = await response.json();
    expect(Array.isArray(data.courses)).toBe(true);
    expect(data.courses.length).toBeGreaterThan(0);

    const course = data.courses[0];
    expect(course).toHaveProperty("_id");
    expect(course).toHaveProperty("title");
    expect(course).toHaveProperty("difficulty");
  });
});

test.describe("API Routes - Engagements", () => {
  test("GET /api/engagements should return list of engagements", async ({
    request,
  }) => {
    const response = await request.get("/api/engagements");
    expect(response.ok()).toBeTruthy();

    const { data } = await response.json();
    expect(Array.isArray(data.engagements)).toBe(true);
    expect(data.engagements.length).toBeGreaterThan(0);

    const engagement = data.engagements[0];
    expect(engagement).toHaveProperty("_id");
    expect(engagement).toHaveProperty("userId");
    expect(engagement).toHaveProperty("courseId");
    expect(engagement).toHaveProperty("timestamp");
    expect(engagement).toHaveProperty("timeSpent");
  });
});

test.describe("API Routes - Recommendations", () => {
  test("GET /api/recommendations should return list of recommendations", async ({
    request,
  }) => {
    const response = await request.get("/api/recommendations");
    expect(response.ok()).toBeTruthy();

    const { data } = await response.json();
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);

    const recommendation = data.recommendations[0];
    expect(recommendation).toHaveProperty("_id");
    expect(recommendation).toHaveProperty("userId");
    expect(recommendation).toHaveProperty("courseId");
    expect(recommendation).toHaveProperty("createdAt");
  });
});

test.describe("API Routes - Users", () => {
  test("GET /api/users should return list of users", async ({ request }) => {
    const response = await request.get("/api/users");
    expect(response.ok()).toBeTruthy();

    const { data } = await response.json();
    expect(Array.isArray(data.users)).toBe(true);
    expect(data.users.length).toBeGreaterThan(0);

    const user = data.users[0];
    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("name");
  });
});
