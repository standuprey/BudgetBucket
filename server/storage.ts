import { 
  type BudgetCategory, 
  type InsertBudgetCategory,
  type Expense,
  type InsertExpense,
  type MonthlyBudget,
  type InsertMonthlyBudget
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Budget Categories
  getBudgetCategories(): Promise<BudgetCategory[]>;
  getBudgetCategory(id: string): Promise<BudgetCategory | undefined>;
  createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(id: string, category: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined>;
  
  // Expenses
  getExpenses(month?: string): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;
  
  // Monthly Budgets
  getMonthlyBudget(month: string): Promise<MonthlyBudget | undefined>;
  createMonthlyBudget(budget: InsertMonthlyBudget): Promise<MonthlyBudget>;
  updateMonthlyBudget(month: string, budget: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, BudgetCategory>;
  private expenses: Map<string, Expense>;
  private monthlyBudgets: Map<string, MonthlyBudget>;

  constructor() {
    this.categories = new Map();
    this.expenses = new Map();
    this.monthlyBudgets = new Map();
  }

  // Budget Categories
  async getBudgetCategories(): Promise<BudgetCategory[]> {
    return Array.from(this.categories.values());
  }

  async getBudgetCategory(id: string): Promise<BudgetCategory | undefined> {
    return this.categories.get(id);
  }

  async createBudgetCategory(insertCategory: InsertBudgetCategory): Promise<BudgetCategory> {
    const id = randomUUID();
    const category: BudgetCategory = { 
      id,
      name: insertCategory.name,
      monthlyBudget: insertCategory.monthlyBudget,
      icon: insertCategory.icon || "DollarSign"
    };
    this.categories.set(id, category);
    return category;
  }

  async updateBudgetCategory(id: string, updates: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updated: BudgetCategory = { ...category, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  // Expenses
  async getExpenses(month?: string): Promise<Expense[]> {
    const allExpenses = Array.from(this.expenses.values());
    if (!month) return allExpenses;
    
    // Filter by month (format: YYYY-MM)
    return allExpenses.filter(expense => {
      return expense.date.startsWith(month);
    });
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      id,
      amount: insertExpense.amount,
      categoryId: insertExpense.categoryId,
      date: insertExpense.date,
      notes: insertExpense.notes || null,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Monthly Budgets
  async getMonthlyBudget(month: string): Promise<MonthlyBudget | undefined> {
    return this.monthlyBudgets.get(month);
  }

  async createMonthlyBudget(insertBudget: InsertMonthlyBudget): Promise<MonthlyBudget> {
    const id = randomUUID();
    const budget: MonthlyBudget = {
      ...insertBudget,
      id,
      createdAt: new Date(),
    };
    this.monthlyBudgets.set(insertBudget.month, budget);
    return budget;
  }

  async updateMonthlyBudget(month: string, updates: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined> {
    const budget = this.monthlyBudgets.get(month);
    if (!budget) return undefined;
    
    const updated: MonthlyBudget = { ...budget, ...updates };
    this.monthlyBudgets.set(month, updated);
    return updated;
  }
}

export const storage = new MemStorage();
