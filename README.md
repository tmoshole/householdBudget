# Household Budget

A single-page budgeting app for a two-person household. No login, no backend — all state lives in the browser (localStorage). Track income, individual expenses, household expenses, savings, and an emergency fund, with live totals and a color-coded remaining balance.

See [memory/PRD.md](memory/PRD.md) for the full product spec and architecture notes.

## Project structure

- [frontend/](frontend/) — the app itself (React + CRA/craco + Tailwind + shadcn/ui). This is what gets deployed.
- [backend/](backend/) — an unused FastAPI/Mongo stub left over from scaffolding. The frontend doesn't call it; safe to ignore or delete.

## Local development

```bash
cd frontend
yarn install
yarn start
```

Opens at http://localhost:3000.

## Deploying to Vercel

The app is a static, frontend-only build — no environment variables or backend required.

1. Import this repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Vercel will pick up [frontend/vercel.json](frontend/vercel.json) (framework: Create React App, build: `yarn build`, output: `build`).
4. Deploy.

Alternatively, via the CLI:

```bash
cd frontend
vercel --prod
```
