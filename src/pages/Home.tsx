import { useState, useEffect } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList, Expense } from "@/components/ExpenseList";
import { Summary } from "@/components/Summary";
import { ExpenseChart } from "@/components/ExpenseChart";
import { expenseAPI, authAPI, authToken } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Home = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      const payload = response.data as any;
      const items = Array.isArray(payload) ? payload : payload?.data;
      setExpenses(Array.isArray(items) ? items : []);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to fetch expenses. Make sure your backend is running on http://localhost:5000",
        variant: "destructive",
      });
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await authAPI.me();
        setUser((data as any)?.user || null);
      } catch {
        // ignore
      }
    };
    loadUser();
  }, []);

  const handleAddExpense = async (expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => {
    try {
      await expenseAPI.add(expense);
      toast({
        title: "Success",
        description: "Expense added successfully!",
      });
      fetchExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseAPI.delete(id);
      toast({
        title: "Success",
        description: "Expense deleted successfully!",
      });
      fetchExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
      console.error("Error deleting expense:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend to clear cookie (if any)
      await authAPI.logout().catch(() => {});
    } finally {
      authToken.remove();
      navigate("/login");
    }
  };

  const goAccount = () => navigate("/account");
  const initial = (user?.name || user?.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">
              Expense Tracker
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={goAccount}
                className="p-0 rounded-full h-9 w-9"
                aria-label="Account"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ExpenseForm onSubmit={handleAddExpense} />
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Recent Expenses
                </h2>
                <ExpenseList
                  expenses={expenses}
                  onDelete={handleDeleteExpense}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Summary
                </h2>
                <Summary expenses={expenses} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Statistics
                </h2>
                <ExpenseChart expenses={expenses} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
