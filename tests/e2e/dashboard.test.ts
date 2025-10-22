import { expect, test } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test("should load dashboard page successfully and display main areas", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "User Engagement" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Total Engagements" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Recommendations" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Top Performing Courses" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Lowest Performing Courses" })
    ).toBeVisible();
  });

  test("should display engagements table", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("User", { exact: true })).toBeVisible();
    await expect(page.getByText("Course", { exact: true })).toBeVisible();
    await expect(page.getByText("Timestamp", { exact: true })).toBeVisible();
    await expect(page.getByText("Time Spent", { exact: true })).toBeVisible();
  });

  test("should display recommendation effectiveness card", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("Recommendations Given", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Used Recommendations", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Effectiveness Rate", { exact: true })
    ).toBeVisible();
  });

  test("should display top and lowest 3 performing courses", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Course Title", { exact: true })).toHaveCount(
      2
    );
    await expect(page.getByText("Difficulty", { exact: true })).toHaveCount(2);
    await expect(
      page.getByText("Total Engagements", { exact: true })
    ).toHaveCount(3);
    await expect(
      page.getByText("Total Time Spent", { exact: true })
    ).toHaveCount(2);
  });
});
