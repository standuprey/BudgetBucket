import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  monthlyBudget: number;
}

interface BudgetAdjustmentProps {
  categories: BudgetCategory[];
  totalIncome: number;
  onSave: (updatedCategories: BudgetCategory[], newIncome: number) => void;
  onCancel: () => void;
}

export default function BudgetAdjustment({
  categories,
  totalIncome,
  onSave,
  onCancel,
}: BudgetAdjustmentProps) {
  const [budgets, setBudgets] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.monthlyBudget }), {})
  );
  const [income, setIncome] = useState(totalIncome);

  const handleBudgetChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets({ ...budgets, [id]: numValue });
  };

  const adjustBudget = (id: string, increment: number) => {
    setBudgets({ ...budgets, [id]: Math.max(0, budgets[id] + increment) });
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const plannedSavings = income - totalBudget;

  const handleSave = () => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      monthlyBudget: budgets[cat.id],
    }));
    onSave(updatedCategories, income);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="income" className="text-sm font-medium">
            Total Income
          </Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
              $
            </span>
            <Input
              id="income"
              type="number"
              step="0.01"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="pl-8 text-lg font-semibold"
              data-testid="input-income"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Category Budgets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <Label htmlFor={`budget-${category.id}`} className="text-sm font-medium">
                {category.name}
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => adjustBudget(category.id, -50)}
                  data-testid={`button-decrease-${category.id}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground">
                    $
                  </span>
                  <Input
                    id={`budget-${category.id}`}
                    type="number"
                    step="0.01"
                    value={budgets[category.id]}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="pl-8 font-semibold"
                    data-testid={`input-budget-${category.id}`}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => adjustBudget(category.id, 50)}
                  data-testid={`button-increase-${category.id}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Budget:</span>
              <span className="font-semibold" data-testid="text-total-budget-calc">
                {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Income:</span>
              <span className="font-semibold" data-testid="text-income-calc">
                {formatCurrency(income)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Planned Savings:</span>
              <span
                className={plannedSavings >= 0 ? 'text-primary' : 'text-destructive'}
                data-testid="text-planned-savings"
              >
                {formatCurrency(plannedSavings)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background pt-4 pb-6 flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 py-6 font-semibold"
          data-testid="button-cancel-budget"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 py-6 font-semibold"
          data-testid="button-save-budget"
        >
          Save Budget
        </Button>
      </div>
    </div>
  );
}
