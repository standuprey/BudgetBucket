import { useState } from 'react';
import MonthlyRecap from '../MonthlyRecap';
import { Button } from '@/components/ui/button';

export default function MonthlyRecapExample() {
  const [open, setOpen] = useState(false);

  const mockCategories = [
    { name: "Rent", spent: 5900, budget: 5900 },
    { name: "Groceries", spent: 1450, budget: 1500 },
    { name: "Utilities", spent: 480, budget: 500 },
    { name: "Car", spent: 180, budget: 200 },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Monthly Recap</Button>
      <MonthlyRecap
        open={open}
        onOpenChange={setOpen}
        month="November 2025"
        totalSpent={12500}
        totalBudget={14010}
        totalIncome={16060}
        savings={3560}
        categories={mockCategories}
        onAdjustBudget={() => console.log('Adjust budget clicked')}
      />
    </>
  );
}
