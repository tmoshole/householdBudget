// Central data-testid registry for the budget app.
export const TID = {
  // App scaffolding
  app: "budget-app",
  summaryCard: "summary-card",
  summaryIncome: "summary-total-income",
  summaryExpenses: "summary-total-expenses",
  summaryRemaining: "summary-remaining",
  currencySelect: "currency-select",
  resetBtn: "reset-all-btn",

  // Person labels
  personALabel: "person-a-label",
  personBLabel: "person-b-label",

  // Income
  incomeA: "income-a-input",
  incomeB: "income-b-input",
  totalIncome: "total-income",

  // Individual expenses
  addIndividualA: "add-individual-expense-a",
  addIndividualB: "add-individual-expense-b",
  individualRow: (id) => `individual-row-${id}`,
  individualName: (id) => `individual-name-${id}`,
  individualAmount: (id) => `individual-amount-${id}`,
  individualPerson: (id) => `individual-person-${id}`,
  individualDelete: (id) => `individual-delete-${id}`,
  subtotalA: "individual-subtotal-a",
  subtotalB: "individual-subtotal-b",
  individualTotal: "individual-total",

  // Household
  addHousehold: "add-household-expense",
  householdRow: (id) => `household-row-${id}`,
  householdName: (id) => `household-name-${id}`,
  householdAmount: (id) => `household-amount-${id}`,
  householdDelete: (id) => `household-delete-${id}`,
  householdTotal: "household-total",

  // Savings
  addSavings: "add-savings",
  savingsRow: (id) => `savings-row-${id}`,
  savingsName: (id) => `savings-name-${id}`,
  savingsAmount: (id) => `savings-amount-${id}`,
  savingsDelete: (id) => `savings-delete-${id}`,
  savingsTotal: "savings-total",

  // Emergency fund
  addEmergency: "add-emergency",
  emergencyRow: (id) => `emergency-row-${id}`,
  emergencyName: (id) => `emergency-name-${id}`,
  emergencyAmount: (id) => `emergency-amount-${id}`,
  emergencyDelete: (id) => `emergency-delete-${id}`,
  emergencyTotal: "emergency-total",
};
