import CategoryProgressCard from '../CategoryProgressCard';

export default function CategoryProgressCardExample() {
  return (
    <div className="space-y-4 max-w-2xl">
      <CategoryProgressCard
        categoryName="Rent"
        icon="Home"
        spent={5900}
        budget={5900}
      />
      <CategoryProgressCard
        categoryName="Groceries"
        icon="ShoppingCart"
        spent={1200}
        budget={1500}
      />
      <CategoryProgressCard
        categoryName="Utilities"
        icon="Zap"
        spent={520}
        budget={500}
      />
    </div>
  );
}
