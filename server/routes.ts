import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBudgetCategorySchema, insertExpenseSchema, insertMonthlyBudgetSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Budget Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getBudgetCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertBudgetCategorySchema.parse(req.body);
      const category = await storage.createBudgetCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertBudgetCategorySchema.partial().parse(req.body);
      const category = await storage.updateBudgetCategory(id, updates);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.json(category);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBudgetCategory(id);
      if (!deleted) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const month = req.query.month as string | undefined;
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
      
      res.json(enrichedExpenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validated = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validated);
      
      // Enrich expense with category details for client
      const category = await storage.getBudgetCategory(expense.categoryId);
      const enrichedExpense = {
        ...expense,
        categoryName: category?.name || "Unknown",
        categoryIcon: category?.icon || "DollarSign",
      };
      
      res.status(201).json(enrichedExpense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create expense" });
      }
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteExpense(id);
      if (!deleted) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Monthly Budgets
  app.get("/api/budgets", async (req, res) => {
    try {
      const budgets = await storage.getMonthlyBudgets();
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.get("/api/budgets/:month", async (req, res) => {
    try {
      const { month } = req.params;
      const budget = await storage.getMonthlyBudget(month);
      if (!budget) {
        res.status(404).json({ message: "Monthly budget not found" });
      } else {
        res.json(budget);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monthly budget" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const validated = insertMonthlyBudgetSchema.parse(req.body);
      const budget = await storage.createMonthlyBudget(validated);
      res.status(201).json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create monthly budget" });
      }
    }
  });

  app.patch("/api/budgets/:month", async (req, res) => {
    try {
      const { month } = req.params;
      const updates = insertMonthlyBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateMonthlyBudget(month, updates);
      if (!budget) {
        res.status(404).json({ message: "Monthly budget not found" });
      } else {
        res.json(budget);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update budget" });
      }
    }
  });

  // Initialize default data
  app.post("/api/initialize", async (req, res) => {
    try {
      const { categories, monthlyIncome, month } = req.body;
      
      // Validate categories array
      if (!Array.isArray(categories)) {
        return res.status(400).json({ message: "Categories must be an array" });
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
            categoriesToKeep.push(category);
          } else {
            createdCategories.push(existing);
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({ 
              message: "Invalid category data", 
              errors: error.errors,
              category: cat 
            });
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
      
      res.status(201).json({
        categories: createdCategories,
        budget,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to initialize data" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
