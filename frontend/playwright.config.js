import { defineConfig } from '@playwright/test'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium' },
  webServer: [
    {
      command: `${process.env.PYTHON || 'python'} -m uvicorn backend.main:app --host 127.0.0.1 --port 8000`,
      cwd: projectRoot,
      url: 'http://127.0.0.1:8000/api/categorias',
      reuseExistingServer: !process.env.CI,
      env: { DB_PATH: path.join(projectRoot, '.e2e-db.json') },
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
})
