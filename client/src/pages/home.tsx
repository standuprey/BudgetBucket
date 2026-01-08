import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BudgetCategory, Expense, MonthlyBudget } from "@shared/schema";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetOverview from "@/components/BudgetOverview";
import CategoryProgressCard from "@/components/CategoryProgressCard";
import CategoryEditDialog from "@/components/CategoryEditDialog";
import ExpenseList from "@/components/ExpenseList";
import ExpenseEntryDialog from "@/components/ExpenseEntryDialog";
import MonthlyRecap from "@/components/MonthlyRecap";
import ThemeToggle from "@/components/ThemeToggle";
import { getCategories, getExpenses, createExpense, getMonthlyBudget, getBudgets, initializeDefaultData, deleteCategory, updateCategory } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_CATEGORIES = [
  { name: "Rent", monthlyBudget: 5900, icon: "Home" },
  { name: "Child Support", monthlyBudget: 800, icon: "Users" },
  { name: "Lulu Activities", monthlyBudget: 300, icon: "Star" },
  { name: "Car: Gas + Insurance + Repair", monthlyBudget: 200, icon: "Car" },
  { name: "Groceries", monthlyBudget: 1500, icon: "ShoppingCart" },
  { name: "Utilities", monthlyBudget: 500, icon: "Zap" },
  { name: "Leo activities", monthlyBudget: 300, icon: "Sparkles" },
  { name: "Internet / Phone", monthlyBudget: 210, icon: "Wifi" },
  { name: "Trizipetide", monthlyBudget: 283, icon: "Syringe" },
  { name: "Home Improvement", monthlyBudget: 730, icon: "Wrench" },
  { name: "Medical / Meds / Supplements", monthlyBudget: 80, icon: "HeartPulse" },
  { name: "Clothes", monthlyBudget: 300, icon: "Shirt" },
  { name: "Travel", monthlyBudget: 250, icon: "Plane" },
  { name: "Grooming", monthlyBudget: 500, icon: "Scissors" },
  { name: "Fun", monthlyBudget: 500, icon: "PartyPopper" },
  { name: "Miou Miou", monthlyBudget: 150, icon: "Cat" },
  { name: "Cleaning Help", monthlyBudget: 150, icon: "Sparkle" },
  { name: "Botox", monthlyBudget: 332, icon: "Sparkles" },
  { name: "Gift", monthlyBudget: 300, icon: "Gift" },
];

