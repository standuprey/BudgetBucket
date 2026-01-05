import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  monthlyBudget: z.string().min(1, "Budget is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Must be a non-negative number"),
  icon: z.string().min(1, "Icon is required"),
  isAnnual: z.boolean().default(false),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const AVAILABLE_ICONS = [
  { name: "Home", icon: Home },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Users", icon: Users },
  { name: "Car", icon: Car },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Zap", icon: Zap },
  { name: "Sparkles", icon: Sparkles },
  { name: "Wifi", icon: Wifi },
  { name: "Syringe", icon: Syringe },
  { name: "Wrench", icon: Wrench },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Shirt", icon: Shirt },
  { name: "Plane", icon: Plane },
  { name: "Scissors", icon: Scissors },
  { name: "PartyPopper", icon: PartyPopper },
  { name: "Cat", icon: Cat },
  { name: "Sparkle", icon: Sparkle },
  { name: "DollarSign", icon: DollarSign },
  { name: "Gift", icon: Gift },
  { name: "Star", icon: Star },
];

interface CategoryEntryDialogProps {
  onAddCategory: (category: { name: string; monthlyBudget: number; icon: string; isAnnual?: boolean }) => void;
  onUpdateCategory?: (id: string, updates: { name: string; monthlyBudget: number; icon: string; isAnnual?: boolean }) => void;
  trigger?: React.ReactNode;
  mode?: "add" | "edit";
  initialData?: {
    id: string;
    name: string;
    monthlyBudget: number;
    icon: string;
    isAnnual: boolean;
  };
  triggerClassName?: string;
}

export default function CategoryEntryDialog({ 
  onAddCategory, 
  onUpdateCategory, 
  trigger, 
  mode = "add", 
  initialData,
  triggerClassName 
}: CategoryEntryDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      monthlyBudget: initialData?.monthlyBudget?.toString() || "",
      icon: initialData?.icon || "DollarSign",
      isAnnual: initialData?.isAnnual || false,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        name: initialData.name,
        monthlyBudget: initialData.monthlyBudget.toString(),
        icon: initialData.icon,
        isAnnual: initialData.isAnnual,
      });
    }
  }, [open, initialData, form]);

  const isAnnual = form.watch("isAnnual");

  const onSubmit = (values: CategoryFormValues) => {
    if (mode === "edit" && initialData && onUpdateCategory) {
      const updates: any = {};
      
      // Explicitly compare values to initialData to determine what changed
      if (values.name !== initialData.name) {
        updates.name = values.name;
      }
      
      const newBudget = parseFloat(values.monthlyBudget);
      if (newBudget !== initialData.monthlyBudget) {
        updates.monthlyBudget = newBudget;
      }
      
      if (values.icon !== initialData.icon) {
        updates.icon = values.icon;
      }
      
      if (values.isAnnual !== initialData.isAnnual) {
        updates.isAnnual = values.isAnnual;
      }

      console.log("Submitting updates:", updates); // Debug log

      if (Object.keys(updates).length > 0) {
        onUpdateCategory(initialData.id, updates);
      } else {
         // Even if nothing changed, close the dialog
         setOpen(false);
      }
    } else {
      onAddCategory({
        name: values.name,
        monthlyBudget: parseFloat(values.monthlyBudget),
        icon: values.icon,
        isAnnual: values.isAnnual,
      });
    }
    setOpen(false);
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className={triggerClassName}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full py-6 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
          data-testid="button-add-category-trigger"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" data-testid={`dialog-${mode}-category`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {mode === "edit" ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit" 
                ? "Update your budget category settings" 
                : "Create a new budget category to track your spending"}
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
                      <Input
                        {...field}
                        placeholder="e.g. Groceries, Rent, Fun"
                        className="h-12"
                        data-testid="input-category-name"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {isAnnual ? "Annual Budget" : "Monthly Budget"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                            $
                          </span>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0.00"
                            className="pl-10 text-xl font-bold h-12"
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
                  name="isAnnual"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-is-annual"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Annual Budget
                        </FormLabel>
                        <FormDescription>
                          Track this category across the entire year rather than monthly.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Select Icon</FormLabel>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                        <Button
                          key={name}
                          type="button"
                          variant={field.value === name ? "default" : "outline"}
                          className={`h-12 w-12 p-0 ${field.value === name ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          onClick={() => field.onChange(name)}
                          data-testid={`button-icon-${name}`}
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full py-4 font-semibold" data-testid="button-submit-category">
                {mode === "edit" ? "Save Changes" : "Create Category"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
