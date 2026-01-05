import { useState } from "react";
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
  Gift,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { cn } from "@/lib/utils";
import { motion, useMotionValue } from "framer-motion";

interface Expense {
  id: string;
  amount: number;
  categoryName: string;
  categoryIcon: string;
  date: string;
  notes?: string;
}

interface ExpenseListItemProps {
  expense: Expense;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (id: string) => void;
}

function ExpenseListItem({ expense, isSelected, onSelect, onDelete }: ExpenseListItemProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const x = useMotionValue(0);
  const Icon = iconMap[expense.categoryIcon] || DollarSign;
  
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

  const handleDragEnd = (_: any, info: any) => {
    const dragThreshold = isSwiped ? 30 : -30;
    if (info.offset.x < -60 || (info.offset.x < dragThreshold && !isSwiped)) {
      setIsSwiped(true);
    } else if (info.offset.x > 60 || (info.offset.x > dragThreshold && isSwiped)) {
      setIsSwiped(false);
    }
  };

  const BUTTON_WIDTH = 80;

  return (
    <div className="relative overflow-hidden rounded-xl group">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-end">
        {onDelete && (
          <ConfirmDialog
            title="Delete Expense"
            description={`Are you sure you want to delete this ${formatCurrency(expense.amount)} expense?`}
            onConfirm={() => onDelete(expense.id)}
            variant="destructive"
            confirmText="Delete"
          >
            <button
              className="w-[80px] h-full bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors flex flex-col items-center justify-center gap-1"
              title="Delete"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase">Delete</span>
            </button>
          </ConfirmDialog>
        )}
      </div>

      {/* Swipeable Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -BUTTON_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isSwiped ? -BUTTON_WIDTH : 0 }}
        style={{ x }}
        className="relative z-10 bg-background"
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <Card
          className={cn(
            "hover-elevate transition-all border-none shadow-none ring-1 ring-border",
            isSelected && "ring-2 ring-primary bg-primary/5 shadow-md",
            isSwiped && "ring-primary/50"
          )}
          onClick={(e) => {
            if (isSwiped) {
              setIsSwiped(false);
            } else {
              onSelect();
            }
          }}
          data-testid={`expense-item-${expense.id}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base truncate" data-testid={`text-category-${expense.id}`}>
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
              <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                <div className="text-xl font-bold" data-testid={`text-amount-${expense.id}`}>
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

interface ExpenseListProps {
  expenses: Expense[];
  maxItems?: number;
  onDelete?: (id: string) => void;
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
  Gift,
  Star,
};

export default function ExpenseList({ expenses, maxItems = 10, onDelete }: ExpenseListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const displayExpenses = expenses.slice(0, maxItems);

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
          displayExpenses.map((expense) => (
            <ExpenseListItem
              key={expense.id}
              expense={expense}
              isSelected={selectedId === expense.id}
              onSelect={() => setSelectedId(selectedId === expense.id ? null : expense.id)}
              onDelete={onDelete}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
