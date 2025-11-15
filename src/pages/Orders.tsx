import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { updateOrderStatus } from "@/firebase/firestore-service";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { OrdersTable } from "@/components/OrdersTable";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  phone: string;
  prescription_id: string | null;
  status: string;
}

interface StatusHistoryEntry {
  status: string;
  note: string;
  timestamp: any;
}

interface FirebaseOrder {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  statusHistory: StatusHistoryEntry[];
  delivery_address: string;
  phone?: string;
  created_at: any;
  updated_at: any;
  estimatedDelivery?: any;
  trackingNumber?: string | null;
  prescription_id?: string;
}

interface DisplayOrder {
  id: string;
  customer: string;
  items: string;
  amount: string;
  status: string;
  date: string;
  rawData: FirebaseOrder;
}

// Status mapping for display
const statusMapping: { [key: string]: string } = {
  "pending": "Pending Verification",
  "Confirmed": "Verified",
  "Processing": "In Progress",
  "Shipped": "Dispatched",
  "Delivered": "Delivered",
  "Cancelled": "Rejected"
};

// Reverse mapping for Firebase updates
const reverseStatusMapping: { [key: string]: string } = {
  "Pending Verification": "pending",
  "Verified": "Confirmed",
  "Assigned to Seller": "Processing",
  "In Progress": "Processing",
  "Dispatched": "Shipped",
  "Delivered": "Delivered",
  "Rejected": "Cancelled"
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 Starting real-time order listener...");

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("created_at", "desc"));

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("✅ Received order snapshot");
        console.log("📊 Number of orders:", snapshot.size);

        const ordersData: DisplayOrder[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<FirebaseOrder, 'id'>;

          // Extract customer info (phone from first item or user_id)
          const customer =
            data.items?.[0]?.phone ||
            data.phone ||
            data.user_id?.substring(0, 10) ||
            "Unknown";

          // Format items list
          const itemsList = data.items
            ?.map((item: OrderItem) => `${item.name} (×${item.quantity})`)
            .join(", ") || "No items";

          // Format amount
          const amount = `₹${data.total_amount?.toFixed(2) || 0}`;

          // Map status to admin-friendly format
          const mappedStatus = statusMapping[data.status] || data.status;

          // Format date
          let date = "N/A";
          try {
            if (data.created_at?.toDate) {
              date = new Date(data.created_at.toDate()).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            } else if (data.created_at) {
              date = new Date(data.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
          } catch (err) {
            console.error("Error formatting date:", err);
          }

          ordersData.push({
            id: docSnap.id,
            customer,
            items: itemsList,
            amount,
            status: mappedStatus,
            date,
            rawData: { ...data, id: docSnap.id }
          });
        });

        console.log("✅ Processed orders:", ordersData.length);
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error in order listener:", error);
        toast({
          title: "Error",
          description: `Failed to load orders: ${error.message}`,
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Cleaning up order listener");
      unsubscribe();
    };
  }, []);

  const handleViewOrder = (order: DisplayOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);

      // Map admin status to Firebase status
      const firebaseStatus = reverseStatusMapping[newStatus] || newStatus;

      // Generate appropriate note based on status
      const statusNotes: { [key: string]: string } = {
        "Pending Verification": "Order is pending verification",
        "Verified": "Order has been verified and approved",
        "Assigned to Seller": "Order has been assigned to pharmacy",
        "In Progress": "Order is being prepared",
        "Dispatched": "Order has been dispatched for delivery",
        "Delivered": "Order has been successfully delivered",
        "Rejected": "Order has been rejected"
      };

      const note = statusNotes[newStatus] || `Status updated to ${newStatus}`;

      // Use the firestore-service function
      await updateOrderStatus(orderId, firebaseStatus, note);

      // Update local state for immediate UI feedback
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Update selected order if it's the one being modified
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      console.log("✅ Order status updated successfully");
    } catch (error: any) {
      console.error("❌ Error updating order status:", error);
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <AdminHeader />

          <main className="flex-1 space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
              <p className="text-muted-foreground">
                View and manage all customer orders in real-time
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <svg
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-lg font-medium">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here once customers place them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                  </p>
                </div>
                <OrdersTable orders={orders} onViewOrder={handleViewOrder} />
              </div>
            )}
          </main>
        </div>
      </div>

      <OrderDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </SidebarProvider>
  );
};

export default Orders;