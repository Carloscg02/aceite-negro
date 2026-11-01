import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;
const ROOT = dirname(fileURLToPath(import.meta.url));
const LOCAL_LIBS = join(ROOT, '.playwright-libs/usr/lib/x86_64-linux-gnu');

const launchEnv: Record<string, string> = { ...(process.env as Record<string, string>) };
if (existsSync(LOCAL_LIBS)) {
  launchEnv.LD_LIBRARY_PATH = launchEnv.LD_LIBRARY_PATH
    ? `${LOCAL_LIBS}:${launchEnv.LD_LIBRARY_PATH}`
    : LOCAL_LIBS;
}

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    launchOptions: {
      env: launchEnv,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
