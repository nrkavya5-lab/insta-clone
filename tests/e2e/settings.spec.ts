import { test, expect } from "@playwright/test";

test.describe("Settings Pages", () => {
  test("settings redirects to edit", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/settings\/edit/);
  });

  test("privacy settings page loads", async ({ page }) => {
    await page.goto("/settings/privacy");
    await expect(page.getByText("Privacy")).toBeVisible();
  });

  test("appearance page has theme options", async ({ page }) => {
    await page.goto("/settings/appearance");
    await expect(page.getByText("Appearance")).toBeVisible();
  });
});
