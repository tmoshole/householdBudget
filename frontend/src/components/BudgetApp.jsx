import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  Users,
  Home,
  PiggyBank,
  ShieldAlert,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatMoney, parseAmount } from "@/lib/format";
import { TID } from "@/constants/testIds";
import { EditableLabel } from "@/components/EditableLabel";
import { MoneyInput } from "@/components/MoneyInput";

const CURRENCIES = [
  { symbol: "R", label: "ZAR — South African Rand (R)" },
  { symbol: "$", label: "USD — US Dollar ($)" },
  { symbol: "€", label: "EUR — Euro (€)" },
  { symbol: "£", label: "GBP — Pound (£)" },
  { symbol: "₹", label: "INR — Rupee (₹)" },
  { symbol: "A$", label: "AUD — Australian Dollar (A$)" },
];

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const DEFAULTS = {
  currency: "R",
  people: { a: "Person A", b: "Person B" },
  incomes: { a: "", b: "" },
  individual: [],
  household: [],
  savings: [],
  emergency: [],
};

/* ---------------- Section wrapper ---------------- */
const Section = ({ icon: Icon, title, subtitle, action, children }) => (
  <section className="relative mt-14 first:mt-0">
    <header className="mb-5 flex items-end justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </header>
    <div className="card-tactile rounded-xl p-5 md:p-6">{children}</div>
  </section>
);

