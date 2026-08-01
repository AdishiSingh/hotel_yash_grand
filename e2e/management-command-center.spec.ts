import { test, expect } from "@playwright/test";

test.describe("E2E: Executive Manager Command Center & Operational Management", () => {

  test("should load management dashboard, verify revenue & live occupancy metrics, and navigate tabs", async ({ page }) => {
    // 1. Navigate to Management Dashboard page
    await page.goto("/management");

    // 2. Wait for loading spinner to complete & verify header & Live Operational metrics
    await page.waitForSelector("text=Manager Command Center", { timeout: 15000 });
    await expect(page.getByText("Manager Command Center").first()).toBeVisible();
    await expect(page.getByText("Today's Total Revenue")).toBeVisible();
    await expect(page.getByText("Live Occupancy Rate")).toBeVisible();
    await expect(page.getByText("Pending Approvals").first()).toBeVisible();

    // 3. Verify Room Status Grid Tab Navigation
    const gridTab = page.locator("button", { hasText: "Room Status Grid" }).first();
    if (await gridTab.isVisible()) {
      await gridTab.click();
      await expect(page.getByText("Live Room Status & Floor Grid")).toBeVisible();
    }

    // 4. Verify Today's Check-ins Tab Navigation
    const checkInsTab = page.locator("button", { hasText: "Today's Check-ins" }).first();
    if (await checkInsTab.isVisible()) {
      await checkInsTab.click();
      await expect(page.getByText("Today's Check-ins & Guest Arrivals")).toBeVisible();
    }

    // 5. Verify Pending Approvals Tab Navigation
    const approvalsTab = page.locator("button", { hasText: "Pending Approvals" }).first();
    if (await approvalsTab.isVisible()) {
      await approvalsTab.click();
      await expect(page.getByText("Pending Booking Inquiries & Manager Approvals")).toBeVisible();
    }

    // 6. Verify Booking Calendar Tab Navigation
    const calendarTab = page.locator("button", { hasText: "Booking Calendar" }).first();
    if (await calendarTab.isVisible()) {
      await calendarTab.click();
      await expect(page.getByText("Master Hotel Booking Calendar")).toBeVisible();
    }

    // 7. Verify Guest History Tab Navigation
    const guestsTab = page.locator("button", { hasText: "Guest History" }).first();
    if (await guestsTab.isVisible()) {
      await guestsTab.click();
      await expect(page.getByText("Guest History & Customer Database")).toBeVisible();
    }
  });
});
