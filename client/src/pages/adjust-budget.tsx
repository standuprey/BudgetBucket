import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BudgetAdjustment from "@/components/BudgetAdjustment";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality - this will be replaced with real data from the backend
const MOCK_CATEGORIES = [
  { id: "1", name: "Rent", monthlyBudget: 5900 },
  { id: "2", name: "Leo School", monthlyBudget: 1425 },
  { id: "3", name: "Child Support", monthlyBudget: 800 },
  { id: "4", name: "Car: Gas + Insurance + Repair", monthlyBudget: 200 },
  { id: "5", name: "Groceries", monthlyBudget: 1500 },
  { id: "6", name: "Utilities", monthlyBudget: 500 },
  { id: "7", name: "Leo activities", monthlyBudget: 200 },
  { id: "8", name: "Internet / Phone", monthlyBudget: 210 },
  { id: "9", name: "Trizipetide", monthlyBudget: 283 },
  { id: "10", name: "Home Improvement", monthlyBudget: 730 },
  { id: "11", name: "Medical / Meds / Supplements", monthlyBudget: 80 },
  { id: "12", name: "Clothes", monthlyBudget: 300 },
  { id: "13", name: "Travel", monthlyBudget: 250 },
  { id: "14", name: "Grooming", monthlyBudget: 500 },
  { id: "15", name: "Fun", monthlyBudget: 500 },
  { id: "16", name: "Miou Miou", monthlyBudget: 150 },
  { id: "17", name: "Cleaning Help", monthlyBudget: 150 },
  { id: "18", name: "Botox", monthlyBudget: 332 },
];

const TOTAL_INCOME = 16060;

export default function AdjustBudget() {
  const { toast } = useToast();

  const handleSave = (updatedCategories: any[], newIncome: number) => {
    console.log('Budget saved:', { updatedCategories, newIncome });
    toast({
      title: "Budget Updated",
      description: "Your budget has been successfully updated for next month.",
    });
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

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
          categories={MOCK_CATEGORIES}
          totalIncome={TOTAL_INCOME}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