const SubtotalRow = ({ label, value, symbol, testId, emphasis = false }) => (
  <div
    className={`flex items-center justify-between border-t border-border pt-3 ${
      emphasis ? "mt-2" : "mt-1"
    }`}
  >
    <span
      className={`text-sm ${
        emphasis ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
    <span
      data-testid={testId}
      className={`font-mono-nums ${
        emphasis
          ? "text-base md:text-lg font-semibold text-foreground"
          : "text-sm text-foreground"
      }`}
    >
      {formatMoney(value, symbol)}
    </span>
  </div>
);

/* ---------------- Expense row primitives ---------------- */
const NamedAmountRow = ({
  row,
  onChange,
  onDelete,
  symbol,
  nameTid,
  amountTid,
  deleteTid,
  rowTid,
  extra,
  namePlaceholder = "Description",
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -6, height: 0 }}
    animate={{ opacity: 1, y: 0, height: "auto" }}
    exit={{ opacity: 0, y: -6, height: 0 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
    data-testid={rowTid}
    className="overflow-hidden"
  >
    <div className="grid grid-cols-12 gap-2 md:gap-3 items-center py-2">
      <div className={extra ? "col-span-12 md:col-span-5" : "col-span-12 md:col-span-7"}>
        <Input
          type="text"
          data-testid={nameTid}
          value={row.name}
          placeholder={namePlaceholder}
          onChange={(e) => onChange({ ...row, name: e.target.value })}
          className="bg-background border-border focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      {extra && <div className="col-span-7 md:col-span-3">{extra}</div>}
      <div className={extra ? "col-span-4 md:col-span-3" : "col-span-9 md:col-span-4"}>
        <MoneyInput
          symbol={symbol}
          value={row.amount}
          onChange={(v) => onChange({ ...row, amount: v })}
          testId={amountTid}
        />
      </div>
      <div className={`${extra ? "col-span-1" : "col-span-3 md:col-span-1"} flex justify-end`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          data-testid={deleteTid}
          aria-label="Delete row"
          className="btn-lift text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </motion.div>
);

/* ---------------- Main component ---------------- */
export default function BudgetApp() {
  const [state, setState] = useLocalStorage("budget-app.v1", DEFAULTS);

  // hydrate any missing keys (forward-compat)
  const safe = { ...DEFAULTS, ...state, people: { ...DEFAULTS.people, ...(state.people || {}) }, incomes: { ...DEFAULTS.incomes, ...(state.incomes || {}) } };
  const { currency, people, incomes, individual, household, savings, emergency } = safe;

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  /* ---- Derived totals ---- */
  const totals = useMemo(() => {
    const incomeA = parseAmount(incomes.a);
    const incomeB = parseAmount(incomes.b);
    const totalIncome = incomeA + incomeB;

    const subA = individual
      .filter((r) => r.person === "a")
      .reduce((s, r) => s + parseAmount(r.amount), 0);
    const subB = individual
      .filter((r) => r.person === "b")
      .reduce((s, r) => s + parseAmount(r.amount), 0);
    const individualTotal = subA + subB;

    const householdTotal = household.reduce(
      (s, r) => s + parseAmount(r.amount),
      0
    );
    const savingsTotal = savings.reduce(
      (s, r) => s + parseAmount(r.amount),
      0
    );
    const emergencyTotal = emergency.reduce(
      (s, r) => s + parseAmount(r.amount),
      0
    );

    const totalExpenses =
      individualTotal + householdTotal + savingsTotal + emergencyTotal;
    const remaining = totalIncome - totalExpenses;

    return {
      incomeA,
      incomeB,
      totalIncome,
      subA,
      subB,
      individualTotal,
      householdTotal,
      savingsTotal,
      emergencyTotal,
      totalExpenses,
      remaining,
    };
  }, [incomes, individual, household, savings, emergency]);

  /* ---- Row mutators ---- */
  const addRow = (key, extra = {}) =>
    set({ [key]: [...safe[key], { id: uid(), name: "", amount: "", ...extra }] });

  const updateRow = (key, id, next) =>
    set({ [key]: safe[key].map((r) => (r.id === id ? next : r)) });

  const deleteRow = (key, id) =>
    set({ [key]: safe[key].filter((r) => r.id !== id) });

  const resetAll = () => {
    setState({ ...DEFAULTS });
    toast.success("Budget reset", { description: "All entries cleared." });
  };

  const remainingPositive = totals.remaining >= 0;

  return (
    <div
      data-testid={TID.app}
      className="paper-grain min-h-screen bg-background text-foreground"
    >
      <Toaster position="top-center" richColors />

      {/* Sticky summary header */}
      <div className="sticky top-0 z-40 summary-glass border-b border-border">
        <div
          data-testid={TID.summaryCard}
          className="mx-auto max-w-4xl px-5 md:px-8 py-4 flex items-center gap-4 md:gap-8 flex-wrap"
        >
          <div className="flex items-center gap-3 mr-auto">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <div className="font-serif-display text-lg leading-tight">
                Household Budget
              </div>
              <div className="text-xs text-muted-foreground -mt-0.5">
                Two-person planner
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <SummaryStat
              label="Income"
              value={totals.totalIncome}
              symbol={currency}
              testId={TID.summaryIncome}
              tone="neutral"
            />
            <SummaryStat
              label="Expenses"
              value={totals.totalExpenses}
              symbol={currency}
              testId={TID.summaryExpenses}
              tone="neutral"
            />
            <SummaryStat
              label="Remaining"
              value={totals.remaining}
              symbol={currency}
              testId={TID.summaryRemaining}
              tone={remainingPositive ? "positive" : "negative"}
              emphasis
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={currency}
              onValueChange={(v) => set({ currency: v })}
            >
              <SelectTrigger
                data-testid={TID.currencySelect}
                className="w-[80px] bg-background font-mono-nums"
                aria-label="Currency"
              >
                <SelectValue>{currency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.symbol} value={c.symbol}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAll}
              data-testid={TID.resetBtn}
              aria-label="Reset all"
              className="btn-lift text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Reset all entries"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="md:hidden mx-auto max-w-4xl px-5 pb-4 grid grid-cols-3 gap-3">
          <SummaryStat
            label="Income"
            value={totals.totalIncome}
            symbol={currency}
            testId={`${TID.summaryIncome}-mobile`}
            tone="neutral"
            compact
          />
          <SummaryStat
            label="Expenses"
            value={totals.totalExpenses}
            symbol={currency}
            testId={`${TID.summaryExpenses}-mobile`}
            tone="neutral"
            compact
          />
          <SummaryStat
            label="Remaining"
            value={totals.remaining}
            symbol={currency}
            testId={`${TID.summaryRemaining}-mobile`}
            tone={remainingPositive ? "positive" : "negative"}
            emphasis
            compact
          />
        </div>
      </div>

      {/* Main body */}
      <main className="relative z-10 mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-foreground">
            Plan the month, <span className="italic text-primary">together</span>.
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            A quiet space for two. Enter what comes in, what goes out, and see
            what's left — updated the moment you type.
          </p>
        </div>

        {/* 1. Income */}
        <Section
          icon={Wallet}
          title="Income"
          subtitle="What each of you brings in this month."
        >
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { key: "a", tidLabel: TID.personALabel, tidInput: TID.incomeA },
              { key: "b", tidLabel: TID.personBLabel, tidInput: TID.incomeB },
            ].map(({ key, tidLabel, tidInput }) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-background/60 p-4"
              >
                <div className="mb-2 text-xs tracking-widest text-muted-foreground">
                  <EditableLabel
                    value={people[key]}
                    testId={tidLabel}
                    onChange={(v) =>
                      set({ people: { ...people, [key]: v } })
                    }
                    className="text-foreground/80 text-sm font-medium"
                  />
                </div>
                <MoneyInput
                  symbol={currency}
                  value={incomes[key]}
                  onChange={(v) => set({ incomes: { ...incomes, [key]: v } })}
                  testId={tidInput}
                />
              </div>
            ))}
          </div>
          <SubtotalRow
            label="Total income"
            value={totals.totalIncome}
            symbol={currency}
            testId={TID.totalIncome}
            emphasis
          />
        </Section>

        {/* 2. Individual expenses */}
        <Section
          icon={Users}
          title="Individual expenses"
          subtitle="Things each person pays for on their own."
          action={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addRow("individual", { person: "a" })}
                data-testid={TID.addIndividualA}
                className="btn-lift border-border"
              >
                <Plus className="h-4 w-4" /> {people.a}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addRow("individual", { person: "b" })}
                data-testid={TID.addIndividualB}
                className="btn-lift border-border"
              >
                <Plus className="h-4 w-4" /> {people.b}
              </Button>
            </div>
          }
        >
          {individual.length === 0 ? (
            <EmptyRow text="No individual expenses yet. Add one for either person to begin." />
          ) : (
            <AnimatePresence initial={false}>
              {individual.map((row) => (
                <NamedAmountRow
                  key={row.id}
                  row={row}
                  symbol={currency}
                  onChange={(next) => updateRow("individual", row.id, next)}
                  onDelete={() => deleteRow("individual", row.id)}
                  rowTid={TID.individualRow(row.id)}
                  nameTid={TID.individualName(row.id)}
                  amountTid={TID.individualAmount(row.id)}
                  deleteTid={TID.individualDelete(row.id)}
                  namePlaceholder="e.g. Gym, phone, coffee"
                  extra={
                    <Select
                      value={row.person}
                      onValueChange={(v) =>
                        updateRow("individual", row.id, { ...row, person: v })
                      }
                    >
                      <SelectTrigger
                        data-testid={TID.individualPerson(row.id)}
                        className="bg-background"
                        aria-label="Assign to person"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">{people.a}</SelectItem>
                        <SelectItem value="b">{people.b}</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              ))}
            </AnimatePresence>
          )}

          <div className="mt-4 grid gap-2">
            <SubtotalRow
              label={`${people.a} subtotal`}
              value={totals.subA}
              symbol={currency}
              testId={TID.subtotalA}
            />
            <SubtotalRow
              label={`${people.b} subtotal`}
              value={totals.subB}
              symbol={currency}
              testId={TID.subtotalB}
            />
            <SubtotalRow
              label="Individual expenses total"
              value={totals.individualTotal}
              symbol={currency}
              testId={TID.individualTotal}
              emphasis
            />
          </div>
        </Section>

        {/* 3. Household */}
        <Section
          icon={Home}
          title="Household expenses"
          subtitle="Shared costs — rent, groceries, utilities…"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => addRow("household")}
              data-testid={TID.addHousehold}
              className="btn-lift border-border"
            >
              <Plus className="h-4 w-4" /> Add expense
            </Button>
          }
        >
          {household.length === 0 ? (
            <EmptyRow text="No shared expenses yet. Add one to get started." />
          ) : (
            <AnimatePresence initial={false}>
              {household.map((row) => (
                <NamedAmountRow
                  key={row.id}
                  row={row}
                  symbol={currency}
                  onChange={(next) => updateRow("household", row.id, next)}
                  onDelete={() => deleteRow("household", row.id)}
                  rowTid={TID.householdRow(row.id)}
                  nameTid={TID.householdName(row.id)}
                  amountTid={TID.householdAmount(row.id)}
                  deleteTid={TID.householdDelete(row.id)}
                  namePlaceholder="e.g. Rent, groceries, electricity"
                />
              ))}
            </AnimatePresence>
          )}
          <SubtotalRow
            label="Household total"
            value={totals.householdTotal}
            symbol={currency}
            testId={TID.householdTotal}
            emphasis
          />
        </Section>

        {/* 4. Savings */}
        <Section
          icon={PiggyBank}
          title="Savings"
          subtitle="Planned monthly contributions toward your goals."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => addRow("savings")}
              data-testid={TID.addSavings}
              className="btn-lift border-border"
            >
              <Plus className="h-4 w-4" /> Add contribution
            </Button>
          }
        >
          {savings.length === 0 ? (
            <EmptyRow text="No savings contributions yet." />
          ) : (
            <AnimatePresence initial={false}>
              {savings.map((row) => (
                <NamedAmountRow
                  key={row.id}
                  row={row}
                  symbol={currency}
                  onChange={(next) => updateRow("savings", row.id, next)}
                  onDelete={() => deleteRow("savings", row.id)}
                  rowTid={TID.savingsRow(row.id)}
                  nameTid={TID.savingsName(row.id)}
                  amountTid={TID.savingsAmount(row.id)}
                  deleteTid={TID.savingsDelete(row.id)}
                  namePlaceholder="e.g. Retirement, holiday fund"
                />
              ))}
            </AnimatePresence>
          )}
          <SubtotalRow
            label="Savings total"
            value={totals.savingsTotal}
            symbol={currency}
            testId={TID.savingsTotal}
            emphasis
          />
        </Section>

        {/* 5. Emergency fund */}
        <Section
          icon={ShieldAlert}
          title="Emergency fund"
          subtitle="Your rainy-day cushion."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => addRow("emergency")}
              data-testid={TID.addEmergency}
              className="btn-lift border-border"
            >
              <Plus className="h-4 w-4" /> Add contribution
            </Button>
          }
        >
          {emergency.length === 0 ? (
            <EmptyRow text="No emergency fund contributions yet." />
          ) : (
            <AnimatePresence initial={false}>
              {emergency.map((row) => (
                <NamedAmountRow
                  key={row.id}
                  row={row}
                  symbol={currency}
                  onChange={(next) => updateRow("emergency", row.id, next)}
                  onDelete={() => deleteRow("emergency", row.id)}
                  rowTid={TID.emergencyRow(row.id)}
                  nameTid={TID.emergencyName(row.id)}
                  amountTid={TID.emergencyAmount(row.id)}
                  deleteTid={TID.emergencyDelete(row.id)}
                  namePlaceholder="e.g. Buffer, medical"
                />
              ))}
            </AnimatePresence>
          )}
          <SubtotalRow
            label="Emergency fund total"
            value={totals.emergencyTotal}
            symbol={currency}
            testId={TID.emergencyTotal}
            emphasis
          />
        </Section>

        {/* Bottom recap card */}
        <section className="mt-14">
          <div className="card-tactile rounded-xl p-6 md:p-8">
            <h2 className="font-serif-display text-2xl md:text-3xl">
              This month at a glance
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <RecapCell
                label="Total income"
                value={totals.totalIncome}
                symbol={currency}
              />
              <RecapCell
                label="Total expenses"
                value={totals.totalExpenses}
                symbol={currency}
              />
              <RecapCell
                label={remainingPositive ? "Remaining" : "Shortfall"}
                value={totals.remaining}
                symbol={currency}
                tone={remainingPositive ? "positive" : "negative"}
                emphasis
              />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {remainingPositive
                ? "Nicely done — there's room to spare. Consider bumping savings or the emergency fund."
                : "Expenses exceed income this month. Trim a category or revisit your plan."}
            </p>
          </div>
        </section>

        <footer className="mt-14 text-center text-xs text-muted-foreground">
          Everything is saved locally in your browser. No account, no cloud.
        </footer>
      </main>
    </div>
  );
}

/* ---------------- Small pieces ---------------- */
const EmptyRow = ({ text }) => (
  <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-md bg-background/40">
    {text}
  </div>
);

const SummaryStat = ({ label, value, symbol, testId, tone, emphasis, compact }) => {
  const color =
    tone === "positive"
      ? "text-primary"
      : tone === "negative"
      ? "text-destructive"
      : "text-foreground";
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        data-testid={testId}
        className={`font-mono-nums ${
          emphasis
            ? compact
              ? "text-base font-semibold"
              : "text-xl md:text-2xl font-semibold"
            : compact
            ? "text-sm"
            : "text-base md:text-lg"
        } ${color}`}
      >
        {formatMoney(value, symbol)}
      </span>
    </div>
  );
};

const RecapCell = ({ label, value, symbol, tone = "neutral", emphasis }) => {
  const color =
    tone === "positive"
      ? "text-primary"
      : tone === "negative"
      ? "text-destructive"
      : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-background/60 p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-2 font-mono-nums ${
          emphasis ? "text-3xl md:text-4xl font-semibold" : "text-2xl"
        } ${color}`}
      >
        {formatMoney(value, symbol)}
      </div>
    </div>
  );
};
