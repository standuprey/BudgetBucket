import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, useAnimation, PanInfo } from "framer-motion";
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
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryProgressCardProps {
  categoryName: string;
  icon: string;
  spent: number;
  budget: number;
  onDelete?: () => void;
  onEdit?: () => void;
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
  onDelete,
  onEdit,
  onClick,
}: CategoryProgressCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const actionButtonWidth = 80;
  const totalActionsWidth = 160;

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

  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocityThreshold = 200;
    const isFastSwipe = Math.abs(info.velocity.x) > velocityThreshold;
    
    if (isOpen) {
      // If already open, close it if we swipe right or drag back more than halfway
      if (info.offset.x > totalActionsWidth / 2 || (isFastSwipe && info.velocity.x > velocityThreshold)) {
        setIsOpen(false);
        controls.start({ x: 0 });
      } else {
        controls.start({ x: -totalActionsWidth });
      }
    } else {
      // If closed, open it if we swipe left or drag more than halfway
      if (info.offset.x < -totalActionsWidth / 2 || (isFastSwipe && info.velocity.x < -velocityThreshold)) {
        setIsOpen(true);
        controls.start({ x: -totalActionsWidth });
      } else {
        controls.start({ x: 0 });
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    controls.start({ x: 0 });
    if (onDelete) {
      onDelete();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    controls.start({ x: 0 });
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-muted">
      {/* Action Buttons Background Area */}
      <div 
        className="absolute right-0 top-0 bottom-0 flex items-center bg-muted transition-opacity"
        style={{ width: totalActionsWidth, opacity: isOpen ? 1 : 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-20 rounded-none hover:bg-blue-600 bg-blue-500 text-white transition-colors"
          onClick={handleEdit}
          data-testid={`button-edit-category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Pencil className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-20 rounded-none hover:bg-destructive/90 bg-destructive text-white transition-colors"
          onClick={handleDelete}
          data-testid={`button-delete-category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -totalActionsWidth, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        transition={{ type: "spring", stiffness: 600, damping: 40 }}
        className="relative z-10"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            controls.start({ x: 0 });
          } else if (onClick) {
            onClick();
          }
        }}
      >
        <Card className="hover-elevate cursor-grab active:cursor-grabbing border-none rounded-none shadow-none" data-testid={`card-category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
          <CardContent className="p-4 bg-card">
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
      </motion.div>
    </div>
  );
}
