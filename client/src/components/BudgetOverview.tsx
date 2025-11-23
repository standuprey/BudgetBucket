import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet, PiggyBank } from "lucide-react";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  totalIncome: number;
}

export default function BudgetOverview({ totalBudget, totalSpent, totalIncome }: BudgetOverviewProps) {
  const remaining = totalBudget - totalSpent;
  const savings = totalIncome - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card data-testid="card-total-budget">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Budget
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" data-testid="text-total-budget">
            {formatCurrency(totalBudget)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Monthly allocation
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-total-spent">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" data-testid="text-total-spent">
            {formatCurrency(totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {spentPercentage.toFixed(1)}% of budget
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-remaining">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Remaining
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${remaining < 0 ? 'text-destructive' : ''}`}
            data-testid="text-remaining"
          >
            {formatCurrency(remaining)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {remaining >= 0 ? 'Still available' : 'Over budget'}
          </p>
        </CardContent>
      </Card>

      <Card data-testid="card-savings">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Savings
          </CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${savings < 0 ? 'text-destructive' : 'text-primary'}`}
            data-testid="text-savings"
          >
            {formatCurrency(savings)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {savings >= 0 ? 'This month' : 'Over income'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
