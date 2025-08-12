import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // The default Vite title is "Vite + React + TS"
  // Let's check for our app's title instead
  await expect(page.locator('h1')).toHaveText(/Habit Tracker/);
});

test('can add a habit', async ({ page }) => {
  await page.goto('/');

  // Click the add habit button
  await page.getByRole('button', { name: /Add Habit/i }).click();

  // Fill in the form
  await page.getByLabel('Name').fill('Read a book');
  await page.getByLabel('Description').fill('Read for 15 minutes');

  // Save the habit
  await page.getByRole('button', { name: /Save Habit/i }).click();

  // Check that the habit appears on the dashboard
  await expect(page.getByText('Read a book')).toBeVisible();
});
