import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { Expense } from "@/components/ExpenseList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

type ExpenseChartProps = {
  expenses: Expense[];
};

function buildCategoryData(expenses: Expense[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = e.category || "Other";
    map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
  }
  return Array.from(map.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const data = buildCategoryData(expenses);

  return (
    <Card className="p-4 bg-card">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Spending by Category
      </h3>
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart data={data} margin={{ left: 8, right: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="amount"
            fill="var(--color-amount)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
};

export default ExpenseChart;
