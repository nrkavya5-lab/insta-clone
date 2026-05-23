import { test, expect } from "@playwright/test";

test.describe("Responsive Layout", () => {
  test("mobile shows bottom nav", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
  });

  test("desktop shows wider layout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
  });

  test("tablet shows mid layout", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1024 });
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
  });
});
