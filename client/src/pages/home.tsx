import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BudgetCategory, Expense, MonthlyBudget } from "@shared/schema";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetOverview from "@/components/BudgetOverview";
import CategoryProgressCard from "@/components/CategoryProgressCard";
import ExpenseList from "@/components/ExpenseList";
import ExpenseEntryDialog from "@/components/ExpenseEntryDialog";
import MonthlyRecap from "@/components/MonthlyRecap";
import ThemeToggle from "@/components/ThemeToggle";
import { getCategories, getExpenses, createExpense, getMonthlyBudget, initializeDefaultData } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_CATEGORIES = [
  { name: "Rent", monthlyBudget: "5900.00", icon: "Home" },
  { name: "Leo School", monthlyBudget: "1425.00", icon: "GraduationCap" },
  { name: "Child Support", monthlyBudget: "800.00", icon: "Users" },
  { name: "Car: Gas + Insurance + Repair", monthlyBudget: "200.00", icon: "Car" },
  { name: "Groceries", monthlyBudget: "1500.00", icon: "ShoppingCart" },
  { name: "Utilities", monthlyBudget: "500.00", icon: "Zap" },
  { name: "Leo activities", monthlyBudget: "200.00", icon: "Sparkles" },
  { name: "Internet / Phone", monthlyBudget: "210.00", icon: "Wifi" },
  { name: "Trizipetide", monthlyBudget: "283.00", icon: "Syringe" },
  { name: "Home Improvement", monthlyBudget: "730.00", icon: "Wrench" },
  { name: "Medical / Meds / Supplements", monthlyBudget: "80.00", icon: "HeartPulse" },
  { name: "Clothes", monthlyBudget: "300.00", icon: "Shirt" },
  { name: "Travel", monthlyBudget: "250.00", icon: "Plane" },
  { name: "Grooming", monthlyBudget: "500.00", icon: "Scissors" },
  { name: "Fun", monthlyBudget: "500.00", icon: "PartyPopper" },
  { name: "Miou Miou", monthlyBudget: "150.00", icon: "Cat" },
  { name: "Cleaning Help", monthlyBudget: "150.00", icon: "Sparkle" },
  { name: "Botox", monthlyBudget: "332.00", icon: "Sparkles" },
];

const DEFAULT_INCOME = 16060.00;

export default function Home() {
  const [currentMonth] = useState(new Date());
  const [showRecap, setShowRecap] = useState(false);
  const { toast } = useToast();
  
  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<BudgetCategory[]>({
    queryKey: ['/api/categories'],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses', currentMonthStr],
    queryFn: () => getExpenses(currentMonthStr),
  });

  const { data: monthlyBudget } = useQuery<MonthlyBudget | null>({
    queryKey: ['/api/budgets', currentMonthStr],
    queryFn: () => getMonthlyBudget(currentMonthStr),
  });

  useEffect(() => {
    const initializeData = async () => {
      if (!categoriesLoading && categories.length === 0) {
        try {
          await initializeDefaultData(DEFAULT_CATEGORIES, DEFAULT_INCOME, currentMonthStr);
          queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
          queryClient.invalidateQueries({ queryKey: ['/api/budgets', currentMonthStr] });
        } catch (error) {
          console.error('Failed to initialize default data:', error);
        }
      }
    };
    initializeData();
  }, [categoriesLoading, categories.length, currentMonthStr]);

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses', currentMonthStr] });
      toast({
        title: "Expense Added",
        description: "Your expense has been successfully tracked.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddExpense = (expenseData: any) => {
    createExpenseMutation.mutate(expenseData);
  };

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses.forEach((expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      spending[expense.categoryId] = (spending[expense.categoryId] || 0) + amount;
    });
    return spending;
  }, [expenses]);

  const totalBudget = categories.reduce((sum, cat) => {
    const budget = typeof cat.monthlyBudget === 'string' ? parseFloat(cat.monthlyBudget) : cat.monthlyBudget;
    return sum + budget;
  }, 0);
  
  const totalSpent = expenses.reduce((sum, exp) => {
    const amount = typeof exp.amount === 'string' ? parseFloat(exp.amount) : exp.amount;
    return sum + amount;
  }, 0);

  const totalIncome = monthlyBudget 
    ? (typeof monthlyBudget.totalIncome === 'string' ? parseFloat(monthlyBudget.totalIncome) : monthlyBudget.totalIncome)
    : DEFAULT_INCOME;

  const savings = totalIncome - totalSpent;

  const enrichedExpenses = expenses.map((expense: any) => {
    const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
    return {
      id: expense.id,
      amount,
      categoryName: expense.categoryName || "Unknown",
      categoryIcon: expense.categoryIcon || "DollarSign",
      date: expense.date,
      notes: expense.notes || undefined,
    };
  }).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const categorySummaries = categories.map((cat) => {
    const budget = typeof cat.monthlyBudget === 'string' ? parseFloat(cat.monthlyBudget) : cat.monthlyBudget;
    return {
      name: cat.name,
      spent: categorySpending[cat.id] || 0,
      budget,
    };
  });

  if (categoriesLoading || expensesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading your budget...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Budget Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRecap(true)}
              data-testid="button-monthly-recap"
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" disabled>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-current-month">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-muted-foreground">
                Current month
              </p>
            </div>
            <Button variant="ghost" size="icon" disabled>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <BudgetOverview
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalIncome={totalIncome}
        />

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories" data-testid="tab-categories">
              Categories
            </TabsTrigger>
            <TabsTrigger value="expenses" data-testid="tab-expenses">
              Expenses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="space-y-4 mt-6">
            {categories.map((category) => {
              const budget = typeof category.monthlyBudget === 'string' ? parseFloat(category.monthlyBudget) : category.monthlyBudget;
              return (
                <CategoryProgressCard
                  key={category.id}
                  categoryName={category.name}
                  icon={category.icon}
                  spent={categorySpending[category.id] || 0}
                  budget={budget}
                />
              );
            })}
          </TabsContent>
          <TabsContent value="expenses" className="mt-6">
            <ExpenseList expenses={enrichedExpenses} />
          </TabsContent>
        </Tabs>
      </main>

      <ExpenseEntryDialog
        categories={categories}
        onAddExpense={handleAddExpense}
      />

      <MonthlyRecap
        open={showRecap}
        onOpenChange={setShowRecap}
        month={format(currentMonth, 'MMMM yyyy')}
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        totalIncome={totalIncome}
        savings={savings}
        categories={categorySummaries}
        onAdjustBudget={() => {
          window.location.href = '/adjust-budget';
        }}
      />
    </div>
  );
}
