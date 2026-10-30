import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { USERS } from '@data/users';
import { STORAGE_STATE } from '@data/env';

setup('authenticate standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await new InventoryPage(page).expectLoaded();
  await page.context().storageState({ path: STORAGE_STATE });
});
