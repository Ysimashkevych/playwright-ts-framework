import { defineConfig, devices } from '@playwright/test';
import { API_BASE_URL, STORAGE_STATE, UI_BASE_URL } from './src/data/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: UI_BASE_URL },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: UI_BASE_URL,
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL },
    },
  ],
});