const DEFAULT_INCOME = 16060;

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showRecap, setShowRecap] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const { toast } = useToast();
  
  const currentMonthStr = useMemo(() => format(currentMonth, 'yyyy-MM'), [currentMonth]);
  const today = useMemo(() => new Date(), []);
  const isCurrentMonth = useMemo(() => 
    format(currentMonth, 'yyyy-MM') === format(today, 'yyyy-MM'), 
    [currentMonth, today]
  );
  
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    setSelectedCategoryId(null); // Clear filter when changing months
  };
  
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    // Don't allow going beyond current month
    if (format(newMonth, 'yyyy-MM') <= format(today, 'yyyy-MM')) {
      setCurrentMonth(newMonth);
      setSelectedCategoryId(null); // Clear filter when changing months
    }
  };

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<BudgetCategory[]>({
    queryKey: ['/api/categories'],
    queryFn: getCategories,
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses', currentMonthStr],
    queryFn: () => getExpenses(currentMonthStr),
  });

  const { data: monthlyBudget } = useQuery<MonthlyBudget | null>({
    queryKey: ['/api/budgets', currentMonthStr],
    queryFn: () => getMonthlyBudget(currentMonthStr),
  });

  const { data: allExpenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
    queryFn: () => getExpenses(),
  });

  const { data: allBudgets = [] } = useQuery<MonthlyBudget[]>({
    queryKey: ['/api/budgets'],
    queryFn: getBudgets,
  });

  useEffect(() => {
    const initializeData = async () => {
      if (!categoriesLoading && categories.length === 0) {
        console.log('Initializing default data...');
        try {
          const result = await initializeDefaultData(DEFAULT_CATEGORIES, DEFAULT_INCOME, currentMonthStr);
          console.log('Initialization successful:', result);
          await queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
          await queryClient.invalidateQueries({ queryKey: ['/api/budgets', currentMonthStr] });
          // Force refetch
          await queryClient.refetchQueries({ queryKey: ['/api/categories'] });
        } catch (error) {
          console.error('Failed to initialize default data:', error);
          toast({
            title: "Initialization Error",
            description: error instanceof Error ? error.message : "Failed to initialize budget data",
            variant: "destructive",
          });
        }
      }
    };
    initializeData();
  }, [categoriesLoading, categories.length, currentMonthStr, toast]);

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

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BudgetCategory> }) => updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      toast({
        title: "Category Updated",
        description: "The category has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateCategory = (id: string, updates: Partial<BudgetCategory>) => {
    updateCategoryMutation.mutate({ id, updates });
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      toast({
        title: "Category Deleted",
        description: "The category and its associated expenses have been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? All associated expenses will also be deleted.")) {
      deleteCategoryMutation.mutate(categoryId);
    }
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

  // Yearly calculations
  const currentYear = format(currentMonth, 'yyyy');
  const currentMonthIndex = currentMonth.getMonth(); // 0-11
  const monthsSoFar = currentMonthIndex + 1;

  const yearlyExpenses = allExpenses.filter(e => e.date.startsWith(currentYear));
  const yearlySpent = yearlyExpenses.reduce((sum, e) => {
    const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
    return sum + amount;
  }, 0);
  
  // Calculate yearly income by checking each month's budget record
  let yearlyIncome = 0;
  for (let i = 0; i < monthsSoFar; i++) {
    const monthStr = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    const budgetRecord = allBudgets.find(b => b.month === monthStr);
    if (budgetRecord) {
      const income = typeof budgetRecord.totalIncome === 'string' ? parseFloat(budgetRecord.totalIncome) : budgetRecord.totalIncome;
      yearlyIncome += income;
    } else {
      yearlyIncome += DEFAULT_INCOME;
    }
  }
  
  // Total budget for the year so far
  const totalMonthlyBudget = categories.reduce((sum, cat) => {
    const budget = typeof cat.monthlyBudget === 'string' ? parseFloat(cat.monthlyBudget) : cat.monthlyBudget;
    return sum + budget;
  }, 0);
  const yearlyBudget = totalMonthlyBudget * monthsSoFar;
  
  const yearlySavings = yearlyIncome - yearlySpent;

  const yearlyCategorySummaries = categories.map(category => {
    const spent = yearlyExpenses
      .filter(e => e.categoryId === category.id)
      .reduce((sum, e) => {
        const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
        return sum + amount;
      }, 0);
    const budget = typeof category.monthlyBudget === 'string' ? parseFloat(category.monthlyBudget) : category.monthlyBudget;
    return {
      name: category.name,
      spent,
      budget: budget * monthsSoFar,
    };
  });

  const categorySummaries = categories.map(category => ({
    name: category.name,
    spent: categorySpending[category.id] || 0,
    budget: typeof category.monthlyBudget === 'string' ? parseFloat(category.monthlyBudget) : category.monthlyBudget,
  }));

  const enrichedExpenses = expenses
    .filter((expense: any) => {
      // If a category is selected, only show expenses from that category
      if (selectedCategoryId) {
        return expense.categoryId === selectedCategoryId;
      }
      return true;
    })
    .map((expense: any) => {
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => goToPreviousMonth()}
              data-testid="button-previous-month"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-current-month">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isCurrentMonth ? 'Current month' : 'Past month'}
              </p>
            </div>
            {!isCurrentMonth && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => goToNextMonth()}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <BudgetOverview
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalIncome={totalIncome}
        />

        <Tabs defaultValue="categories" className="w-full" value={selectedCategoryId ? "expenses" : undefined}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="categories" 
              data-testid="tab-categories"
              onClick={() => setSelectedCategoryId(null)}
            >
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
                  onDelete={() => handleDeleteCategory(category.id)}
                  onEdit={() => setEditingCategory(category)}
                  onClick={() => setSelectedCategoryId(category.id)}
                />
              );
            })}
          </TabsContent>
          <TabsContent value="expenses" className="mt-6 space-y-4">
            {selectedCategoryId && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Filtered by: {categories.find(c => c.id === selectedCategoryId)?.name}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  Clear Filter
                </Button>
              </div>
            )}
            <ExpenseList expenses={enrichedExpenses} />
          </TabsContent>
        </Tabs>
      </main>

      <ExpenseEntryDialog
        categories={categories}
        onAddExpense={handleAddExpense}
        defaultCategoryId={selectedCategoryId}
      />

      <CategoryEditDialog
        category={editingCategory}
        open={editingCategory !== null}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSave={handleUpdateCategory}
      />

      <MonthlyRecap
        open={showRecap}
        onOpenChange={setShowRecap}
        month={format(currentMonth, 'MMMM yyyy')}
        year={currentYear}
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        totalIncome={totalIncome}
        savings={savings}
        categories={categorySummaries}
        yearlySpent={yearlySpent}
        yearlyBudget={yearlyBudget}
        yearlyIncome={yearlyIncome}
        yearlySavings={yearlySavings}
        yearlyCategories={yearlyCategorySummaries}
        onAdjustBudget={() => {
          window.location.href = '/adjust-budget';
        }}
      />
    </div>
  );
}
