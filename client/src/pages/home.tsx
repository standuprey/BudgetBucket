import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetOverview from "@/components/BudgetOverview";
import CategoryProgressCard from "@/components/CategoryProgressCard";
import ExpenseList from "@/components/ExpenseList";
import ExpenseEntryDialog from "@/components/ExpenseEntryDialog";
import MonthlyRecap from "@/components/MonthlyRecap";
import ThemeToggle from "@/components/ThemeToggle";

//todo: remove mock functionality - this will be replaced with real data from the backend
const MOCK_CATEGORIES = [
  { id: "1", name: "Rent", monthlyBudget: 5900, icon: "Home" },
  { id: "2", name: "Leo School", monthlyBudget: 1425, icon: "GraduationCap" },
  { id: "3", name: "Child Support", monthlyBudget: 800, icon: "Users" },
  { id: "4", name: "Car: Gas + Insurance + Repair", monthlyBudget: 200, icon: "Car" },
  { id: "5", name: "Groceries", monthlyBudget: 1500, icon: "ShoppingCart" },
  { id: "6", name: "Utilities", monthlyBudget: 500, icon: "Zap" },
  { id: "7", name: "Leo activities", monthlyBudget: 200, icon: "Sparkles" },
  { id: "8", name: "Internet / Phone", monthlyBudget: 210, icon: "Wifi" },
  { id: "9", name: "Trizipetide", monthlyBudget: 283, icon: "Syringe" },
  { id: "10", name: "Home Improvement", monthlyBudget: 730, icon: "Wrench" },
  { id: "11", name: "Medical / Meds / Supplements", monthlyBudget: 80, icon: "HeartPulse" },
  { id: "12", name: "Clothes", monthlyBudget: 300, icon: "Shirt" },
  { id: "13", name: "Travel", monthlyBudget: 250, icon: "Plane" },
  { id: "14", name: "Grooming", monthlyBudget: 500, icon: "Scissors" },
  { id: "15", name: "Fun", monthlyBudget: 500, icon: "PartyPopper" },
  { id: "16", name: "Miou Miou", monthlyBudget: 150, icon: "Cat" },
  { id: "17", name: "Cleaning Help", monthlyBudget: 150, icon: "Sparkle" },
  { id: "18", name: "Botox", monthlyBudget: 332, icon: "Sparkles" },
];

const MOCK_EXPENSES = [
  {
    id: "1",
    amount: 5900,
    categoryId: "1",
    date: "2025-11-01",
    notes: "Monthly rent payment",
  },
  {
    id: "2",
    amount: 125.50,
    categoryId: "5",
    date: "2025-11-20",
    notes: "Weekly grocery shopping",
  },
  {
    id: "3",
    amount: 45.00,
    categoryId: "6",
    date: "2025-11-19",
  },
  {
    id: "4",
    amount: 1425.00,
    categoryId: "2",
    date: "2025-11-15",
    notes: "Leo's school tuition",
  },
  {
    id: "5",
    amount: 250.00,
    categoryId: "5",
    date: "2025-11-18",
    notes: "Costco run",
  },
  {
    id: "6",
    amount: 75.00,
    categoryId: "4",
    date: "2025-11-17",
    notes: "Gas for the week",
  },
  {
    id: "7",
    amount: 332.00,
    categoryId: "18",
    date: "2025-11-16",
  },
  {
    id: "8",
    amount: 150.00,
    categoryId: "17",
    date: "2025-11-15",
    notes: "Bi-weekly cleaning",
  },
];

const TOTAL_INCOME = 16060;

export default function Home() {
  const [currentMonth] = useState(new Date());
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [showRecap, setShowRecap] = useState(false);

  const handleAddExpense = (expenseData: any) => {
    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(expenseData.amount),
      categoryId: expenseData.categoryId,
      date: expenseData.date,
      notes: expenseData.notes || undefined,
    };
    setExpenses([newExpense, ...expenses]);
    console.log('Expense added:', newExpense);
  };

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses.forEach((expense) => {
      spending[expense.categoryId] = (spending[expense.categoryId] || 0) + expense.amount;
    });
    return spending;
  }, [expenses]);

  const totalBudget = MOCK_CATEGORIES.reduce((sum, cat) => sum + cat.monthlyBudget, 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = TOTAL_INCOME - totalSpent;

  const enrichedExpenses = expenses.map((expense) => {
    const category = MOCK_CATEGORIES.find((cat) => cat.id === expense.categoryId);
    return {
      ...expense,
      categoryName: category?.name || "Unknown",
      categoryIcon: category?.icon || "DollarSign",
    };
  });

  const categorySummaries = MOCK_CATEGORIES.map((cat) => ({
    name: cat.name,
    spent: categorySpending[cat.id] || 0,
    budget: cat.monthlyBudget,
  }));

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
          totalIncome={TOTAL_INCOME}
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
            {MOCK_CATEGORIES.map((category) => (
              <CategoryProgressCard
                key={category.id}
                categoryName={category.name}
                icon={category.icon}
                spent={categorySpending[category.id] || 0}
                budget={category.monthlyBudget}
              />
            ))}
          </TabsContent>
          <TabsContent value="expenses" className="mt-6">
            <ExpenseList expenses={enrichedExpenses} />
          </TabsContent>
        </Tabs>
      </main>

      <ExpenseEntryDialog
        categories={MOCK_CATEGORIES}
        onAddExpense={handleAddExpense}
      />

      <MonthlyRecap
        open={showRecap}
        onOpenChange={setShowRecap}
        month={format(currentMonth, 'MMMM yyyy')}
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        totalIncome={TOTAL_INCOME}
        savings={savings}
        categories={categorySummaries}
        onAdjustBudget={() => {
          console.log('Navigate to budget adjustment');
          window.location.href = '/adjust-budget';
        }}
      />
    </div>
  );
}
