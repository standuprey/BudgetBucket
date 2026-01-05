import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const budgetCategories = sqliteTable("budget_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  monthlyBudget: real("monthly_budget").notNull(), // This will be monthly if isAnnual is false, or annual if true
  icon: text("icon").notNull().default("DollarSign"),
  isAnnual: integer("is_annual", { mode: "boolean" }).notNull().default(false),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: real("amount").notNull(),
  categoryId: text("category_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const monthlyBudgets = sqliteTable("monthly_budgets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  month: text("month").notNull().unique(), // Format: YYYY-MM
  totalIncome: real("total_income").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories, {
  monthlyBudget: z.coerce.number(),
}).omit({
  id: true,
});

export const insertExpenseSchema = createInsertSchema(expenses, {
  amount: z.coerce.number(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertMonthlyBudgetSchema = createInsertSchema(monthlyBudgets, {
  totalIncome: z.coerce.number(),
}).omit({
  id: true,
  createdAt: true,
});

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type MonthlyBudget = typeof monthlyBudgets.$inferSelect;
export type InsertMonthlyBudget = z.infer<typeof insertMonthlyBudgetSchema>;
