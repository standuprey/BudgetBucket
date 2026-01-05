import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  X,
  CalendarDays,
  Pen,
  Trash2,
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { cn } from "@/lib/utils";
import CategoryEntryDialog from "./CategoryEntryDialog";
import { motion, useMotionValue } from "framer-motion";

interface CategoryProgressCardProps {
  categoryName: string;
  icon: string;
  spent: number;
  budget: number;
  isAnnual?: boolean;
  onDelete?: () => void;
  onUpdate?: (id: string, updates: { name: string; monthlyBudget: number; icon: string; isAnnual?: boolean }) => void;
  id: string;
  onClick?: () => void;
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

export default function CategoryProgressCard({
  categoryName,
  icon,
  spent,
  budget,
  isAnnual = false,
  onDelete,
  onUpdate,
  id,
  onClick,
}: CategoryProgressCardProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const x = useMotionValue(0);
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const Icon = iconMap[icon] || DollarSign;
  
  const getStatusColor = () => {
    if (spent > budget) return "text-destructive";
    if (isAnnual) return "text-indigo-600 dark:text-indigo-400";
    if (percentage > 80) return "text-chart-4";
    return "text-primary";
  };

  const getProgressColor = () => {
    if (spent > budget) return "[&>div]:bg-destructive";
    if (isAnnual) return "[&>div]:bg-indigo-500";
    if (percentage > 80) return "[&>div]:bg-chart-4";
    return "[&>div]:bg-primary";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 60;
    if (info.offset.x < -threshold) {
      setIsSwiped(true);
    } else if (info.offset.x > threshold) {
      setIsSwiped(false);
    }
  };

  const BUTTON_WIDTH = 160;

  return (
    <div className="relative overflow-hidden rounded-xl h-full group">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-end">
        <div className="flex w-[160px] h-full items-stretch overflow-hidden">
          {onUpdate && (
            <CategoryEntryDialog
              mode="edit"
              initialData={{
                id,
                name: categoryName,
                monthlyBudget: budget,
                icon,
                isAnnual,
              }}
              onAddCategory={() => {}}
              onUpdateCategory={onUpdate}
              triggerClassName="flex-1 h-full"
              trigger={
                <button
                  className="w-full h-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors flex flex-col items-center justify-center gap-1"
                  title="Edit"
                >
                  <Pen className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase">Edit</span>
                </button>
              }
            />
          )}
          {onDelete && (
            <ConfirmDialog
              title="Delete Category"
              description={`Are you sure you want to delete the "${categoryName}" category?`}
              onConfirm={onDelete}
              variant="destructive"
              confirmText="Delete"
            >
              <button
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors flex flex-col items-center justify-center gap-1"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">Delete</span>
              </button>
            </ConfirmDialog>
          )}
        </div>
      </div>

      {/* Swipeable Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -BUTTON_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isSwiped ? -BUTTON_WIDTH : 0 }}
        style={{ x }}
        className="relative z-10 h-full bg-background"
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <Card 
          className={cn(
            "hover-elevate h-full transition-all cursor-pointer border-none shadow-none ring-1 ring-border",
            isAnnual && "bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900",
            isSwiped && "ring-primary/50"
          )} 
          onClick={() => {
            if (isSwiped) {
              setIsSwiped(false);
            } else {
              onClick?.();
            }
          }}
          data-testid={`card-category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isAnnual ? "bg-indigo-100 dark:bg-indigo-900" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isAnnual ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"
                  )} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base truncate max-w-[120px]" data-testid={`text-category-name-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                      {categoryName}
                    </h3>
                    {isAnnual && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        Annual
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatCurrency(spent)} of {formatCurrency(budget)} 
                    <span className="text-[10px] ml-1 opacity-70">
                      ({isAnnual ? "YTD" : "Mo"})
                    </span>
                  </p>
                </div>
              </div>
              <div className={cn(
                "text-sm font-semibold whitespace-nowrap",
                getStatusColor()
              )} data-testid={`text-percentage-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                {percentage.toFixed(0)}%
              </div>
            </div>
            <Progress value={percentage} className={cn("h-3 w-full", getProgressColor())} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
