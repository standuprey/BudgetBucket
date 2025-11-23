import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BudgetCategory, MonthlyBudget } from "@shared/schema";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BudgetAdjustment from "@/components/BudgetAdjustment";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { getCategories, updateCategory, getMonthlyBudget, updateMonthlyBudget, createMonthlyBudget } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export default function AdjustBudget() {
  const { toast } = useToast();
  const currentMonth = new Date();
  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<BudgetCategory[]>({
    queryKey: ['/api/categories'],
  });

  const { data: monthlyBudget } = useQuery<MonthlyBudget | null>({
    queryKey: ['/api/budgets', currentMonthStr],
    queryFn: () => getMonthlyBudget(currentMonthStr),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateCategory(id, updates),
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async (income: number) => {
      if (monthlyBudget) {
        return updateMonthlyBudget(currentMonthStr, income.toString());
      } else {
        return createMonthlyBudget(currentMonthStr, income.toString());
      }
    },
  });

  const handleSave = async (updatedCategories: any[], newIncome: number) => {
    try {
      await Promise.all(
        updatedCategories.map((cat) =>
          updateCategoryMutation.mutateAsync({
            id: cat.id,
            updates: { monthlyBudget: cat.monthlyBudget.toString() },
          })
        )
      );

      await updateBudgetMutation.mutateAsync(newIncome);

      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/budgets', currentMonthStr] });

      toast({
        title: "Budget Updated",
        description: "Your budget has been successfully updated.",
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  const categoriesWithNumbers = categories.map((cat) => ({
    ...cat,
    monthlyBudget: typeof cat.monthlyBudget === 'string' ? parseFloat(cat.monthlyBudget) : cat.monthlyBudget,
  }));

  const totalIncome = monthlyBudget
    ? (typeof monthlyBudget.totalIncome === 'string' ? parseFloat(monthlyBudget.totalIncome) : monthlyBudget.totalIncome)
    : 16060;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Adjust Budget</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <BudgetAdjustment
          categories={categoriesWithNumbers}
          totalIncome={totalIncome}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
