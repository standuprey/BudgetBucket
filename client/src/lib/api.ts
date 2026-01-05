import type { BudgetCategory, Expense, MonthlyBudget } from "@shared/schema";

export async function initializeDefaultData(categories: any[], monthlyIncome: number, month: string) {
  const response = await fetch("/api/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories, monthlyIncome, month }),
  });
  if (!response.ok) throw new Error("Failed to initialize data");
  return response.json();
}

export async function getCategories(): Promise<BudgetCategory[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(category: {
  name: string;
  monthlyBudget: number;
  icon: string;
  isAnnual?: boolean;
}): Promise<BudgetCategory> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category");
}

export async function updateCategory(id: string, updates: Partial<BudgetCategory>) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
}

export async function getExpenses(month?: string): Promise<Expense[]> {
  const url = month ? `/api/expenses?month=${month}` : "/api/expenses";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
}

export async function createExpense(expense: {
  amount: string;
  categoryId: string;
  date: string;
  notes?: string;
}): Promise<Expense> {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...expense,
      amount: parseFloat(expense.amount),
    }),
  });
  if (!response.ok) throw new Error("Failed to create expense");
  return response.json();
}

export async function deleteExpense(id: string) {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete expense");
}

export async function getBudgets(): Promise<MonthlyBudget[]> {
  const response = await fetch("/api/budgets");
  if (!response.ok) throw new Error("Failed to fetch budgets");
  return response.json();
}

export async function getMonthlyBudget(month: string): Promise<MonthlyBudget | null> {
  const response = await fetch(`/api/budgets/${month}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to fetch monthly budget");
  return response.json();
}

export async function createMonthlyBudget(month: string, totalIncome: string) {
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ month, totalIncome }),
  });
  if (!response.ok) throw new Error("Failed to create monthly budget");
  return response.json();
}

export async function updateMonthlyBudget(month: string, totalIncome: string) {
  const response = await fetch(`/api/budgets/${month}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalIncome }),
  });
  if (!response.ok) throw new Error("Failed to update monthly budget");
  return response.json();
}
