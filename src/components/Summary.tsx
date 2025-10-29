import { Card } from '@/components/ui/card';
import { Expense } from './ExpenseList';
import { Wallet, TrendingUp, PieChart } from 'lucide-react';

interface SummaryProps {
  expenses: Expense[];
}

export const Summary = ({ expenses }: SummaryProps) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-strong)]">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="h-6 w-6" />
          <h2 className="text-lg font-medium opacity-90">Total Expenses</h2>
        </div>
        <p className="text-4xl font-bold">
          ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </Card>

      {sortedCategories.length > 0 && (
        <Card className="p-6 bg-card shadow-[var(--shadow-elegant)]">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Top Categories</h3>
          </div>
          <div className="space-y-3">
            {sortedCategories.map(([category, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{category}</span>
                    <span className="text-muted-foreground">
                      ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card shadow-[var(--shadow-elegant)]">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Expense</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
