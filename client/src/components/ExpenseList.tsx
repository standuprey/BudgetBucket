import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Home,
  GraduationCap,
  Users,
  Car,
  ShoppingCart,
  Zap,
  Sparkles,
  Wifi,
  Syringe,
  Wrench,
  HeartPulse,
  Shirt,
  Plane,
  Scissors,
  PartyPopper,
  Cat,
  Sparkle,
  DollarSign,
} from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  categoryName: string;
  categoryIcon: string;
  date: string;
  notes?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  maxItems?: number;
}

const iconMap: Record<string, any> = {
  Home,
  GraduationCap,
  Users,
  Car,
  ShoppingCart,
  Zap,
  Sparkles,
  Wifi,
  Syringe,
  Wrench,
  HeartPulse,
  Shirt,
  Plane,
  Scissors,
  PartyPopper,
  Cat,
  Sparkle,
  DollarSign,
};

export default function ExpenseList({ expenses, maxItems = 10 }: ExpenseListProps) {
  const displayExpenses = expenses.slice(0, maxItems);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayExpenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No expenses yet. Add your first expense to get started!
          </p>
        ) : (
          displayExpenses.map((expense) => {
            const Icon = iconMap[expense.categoryIcon] || DollarSign;
            return (
              <Card
                key={expense.id}
                className="hover-elevate"
                data-testid={`expense-item-${expense.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base" data-testid={`text-category-${expense.id}`}>
                          {expense.categoryName}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`text-date-${expense.id}`}>
                          {formatDate(expense.date)}
                        </div>
                        {expense.notes && (
                          <div className="text-sm text-muted-foreground mt-1 truncate" data-testid={`text-notes-${expense.id}`}>
                            {expense.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-bold ml-4 flex-shrink-0" data-testid={`text-amount-${expense.id}`}>
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
