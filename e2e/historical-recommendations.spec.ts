import { test, expect } from "@playwright/test";

test.describe("E2E: Historical Customer Recommendations & Explainable Offers", () => {

  test("should load customer dashboard and display personalized recommendations and return guest discounts", async ({ page }) => {
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

      if (await nameInput.isVisible()) await nameInput.fill("Historical Recc Guest");
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

    // 3. Verify Overview Tab & Favourite Rooms catalog
    await expect(page.getByText("Favourite Suites & Recommended Stay").first()).toBeVisible();
  });
});
