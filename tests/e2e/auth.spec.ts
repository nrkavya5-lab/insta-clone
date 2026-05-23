import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/feed");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page shows signup link", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign Up")).toBeVisible();
    await page.getByText("Sign Up").click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("signup page shows login link", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText("Log In")).toBeVisible();
    await page.getByText("Log In").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("forgot password link navigates correctly", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Forgot password").click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("login form shows validation on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.locator("input[type='email']")).toBeFocused();
  });
});
