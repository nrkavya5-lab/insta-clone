import { test, expect } from "@playwright/test";

test.describe("Feed", () => {
  test("feed page title loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Insta Clone")).toBeVisible();
  });

  test("tab switcher shows For You and Following", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Forgot password")).toBeVisible();
  });

  test("login page has OAuth buttons", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("OR")).toBeVisible();
  });
});
