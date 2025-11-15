import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Orders",
    value: "2,543",
    change: "+12.5%",
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary-light",
  },
  {
    title: "Active Sellers",
    value: "186",
    change: "+8.2%",
    icon: Users,
    color: "text-success",
    bgColor: "bg-success-light",
  },
  {
    title: "Products",
    value: "1,247",
    change: "+23.1%",
    icon: Package,
    color: "text-warning",
    bgColor: "bg-warning-light",
  },
  {
    title: "Revenue",
    value: "₹4.2M",
    change: "+15.3%",
    icon: TrendingUp,
    color: "text-chart-4",
    bgColor: "bg-blue-50",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-success">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
