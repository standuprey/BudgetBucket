import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react";

interface CategorySummary {
  name: string;
  spent: number;
  budget: number;
}

interface MonthlyRecapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  totalSpent: number;
  totalBudget: number;
  totalIncome: number;
  savings: number;
  categories: CategorySummary[];
  onAdjustBudget: () => void;
}

export default function MonthlyRecap({
  open,
  onOpenChange,
  month,
  totalSpent,
  totalBudget,
  totalIncome,
  savings,
  categories,
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

  const isUnderBudget = totalSpent <= totalBudget;
  const topCategories = [...categories]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-monthly-recap">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{month} Recap</DialogTitle>
          <DialogDescription>
            Here's how you did this month
          </DialogDescription>
        </DialogHeader>

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
                    You stayed under budget this month
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
                <div className="text-3xl font-bold" data-testid="text-recap-spent">
                  {formatCurrency(totalSpent)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Savings</span>
                </div>
                <div className={`text-3xl font-bold ${savings >= 0 ? 'text-primary' : 'text-destructive'}`} data-testid="text-recap-savings">
                  {formatCurrency(savings)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {savings >= 0 ? 'Money saved' : 'Over income'}
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
