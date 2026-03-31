export default {
  // React + Vite (web) — ESLint on staged files
  'apps/web/**/*.{ts,tsx}': (filenames) => [
    `npx --prefix apps/web eslint --fix ${filenames.join(' ')}`,
  ],

  // Python + FastAPI (api) — Ruff lint + format on staged files
  'apps/api/**/*.py': (filenames) => [
    `uv run --project apps/api ruff check --fix ${filenames.join(' ')}`,
    `uv run --project apps/api ruff format ${filenames.join(' ')}`,
  ],
};
