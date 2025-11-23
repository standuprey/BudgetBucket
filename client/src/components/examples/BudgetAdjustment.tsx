import BudgetAdjustment from '../BudgetAdjustment';

export default function BudgetAdjustmentExample() {
  const mockCategories = [
    { id: "1", name: "Rent", monthlyBudget: 5900 },
    { id: "2", name: "Groceries", monthlyBudget: 1500 },
    { id: "3", name: "Utilities", monthlyBudget: 500 },
  ];

  return (
    <BudgetAdjustment
      categories={mockCategories}
      totalIncome={16060}
      onSave={(categories, income) => console.log('Saved:', { categories, income })}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
