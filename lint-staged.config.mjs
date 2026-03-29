export default {
  // React + Vite (web) — ESLint on staged files
  'apps/web/**/*.{ts,tsx}': (filenames) => [
    `cd apps/web && npx eslint --fix ${filenames.map((f) => f.replace(/.*apps\/web\//, '')).join(' ')}`,
  ],

  // Python + FastAPI (api) — Ruff lint + format on staged files
  'apps/api/**/*.py': (filenames) => [
    `cd apps/api && uv run ruff check --fix ${filenames.map((f) => f.replace(/.*apps\/api\//, '')).join(' ')}`,
    `cd apps/api && uv run ruff format ${filenames.map((f) => f.replace(/.*apps\/api\//, '')).join(' ')}`,
  ],
};
