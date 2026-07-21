# Household Budget — PRD

## Original problem statement
Single-page personal budgeting web app for a two-person household. No login, no backend — all state in the browser. Clean, modern UI.

Five core sections: Income (per person), Individual expenses (assigned to A or B), Household expenses (shared), Savings, Emergency fund. Live totals, remaining balance in green if positive / red if negative. Currency defaulting to R (South African Rand). Responsive, one page.

## User choices confirmed
- Editable person labels (inline rename)
- LocalStorage persistence
- Warm/earthy visual style
- Default currency: ZAR (R)

## Architecture
- **Stack**: React (CRA + craco) + Tailwind + Shadcn UI + framer-motion + lucide-react + sonner. No backend/API.
- **Entry**: `frontend/src/App.js` mounts `components/BudgetApp.jsx`.
- **State**: single object stored in localStorage under key `budget-app.v1` via `hooks/useLocalStorage.js`.
- **Formatting**: `lib/format.js` — `formatMoney(amount, symbol)` + `parseAmount(raw)`.
- **Test IDs**: centralized in `constants/testIds.js`.
- **Design**: Earthy cream (`#FDFBF7`) + sage (`#6A7B62`) + terracotta (`#C56B55`). Playfair Display serif headings, Manrope body, JetBrains Mono for numbers. Sticky glass summary header.

## Personas
- A couple/roommates planning a shared monthly budget together on one device or their own devices independently.

## What's been implemented (Feb 2026)
- Sticky glass summary header with live Total Income / Total Expenses / Remaining (color-coded).
- Editable Person A / Person B labels propagated to all sections & subtotals.
- Income section (2 inputs + total).
- Individual expenses: add rows per person, per-person select on each row, per-person subtotals + combined total, delete per row.
- Household expenses: dynamic add/delete, subtotal.
- Savings: dynamic add/delete, subtotal.
- Emergency fund: dynamic add/delete, subtotal.
- Currency selector (R / $ / € / £ / ₹ / A$), default R.
- LocalStorage persistence across reloads.
- Reset-all button (clears everything back to defaults, with toast confirmation).
- Bottom "This month at a glance" recap card with a friendly hint based on positive/negative balance.
- Row entrance/exit animations via framer-motion.
- Responsive layout with mobile-specific summary stats row.
- All interactive elements carry `data-testid` attributes.

## Testing status
- `testing_agent_v3` iteration 1: 13/13 frontend scenarios pass (see `/app/test_reports/iteration_1.json`). One cosmetic uppercase-CSS issue on person labels was fixed post-report.

## Backlog / next
- P1: Optional monthly snapshot / export to CSV or JSON.
- P1: Dark-mode toggle (theme already defined in `index.css`).
- P2: Split BudgetApp.jsx into smaller files under `components/budget/`.
- P2: Duplicate-last-month button or template starter rows.
- P2: Optional chart (savings vs expenses) — deferred per v1 spec.
