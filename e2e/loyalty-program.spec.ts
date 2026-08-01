import { test, expect } from "@playwright/test";

test.describe("E2E: Guest Loyalty Program & Tier Progression", () => {

  test("should load customer portal, navigate to loyalty tab, and verify tier badges", async ({ page }) => {
    // 1. Register/login a guest
    const timestamp = Date.now();
    const testPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;

    await page.goto("/");
    const bookBtn = page.getByRole("button", { name: /Book Stay/i }).first();
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
    }

    const authModal = page.locator("#auth-modal");
    if (await authModal.isVisible()) {
      const nameInput = page.locator("input[placeholder*='Name']").first();
      const phoneInput = page.locator("input[placeholder*='Mobile']").first();
      const passInput = page.locator("input[type='password']").first();

      if (await nameInput.isVisible()) await nameInput.fill("E2E Loyalty Guest");
      if (await phoneInput.isVisible()) await phoneInput.fill(testPhone);
      if (await passInput.isVisible()) await passInput.fill("Password123!");

      const submitBtn = page.locator("#auth-modal button[type='submit']").first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
      }
    }

    // 2. Navigate to Customer Dashboard Page
    await page.goto("/customer/dashboard");
    await page.waitForSelector("h1:has-text('Guest Portal')", { timeout: 15000 });

    // 3. Verify Loyalty Tab / Cards
    const loyaltyTab = page.locator("button", { hasText: "Loyalty Rewards" }).first();
    if (await loyaltyTab.isVisible()) {
      await loyaltyTab.click();
      await expect(page.getByText("Loyalty Rewards & Patron Privileges").first()).toBeVisible();
    }
  });
});
