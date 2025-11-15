import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Package, UserPlus, FileCheck } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "order",
    title: "New order placed",
    description: "Rajesh Kumar ordered Paracetamol 650mg",
    time: "2 minutes ago",
    icon: Package,
    iconBg: "bg-primary-light",
    iconColor: "text-primary",
  },
  {
    id: 2,
    type: "verification",
    title: "Prescription verified",
    description: "Order #ORD-002 approved by Admin",
    time: "15 minutes ago",
    icon: FileCheck,
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    id: 3,
    type: "delivery",
    title: "Order delivered",
    description: "Order #ORD-004 successfully delivered",
    time: "1 hour ago",
    icon: CheckCircle,
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    id: 4,
    type: "seller",
    title: "New seller registered",
    description: "HealthPlus Pharmacy joined the platform",
    time: "3 hours ago",
    icon: UserPlus,
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`rounded-full p-2 ${activity.iconBg}`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
