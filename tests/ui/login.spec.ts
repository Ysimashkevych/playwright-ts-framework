import { test, expect } from '@fixtures/index';
import { USERS } from '@data/users';

// Login tests must start unauthenticated.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => loginPage.goto());

  test('standard user can log in', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await expect(loginPage.error).toContainText('this user has been locked out');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong');
    await expect(loginPage.error).toContainText('Username and password do not match');
  });

  test('empty username is rejected', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('empty password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    await expect(loginPage.error).toContainText('Password is required');
  });

  test('protected page redirects to login when unauthenticated', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
