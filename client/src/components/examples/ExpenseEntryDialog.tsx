import ExpenseEntryDialog from '../ExpenseEntryDialog';

export default function ExpenseEntryDialogExample() {
  const mockCategories = [
    { id: "1", name: "Rent", icon: "Home" },
    { id: "2", name: "Groceries", icon: "ShoppingCart" },
    { id: "3", name: "Utilities", icon: "Zap" },
  ];

  const handleAddExpense = (expense: any) => {
    console.log('Expense added:', expense);
  };

  return <ExpenseEntryDialog categories={mockCategories} onAddExpense={handleAddExpense} />;
}
