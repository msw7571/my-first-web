import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';
const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

test.describe('Auth CRUD', () => {
  test.skip(!testEmail || !testPassword, 'TEST_EMAIL and TEST_PASSWORD environment variables are required.');

  test('happy path: login, create post, verify in list', async ({ page }) => {
    const postTitle = `E2E Test Post ${Date.now()}`;
    const postContent = '이 게시글은 Playwright E2E 테스트용으로 작성되었습니다.';

    await page.goto(`${baseURL}/login`);
    await expect(page).toHaveURL(`${baseURL}/login`);

    await page.getByLabel('이메일').fill(testEmail!);
    await page.getByLabel('비밀번호').fill(testPassword!);
    await page.getByRole('button', { name: '로그인' }).click();

    await page.waitForURL(`${baseURL}/posts`);
    await expect(page).toHaveURL(`${baseURL}/posts`);

    await page.goto(`${baseURL}/posts/new`);
    await expect(page).toHaveURL(`${baseURL}/posts/new`);

    await page.getByLabel('제목').fill(postTitle);
    await page.getByLabel('내용').fill(postContent);
    await page.getByRole('button', { name: '작성 완료' }).click();

    await page.waitForURL(/\/posts\/.+/);
    await expect(page.url()).toMatch(/\/posts\/.+/);

    await page.goto(`${baseURL}/posts`);
    await expect(page.getByRole('link', { name: postTitle })).toBeVisible();
  });

  test('denied path: unauthenticated user is redirected from /posts/new to /login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${baseURL}/posts/new`);
    await expect(page).toHaveURL(/\/login$/);

    await context.close();
  });
});
