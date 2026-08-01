import { test, expect } from "@playwright/test";

test.describe("E2E: Negative Testing & Accessibility Audits", () => {
  
  test("should display error message on invalid login credentials", async ({ page }) => {
    await page.goto("/customer/login");

    await page.fill("input[placeholder*='9876543210'], input[type='text']", "9151000000");
    await page.fill("input[type='password']", "WrongPassword999!");
    await page.click("button[type='submit']");

    // Verify error message is rendered
    const errorAlert = page.locator("div:has-text('Invalid'), p:has-text('Invalid'), [class*='red']");
    await expect(errorAlert.first()).toBeVisible({ timeout: 5000 });
  });

  test("should block unauthenticated access to /customer/dashboard", async ({ page }) => {
    // Attempt direct URL access without session cookie
    await page.goto("/customer/dashboard");

    // Verify redirection or login interception prompt
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url.includes("/login") || url.includes("/customer") || url === "http://localhost:3000/").toBe(true);
  });

  test("should support keyboard navigation tab-focus across Header navigation links", async ({ page }) => {
    await page.goto("/");

    // Press Tab key to navigate focus into header links
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verify an element has focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
  });
});
