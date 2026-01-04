import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

const expenseFormSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ExpenseEntryDialogProps {
  categories: Category[];
  onAddExpense: (expense: ExpenseFormValues) => void;
  defaultCategoryId?: string | null;
}

export default function ExpenseEntryDialog({ categories, onAddExpense, defaultCategoryId }: ExpenseEntryDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: "",
      categoryId: defaultCategoryId || "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  // Update categoryId when defaultCategoryId changes or dialog opens
  useEffect(() => {
    if (open && defaultCategoryId) {
      form.setValue("categoryId", defaultCategoryId);
    }
  }, [open, defaultCategoryId, form]);

  const onSubmit = (values: ExpenseFormValues) => {
    onAddExpense(values);
    form.reset({
      amount: "",
      categoryId: defaultCategoryId || "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });
    setOpen(false);
  };

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="h-16 w-16 rounded-full shadow-lg z-50"
        style={{ position: 'fixed', bottom: '15px', right: '15px' }}
        data-testid="button-add-expense"
      >
        <Plus className="h-8 w-8" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-add-expense">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Expense</DialogTitle>
          <DialogDescription>
            Track your spending by adding a new expense
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10 text-3xl font-bold h-16"
                        data-testid="input-amount"
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          data-testid={`option-category-${category.id}`}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      data-testid="input-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional details..."
                      className="resize-none text-sm"
                      rows={3}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-4 font-semibold" data-testid="button-submit-expense">
              Add Expense
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
