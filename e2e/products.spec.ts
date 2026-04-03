import { test, expect } from '@playwright/test';

// These tests verify UI structure without requiring a live backend.
// Products page requires auth — unauthenticated users are redirected to /login.

test.describe('Products Page (unauthenticated)', () => {
  test('should redirect /products to login when not authenticated', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect product detail page to login when not authenticated', async ({ page }) => {
    await page.goto('/products/1');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Login Page Structure', () => {
  test('should have email and password inputs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should have a submit button', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('login form should have two inputs', async ({ page }) => {
    await page.goto('/login');
    const inputs = page.locator('input');
    await expect(inputs).toHaveCount(2);
  });
});
