import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, Tag } from 'lucide-react';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center bg-card">
        <p className="text-muted-foreground">No expenses yet. Add your first expense above!</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense._id} className="p-4 bg-card hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground mb-2">{expense.title}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{expense.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(expense._id)}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
