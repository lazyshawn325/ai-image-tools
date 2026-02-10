import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display hero title', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /让创意在指尖/i })).toBeVisible();
    await expect(page.getByText(/无限延伸/i)).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('link', { name: /图片压缩/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /格式转换/i }).first()).toBeVisible();
  });

  test('should navigate to tools', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: /立即开始/i }).click();
    
    await expect(page).toHaveURL(/#tools/);
  });
});