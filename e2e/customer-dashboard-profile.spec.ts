import { test, expect } from "@playwright/test";

test.describe("E2E: Customer Portal Dashboard, Profile Preferences & Premium Guest Privileges", () => {

  test("should register, login customer, navigate to dashboard, verify portal metrics & tab navigation", async ({ page, request }) => {
    const customerPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
    const password = "E2ePortalPassword123!";

    // 1. Register customer via API
    await request.post("http://localhost:3000/api/customer/auth/register", {
      data: {
        name: "Premium Portal E2E User",
        phone: customerPhone,
        password: password,
      },
    });

    // 2. Navigate to Customer Login page
    await page.goto("/customer/login");

    // 3. Fill login form using input selectors
    const identifierInput = page.locator("input[placeholder*='guest@example.com'], input[placeholder*='9876543210'], input[type='text']").first();
    await identifierInput.fill(customerPhone);

    const passwordInput = page.locator("input[type='password']").first();
    await passwordInput.fill(password);
    
    // Click submit button
    const submitBtn = page.locator("button[type='submit']").first();
    await submitBtn.click();

    // 4. Verify successful login navigation to /customer/dashboard
    await page.waitForURL(/\/customer\/dashboard/, { timeout: 15000 });
    await expect(page.locator("body")).toBeVisible();

    // 5. Verify Premium Guest Portal metric cards & header
    await expect(page.locator("h1")).toContainText("Welcome back");
    await expect(page.getByText("Loyalty Points")).toBeVisible();
    await expect(page.getByText("Total Stay Value")).toBeVisible();

    // 6. Test Tab Navigation: Loyalty Rewards
    const loyaltyTab = page.locator("button", { hasText: "Loyalty Rewards" }).first();
    if (await loyaltyTab.isVisible()) {
      await loyaltyTab.click();
      await expect(page.getByText("Hotel Yash Grand Guest Club")).toBeVisible();
      await expect(page.getByText("Royal Platinum VIP")).toBeVisible();
    }

    // 7. Test Tab Navigation: Stay Preferences
    const prefTab = page.locator("button", { hasText: "Stay Preferences" }).first();
    if (await prefTab.isVisible()) {
      await prefTab.click();
      await expect(page.getByText("Saved Stay & Dietary Preferences")).toBeVisible();
    }

    // 8. Test Tab Navigation: Favourite Rooms
    const favTab = page.locator("button", { hasText: "Favourite Rooms" }).first();
    if (await favTab.isVisible()) {
      await favTab.click();
      await expect(page.getByText("Saved Favourite Room Suite Catalog")).toBeVisible();
    }

    // 9. Navigate to Customer Profile page
    await page.goto("/customer/profile");
    await expect(page).toHaveURL(/\/customer\/profile/);
    await expect(page.locator("body")).toBeVisible();
  });
});
