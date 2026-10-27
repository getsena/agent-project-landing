import { defineConfig } from '@playwright/test'

// Los specs que abren la página corren contra el build local (yarn build && yarn start -p 39847),
// nunca contra producción. 39847 es el puerto convenido en .claude/rules/tests.md.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  reporter: 'line',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:39847',
    headless: true,
  },
})
