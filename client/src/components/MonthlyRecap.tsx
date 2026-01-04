import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award, Target, Calendar, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

interface CategorySummary {
  name: string;
  spent: number;
  budget: number;
}

interface MonthlyRecapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  year: string;
  // Monthly data
  totalSpent: number;
  totalBudget: number;
  totalIncome: number;
  savings: number;
  categories: CategorySummary[];
  // Yearly data
  yearlySpent: number;
  yearlyBudget: number;
  yearlyIncome: number;
  yearlySavings: number;
  yearlyCategories: CategorySummary[];
  onAdjustBudget: () => void;
}

export default function MonthlyRecap({
  open,
  onOpenChange,
  month,
  year,
  totalSpent,
  totalBudget,
  totalIncome,
  savings,
  categories,
  yearlySpent,
  yearlyBudget,
  yearlyIncome,
  yearlySavings,
  yearlyCategories,
  onAdjustBudget,
}: MonthlyRecapProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderRecapContent = (
    spent: number,
    budget: number,
    income: number,
    savingsVal: number,
    cats: CategorySummary[],
    periodLabel: string
  ) => {
    const isUnderBudget = spent <= budget;
    const topCategories = [...cats]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);

    return (
      <div className="space-y-6 mt-4">
        {isUnderBudget && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Great Job!</h3>
                <p className="text-sm text-muted-foreground">
                  You stayed under budget this {periodLabel}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total Spent</span>
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(spent)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {budget > 0 ? ((spent / budget) * 100).toFixed(1) : 0}% of budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Savings</span>
              </div>
              <div className={`text-3xl font-bold ${savingsVal >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {formatCurrency(savingsVal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {savingsVal >= 0 ? 'Money saved' : 'Over income'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Spending Categories
          </h3>
          <div className="space-y-3">
            {topCategories.map((category, index) => {
              const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
              return (
                <Card key={category.name} className="hover-elevate">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          #{index + 1}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(category.spent)}</div>
                        <div className="text-xs text-muted-foreground">
                          of {formatCurrency(category.budget)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage > 100 ? 'bg-destructive' : percentage > 80 ? 'bg-chart-4' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-monthly-recap">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Recap</DialogTitle>
          <DialogDescription>
            Review your spending performance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="month" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {month}
            </TabsTrigger>
            <TabsTrigger value="year" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Year {year}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="month">
            {renderRecapContent(totalSpent, totalBudget, totalIncome, savings, categories, "month")}
          </TabsContent>
          
          <TabsContent value="year">
            {renderRecapContent(yearlySpent, yearlyBudget, yearlyIncome, yearlySavings, yearlyCategories, "year")}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={() => {
              onAdjustBudget();
              onOpenChange(false);
            }}
            className="w-full py-6 text-lg font-semibold"
            data-testid="button-adjust-budget"
          >
            Adjust Budget for Next Month
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

