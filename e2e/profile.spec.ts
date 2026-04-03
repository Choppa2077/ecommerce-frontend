import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test('should redirect /profile to login when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect /profile/edit to login when not authenticated', async ({ page }) => {
    await page.goto('/profile/edit');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Protected Routes — redirect unauthenticated users', () => {
  const protectedRoutes = ['/', '/profile', '/profile/edit', '/purchases', '/favorites', '/products'];

  for (const route of protectedRoutes) {
    test(`should redirect ${route} to login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/login/);
    });
  }
});

test.describe('Register Page Structure', () => {
  test('should show register form with required fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/register/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should stay on register page after empty submit', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/register/);
  });
});
