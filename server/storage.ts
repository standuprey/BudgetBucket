import { 
  type BudgetCategory, 
  type InsertBudgetCategory,
  type Expense,
  type InsertExpense,
  type MonthlyBudget,
  type InsertMonthlyBudget
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { budgetCategories, expenses, monthlyBudgets } from "@shared/schema";

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
  getMonthlyBudgets(): Promise<MonthlyBudget[]>;
  createMonthlyBudget(budget: InsertMonthlyBudget): Promise<MonthlyBudget>;
  updateMonthlyBudget(month: string, budget: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined>;
  deleteBudgetCategory(id: string): Promise<boolean>;
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
    const id = crypto.randomUUID();
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

  async deleteBudgetCategory(id: string): Promise<boolean> {
    const deleted = this.categories.delete(id);
    if (deleted) {
      // Also delete associated expenses
      for (const [expenseId, expense] of Array.from(this.expenses.entries())) {
        if (expense.categoryId === id) {
          this.expenses.delete(expenseId);
        }
      }
    }
    return deleted;
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
    const id = crypto.randomUUID();
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

  async getMonthlyBudgets(): Promise<MonthlyBudget[]> {
    return Array.from(this.monthlyBudgets.values());
  }

  async createMonthlyBudget(insertBudget: InsertMonthlyBudget): Promise<MonthlyBudget> {
    const id = crypto.randomUUID();
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

import { createDb, DbType } from "./db";

// ... imports ...

export class DatabaseStorage implements IStorage {
  private db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  // Budget Categories
  async getBudgetCategories(): Promise<BudgetCategory[]> {
    return await this.db.select().from(budgetCategories);
  }

  async getBudgetCategory(id: string): Promise<BudgetCategory | undefined> {
    const [category] = await this.db.select().from(budgetCategories).where(eq(budgetCategories.id, id));
    return category;
  }

  async createBudgetCategory(insertCategory: InsertBudgetCategory): Promise<BudgetCategory> {
    const [category] = await this.db
      .insert(budgetCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateBudgetCategory(id: string, updates: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined> {
    const [category] = await this.db
      .update(budgetCategories)
      .set(updates)
      .where(eq(budgetCategories.id, id))
      .returning();
    return category;
  }

  async deleteBudgetCategory(id: string): Promise<boolean> {
    // Start by deleting associated expenses to maintain referential integrity
    await this.db
      .delete(expenses)
      .where(eq(expenses.categoryId, id));

    const [deleted] = await this.db
      .delete(budgetCategories)
      .where(eq(budgetCategories.id, id))
      .returning();
    return !!deleted;
  }

  // Expenses
  async getExpenses(month?: string): Promise<Expense[]> {
    const query = this.db.select().from(expenses);
    if (month) {
      const all = await query;
      return all.filter(e => e.date.startsWith(month));
    }
    return await query;
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const [expense] = await this.db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await this.db
      .insert(expenses)
      .values(insertExpense)
      .returning();
    return expense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();
    return !!deleted;
  }

  // Monthly Budgets
  async getMonthlyBudget(month: string): Promise<MonthlyBudget | undefined> {
    const [budget] = await this.db.select().from(monthlyBudgets).where(eq(monthlyBudgets.month, month));
    return budget;
  }

  async getMonthlyBudgets(): Promise<MonthlyBudget[]> {
    return await this.db.select().from(monthlyBudgets);
  }

  async createMonthlyBudget(insertBudget: InsertMonthlyBudget): Promise<MonthlyBudget> {
    const [budget] = await this.db
      .insert(monthlyBudgets)
      .values(insertBudget)
      .returning();
    return budget;
  }

  async updateMonthlyBudget(month: string, updates: Partial<InsertMonthlyBudget>): Promise<MonthlyBudget | undefined> {
    const [budget] = await this.db
      .update(monthlyBudgets)
      .set(updates)
      .where(eq(monthlyBudgets.month, month))
      .returning();
    return budget;
  }
}

// Export a factory or allow manual instantiation
export const createStorage = (connection?: any) => {
  if (connection) {
    const db = createDb(connection);
    return new DatabaseStorage(db);
  }
  return new MemStorage();
};

// Keep global storage for backward compatibility if env is set, otherwise MemStorage
// For Cloudflare, this global is less useful as we inject D1, but we keep it for now.
export const storage = new MemStorage();

