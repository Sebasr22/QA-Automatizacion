import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  projects: [
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL: "https://pokeapi.co/api/v2/",
      },
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: {
        baseURL: "https://www.saucedemo.com",
        browserName: "chromium",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        launchOptions: {
          slowMo: Number(process.env.SLOW_MO) || 0,
        },
      },
    },
  ],
});
