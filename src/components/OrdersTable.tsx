import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: string;
  amount: string;
  status: string;
  date: string;
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Verification":
      return (
        <Badge variant="outline" className="border-warning text-warning">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "Verified":
      return (
        <Badge variant="outline" className="border-success text-success">
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    case "Assigned to Seller":
      return (
        <Badge variant="outline" className="border-primary text-primary">
          Assigned
        </Badge>
      );
    case "In Progress":
      return (
        <Badge variant="outline" className="border-chart-4 text-chart-4">
          In Progress
        </Badge>
      );
    case "Delivered":
      return (
        <Badge variant="outline" className="border-success text-success">
          <CheckCircle className="mr-1 h-3 w-3" />
          Delivered
        </Badge>
      );
    case "Rejected":
      return (
        <Badge variant="outline" className="border-destructive text-destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell className="max-w-[200px] truncate">{order.items}</TableCell>
              <TableCell className="font-semibold">{order.amount}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewOrder(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
