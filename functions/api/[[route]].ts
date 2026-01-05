import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { createStorage } from "../../server/storage";
import { insertBudgetCategorySchema, insertExpenseSchema, insertMonthlyBudgetSchema } from "@shared/schema";
import { z } from "zod";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// Middleware to inject storage could be used, but for now we'll create it in handlers
// or use a middleware to add it to context variables if we wanted to be fancy.
// Simple factory usage is fine.

// Budget Categories
app.get("/categories", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const categories = await storage.getBudgetCategories();
    return c.json(categories);
  } catch (error) {
    return c.json({ message: "Failed to fetch categories" }, 500);
  }
});

app.post("/categories", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const body = await c.req.json();
    const validated = insertBudgetCategorySchema.parse(body);
    const category = await storage.createBudgetCategory(validated);
    return c.json(category, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid category data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to create category" }, 500);
  }
});

app.patch("/categories/:id", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const id = c.req.param("id");
    const body = await c.req.json();
    const updates = insertBudgetCategorySchema.partial().parse(body);
    const category = await storage.updateBudgetCategory(id, updates);
    if (!category) {
      return c.json({ message: "Category not found" }, 404);
    }
    return c.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid update data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to update category" }, 500);
  }
});

app.delete("/categories/:id", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const id = c.req.param("id");
    const deleted = await storage.deleteBudgetCategory(id);
    if (!deleted) {
      return c.json({ message: "Category not found" }, 404);
    }
    return c.body(null, 204);
  } catch (error) {
    return c.json({ message: "Failed to delete category" }, 500);
  }
});

// Expenses
app.get("/expenses", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const month = c.req.query("month");
    const expenses = await storage.getExpenses(month);
    const categories = await storage.getBudgetCategories();
    
    // Enrich expenses with category details
    const enrichedExpenses = expenses.map((expense) => {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      return {
        ...expense,
        categoryName: category?.name || "Unknown",
        categoryIcon: category?.icon || "DollarSign",
      };
    });
    
    return c.json(enrichedExpenses);
  } catch (error) {
    return c.json({ message: "Failed to fetch expenses" }, 500);
  }
});

app.post("/expenses", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const body = await c.req.json();
    const validated = insertExpenseSchema.parse(body);
    const expense = await storage.createExpense(validated);
    
    // Enrich expense with category details for client
    const category = await storage.getBudgetCategory(expense.categoryId);
    const enrichedExpense = {
      ...expense,
      categoryName: category?.name || "Unknown",
      categoryIcon: category?.icon || "DollarSign",
    };
    
    return c.json(enrichedExpense, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid expense data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to create expense" }, 500);
  }
});

app.delete("/expenses/:id", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const id = c.req.param("id");
    const deleted = await storage.deleteExpense(id);
    if (!deleted) {
      return c.json({ message: "Expense not found" }, 404);
    }
    return c.body(null, 204);
  } catch (error) {
    return c.json({ message: "Failed to delete expense" }, 500);
  }
});

// Monthly Budgets
app.get("/budgets", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const budgets = await storage.getMonthlyBudgets();
    return c.json(budgets);
  } catch (error) {
    return c.json({ message: "Failed to fetch budgets" }, 500);
  }
});

app.get("/budgets/:month", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const month = c.req.param("month");
    const budget = await storage.getMonthlyBudget(month);
    if (!budget) {
      return c.json({ message: "Monthly budget not found" }, 404);
    }
    return c.json(budget);
  } catch (error) {
    return c.json({ message: "Failed to fetch monthly budget" }, 500);
  }
});

app.post("/budgets", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const body = await c.req.json();
    const validated = insertMonthlyBudgetSchema.parse(body);
    const budget = await storage.createMonthlyBudget(validated);
    return c.json(budget, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid budget data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to create monthly budget" }, 500);
  }
});

app.patch("/budgets/:month", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const month = c.req.param("month");
    const body = await c.req.json();
    const updates = insertMonthlyBudgetSchema.partial().parse(body);
    const budget = await storage.updateMonthlyBudget(month, updates);
    if (!budget) {
      return c.json({ message: "Monthly budget not found" }, 404);
    }
    return c.json(budget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid update data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to update budget" }, 500);
  }
});

// Initialize default data
app.post("/initialize", async (c) => {
  try {
    const storage = createStorage(c.env.DB);
    const body = await c.req.json();
    const { categories, monthlyIncome, month } = body;
    
    // Validate categories array
    if (!Array.isArray(categories)) {
      return c.json({ message: "Categories must be an array" }, 400);
    }
    
    // Create and validate categories
    const createdCategories = [];
    const existingCategories = await storage.getBudgetCategories();
    
    // Cleanup duplicates if any (keep the first one found for each name)
    const seenNames = new Set();
    const categoriesToKeep = [];
    const duplicatesToDelete = [];
    
    for (const existing of existingCategories) {
      if (seenNames.has(existing.name)) {
        duplicatesToDelete.push(existing.id);
      } else {
        seenNames.add(existing.name);
        categoriesToKeep.push(existing);
      }
    }

    if (duplicatesToDelete.length > 0) {
      console.log(`Deleting ${duplicatesToDelete.length} duplicate categories...`);
      for (const id of duplicatesToDelete) {
        await storage.deleteBudgetCategory(id);
      }
    }

    for (const cat of categories) {
      try {
        const validated = insertBudgetCategorySchema.parse(cat);
        const existing = categoriesToKeep.find(c => c.name === validated.name);
        
        if (!existing) {
          const category = await storage.createBudgetCategory(validated);
          createdCategories.push(category);
          categoriesToKeep.push(category); // Add to local list to prevent duplicates in same loop
        } else {
          createdCategories.push(existing);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Zod Error in category validation:", error.errors);
          return c.json({ 
            message: "Invalid category data", 
            errors: error.errors,
            category: cat 
          }, 400);
        }
        throw error;
      }
    }
    
    // Validate and create monthly budget if it doesn't exist
    const existingBudget = await storage.getMonthlyBudget(month);
    let budget = existingBudget;
    
    if (!existingBudget) {
      const budgetData = insertMonthlyBudgetSchema.parse({
        month,
        totalIncome: monthlyIncome,
      });
      budget = await storage.createMonthlyBudget(budgetData);
    }
    
    return c.json({
      categories: createdCategories,
      budget,
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid budget data", errors: error.errors }, 400);
    }
    return c.json({ message: "Failed to initialize data" }, 500);
  }
});

export const onRequest = handle(app);
