import { useState, useEffect } from "react";
import type { BudgetCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "lucide-react";

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

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  monthlyBudget: z.string().min(1, "Budget is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryEditDialogProps {
  category: BudgetCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<BudgetCategory>) => void;
}

export default function CategoryEditDialog({ category, open, onOpenChange, onSave }: CategoryEditDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      monthlyBudget: "",
      icon: "DollarSign",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        monthlyBudget: category.monthlyBudget.toString(),
        icon: category.icon,
      });
    }
  }, [category, form]);

  const onSubmit = (values: CategoryFormValues) => {
    if (category) {
      onSave(category.id, {
        name: values.name,
        monthlyBudget: parseFloat(values.monthlyBudget),
        icon: values.icon,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-edit-category">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Category</DialogTitle>
          <DialogDescription>
            Update the name, budget, and icon for this category
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Groceries" data-testid="input-category-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Monthly Budget</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10 text-2xl font-bold h-14"
                        data-testid="input-category-budget"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category-icon">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {Object.keys(iconMap).map((iconName) => {
                        const Icon = iconMap[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName} data-testid={`option-icon-${iconName.toLowerCase()}`}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 font-semibold" data-testid="button-save-category">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
