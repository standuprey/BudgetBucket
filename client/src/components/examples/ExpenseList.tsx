import ExpenseList from '../ExpenseList';

export default function ExpenseListExample() {
  const mockExpenses = [
    {
      id: "1",
      amount: 125.50,
      categoryName: "Groceries",
      categoryIcon: "ShoppingCart",
      date: "2025-11-20",
      notes: "Weekly shopping at Whole Foods"
    },
    {
      id: "2",
      amount: 45.00,
      categoryName: "Utilities",
      categoryIcon: "Zap",
      date: "2025-11-19",
    },
    {
      id: "3",
      amount: 5900.00,
      categoryName: "Rent",
      categoryIcon: "Home",
      date: "2025-11-01",
      notes: "Monthly rent payment"
    },
  ];

  return <ExpenseList expenses={mockExpenses} />;
}
