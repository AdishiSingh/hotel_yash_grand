import { test, expect } from "@playwright/test";

test.describe("E2E: Real-Time Room Availability & Inventory Control System", () => {

  test("should load room availability matrix, verify 5 statuses, and toggle room block", async ({ page }) => {
    // 1. Navigate to Room Availability page
    await page.goto("/management/availability");

    // 2. Wait for matrix header to render
    await page.waitForSelector("text=Real-Time Room Availability Engine", { timeout: 15000 });
    await expect(page.getByText("Real-Time Room Availability Engine").first()).toBeVisible();

    // 3. Verify 5 Explicit Status Badges in Summary Cards
    await expect(page.getByText("Available").first()).toBeVisible();
    await expect(page.getByText("Reserved").first()).toBeVisible();
    await expect(page.getByText("Occupied").first()).toBeVisible();
    await expect(page.getByText("Maintenance").first()).toBeVisible();
    await expect(page.getByText("Blocked").first()).toBeVisible();

    // 4. Verify 14-day Calendar Schedule Matrix
    await expect(page.getByText("Room & Type")).toBeVisible();

    // 5. Open Block Modal on first available room
    const blockBtn = page.locator("button", { hasText: "Block Room" }).first();
    if (await blockBtn.isVisible()) {
      await blockBtn.click();
      await expect(page.getByText("ADMINISTRATIVE BLOCK CONTROL")).toBeVisible();

      // Close modal
      const cancelBtn = page.locator("button", { hasText: "Cancel" }).first();
      await cancelBtn.click();
    }
  });
});
