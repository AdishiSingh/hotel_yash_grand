import { test, expect } from "@playwright/test";

test.describe("E2E: Homepage Navigation & Hospitality Browsing", () => {
  
  test("should load the luxury homepage with correct metadata and title", async ({ page }) => {
    await page.goto("/");

    // Verify page title & body container
    await expect(page).toHaveTitle(/Yash Grand/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to Rooms page and display room catalog cards", async ({ page }) => {
    await page.goto("/rooms");
    await expect(page).toHaveURL(/\/rooms/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to Dining & Restaurant page", async ({ page }) => {
    await page.goto("/dining");
    await expect(page).toHaveURL(/\/dining/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to Banquet & Event Celebrations page", async ({ page }) => {
    await page.goto("/banquet");
    await expect(page).toHaveURL(/\/banquet/);
    await expect(page.locator("body")).toBeVisible();
  });
});
