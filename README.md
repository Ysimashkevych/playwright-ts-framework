# playwright-ts-framework

A compact, production-style test automation framework built with Playwright and TypeScript. It demonstrates UI automation against [SauceDemo](https://www.saucedemo.com) and API contract testing against [JSONPlaceholder](https://jsonplaceholder.typicode.com).

Author: Yurii Simashkevych, Senior/Lead SDET.

## Architecture overview

Three Playwright projects, defined in `playwright.config.ts`:

| Project | Purpose | Notes |
|---------|---------|-------|
| `setup` | Logs in once through the UI and saves `storageState` to `playwright/.auth/` | Runs before `ui` |
| `ui`    | Login, cart, checkout and error-state tests | Depends on `setup`; starts already authenticated |
| `api`   | Status, header and contract checks on `/posts` and `/users` | No browser, no dependency on `setup` |

Layers:

- **Page objects** (`src/pages`) hold locators and user-level actions. Assertions about page state live in small `expect*` helpers; test intent stays in the specs.
- **Fixtures** (`src/fixtures`) inject page objects (`index.ts`) and a typed API client (`api.ts`) into tests.
- **API client** (`src/api`) wraps the `/posts` resource and holds a lightweight runtime contract check (`isPost`).
- **Test data** (`src/data`) keeps public demo credentials and checkout info out of specs.
- **Path aliases** `@pages/*`, `@fixtures/*`, `@api/*`, `@data/*` are declared in `tsconfig.json` and resolved natively by Playwright.

## Running

```bash
npm ci
npx playwright install chromium

npm test            # everything (setup + ui + api)
npm run test:ui     # setup + ui
npm run test:api    # api only
npm run typecheck   # tsc --noEmit
npm run report      # open the Playwright HTML report
```

Docker (official Playwright image):

```bash
docker build -t playwright-ts-framework .
docker run --rm -v "$PWD/playwright-report:/app/playwright-report" playwright-ts-framework
```

The Docker base image tag should match the `@playwright/test` version in `package.json`.

## Reporting and CI

- Reporters: console list, Playwright HTML (`playwright-report/`).
- Traces are captured on first retry; screenshots and video are kept on failure.
- `.github/workflows/ci.yml` runs typecheck and tests on push, pull request and manual dispatch, then uploads the HTML report and (on failure) `test-results/` as artifacts.

## Design decisions

- **Authenticate once, reuse everywhere.** A setup project produces `storageState`, so UI specs skip the login form. Login specs opt out with an empty `storageState`.
- **Resilient locators.** `testIdAttribute` is set to `data-test` (what SauceDemo uses), and `getByTestId` is preferred over CSS or XPath. No hard sleeps: all waiting is through web-first assertions and `expect.poll`.
- **Fixtures over inheritance.** Page objects are composed via fixtures, so each test requests only what it needs and setup/teardown stays explicit.
- **Isolated test state.** Every test gets a fresh browser context; cart state does not leak between tests. JSONPlaceholder is a fake API (writes are echoed, not persisted), so write tests assert on the echoed response only.
- **Strict TypeScript.** `strict` and `noUncheckedIndexedAccess` are enabled; the typecheck runs in CI before the tests.
- **Separate UI and API projects** so they can run, fail and be filtered independently.
- **CI retries** (2) and `forbidOnly` apply only when `CI` is set, so local runs fail fast.

## Limitations

Both targets are public third-party demo sites. Tests depend on their availability and on their current behavior; a failure can come from the site rather than from the framework.

## Project layout

```
.
├── .github/workflows/ci.yml
├── Dockerfile
├── playwright.config.ts
├── tsconfig.json
├── src
│   ├── api/        # PostsClient, schemas / contract checks
│   ├── data/       # users and checkout data
│   ├── fixtures/   # UI and API fixtures
│   └── pages/      # Login, Inventory, Cart, Checkout page objects
└── tests
    ├── setup/      # auth.setup.ts (storageState)
    ├── ui/         # login.spec.ts, cart-checkout.spec.ts
    └── api/        # posts.spec.ts
```
