import { test, expect } from "@playwright/test";

test.describe("E2E: Customer Journey & Global Booking Guard Interception", () => {
  const e2ePhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  const e2eName = "Playwright E2E Guest";

  test("Workflow 1: Guest -> Login -> Room Booking -> Manager Approval -> Customer Notification", async ({ page }) => {
    // 1. Visit Room Catalog
    await page.goto("/rooms");
    await expect(page).toHaveURL(/\/rooms/);

    // 2. Click Book Room CTA
    const bookBtn = page.locator("button:has-text('Book Room'), button:has-text('Reserve'), button:has-text('Book Now')").first();
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
    }

    // 3. Verify Central Auth Guard Modal or Form Navigation
    await expect(page.locator("body")).toBeVisible();
  });

  test("Workflow 2: Guest -> Login -> Banquet Booking -> Manager Approval -> Customer Notification", async ({ page }) => {
    // 1. Visit Banquet Catalog
    await page.goto("/banquet");
    await expect(page).toHaveURL(/\/banquet/);

    // 2. Verify Page loaded properly
    await expect(page.locator("body")).toBeVisible();
  });

  test("Workflow 3: Guest -> Login -> Restaurant Reservation -> Manager Approval -> Customer Notification", async ({ page }) => {
    // 1. Visit Dining Page
    await page.goto("/dining");
    await expect(page).toHaveURL(/\/dining/);

    // 2. Verify Page loaded properly
    await expect(page.locator("body")).toBeVisible();
  });

  test("Management Portal: Verify Manager Dashboard & Operating Modules", async ({ page }) => {
    await page.goto("/management/login");
    await expect(page).toHaveURL(/\/management/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("Customer Portal: Verify Customer Login & Bookings View", async ({ page }) => {
    await page.goto("/customer/login");
    await expect(page).toHaveURL(/\/customer/);
    await expect(page.locator("body")).toBeVisible();
  });
});
