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
} from "lucide-react";

interface CategoryProgressCardProps {
  categoryName: string;
  icon: string;
  spent: number;
  budget: number;
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

export default function CategoryProgressCard({
  categoryName,
  icon,
  spent,
  budget,
}: CategoryProgressCardProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const Icon = iconMap[icon] || DollarSign;
  
  const getStatusColor = () => {
    if (spent > budget) return "text-destructive";
    if (percentage > 80) return "text-chart-4";
    return "text-primary";
  };

  const getProgressColor = () => {
    if (spent > budget) return "[&>div]:bg-destructive";
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

  return (
    <Card className="hover-elevate" data-testid={`card-category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-base" data-testid={`text-category-name-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                {categoryName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(spent)} of {formatCurrency(budget)}
              </p>
            </div>
          </div>
          <div className={`text-sm font-semibold ${getStatusColor()}`} data-testid={`text-percentage-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
            {percentage.toFixed(0)}%
          </div>
        </div>
        <Progress value={percentage} className={`h-3 ${getProgressColor()}`} />
      </CardContent>
    </Card>
  );
}
