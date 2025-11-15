// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/hooks/use-toast";

// interface Order {
//   id: string;
//   customer: string;
//   items: string;
//   amount: string;
//   status: string;
//   date: string;
// }

// interface OrderDetailsDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   order: Order | null;
//   onStatusUpdate: (orderId: string, newStatus: string) => void;
// }

// const statusOptions = [
//   "Pending Verification",
//   "Verified",
//   "Assigned to Seller",
//   "In Progress",
//   "Dispatched",
//   "Delivered",
//   "Rejected",
// ];

// export function OrderDetailsDialog({
//   open,
//   onOpenChange,
//   order,
//   onStatusUpdate,
// }: OrderDetailsDialogProps) {
//   const [selectedStatus, setSelectedStatus] = useState(order?.status || "");

//   if (!order) return null;

//   const handleStatusUpdate = () => {
//     onStatusUpdate(order.id, selectedStatus);
//     toast({
//       title: "Order status updated",
//       description: `Order ${order.id} status changed to ${selectedStatus}`,
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Order Details - {order.id}</DialogTitle>
//           <DialogDescription>View and manage order information</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-3 gap-4">
//             <Label className="text-muted-foreground">Customer:</Label>
//             <span className="col-span-2 font-medium">{order.customer}</span>
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <Label className="text-muted-foreground">Items:</Label>
//             <span className="col-span-2">{order.items}</span>
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <Label className="text-muted-foreground">Amount:</Label>
//             <span className="col-span-2 font-semibold text-primary">{order.amount}</span>
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <Label className="text-muted-foreground">Date:</Label>
//             <span className="col-span-2">{order.date}</span>
//           </div>
//           <div className="grid grid-cols-3 items-center gap-4">
//             <Label className="text-muted-foreground">Current Status:</Label>
//             <Badge className="col-span-2 w-fit">{order.status}</Badge>
//           </div>
//           <div className="grid gap-2 pt-4">
//             <Label htmlFor="status">Update Status</Label>
//             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//               <SelectTrigger id="status">
//                 <SelectValue placeholder="Select new status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {statusOptions.map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Close
//           </Button>
//           <Button onClick={handleStatusUpdate}>Update Status</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Phone, Calendar, Clock, CreditCard } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
  phone: string;
  created_at: any;
  updated_at: any;
  estimatedDelivery?: any;
  trackingNumber?: string;
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

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: DisplayOrder | null;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const statusOptions = [
  "Pending Verification",
  "Verified",
  "Assigned to Seller",
  "In Progress",
  "Dispatched",
  "Delivered",
  "Rejected",
];

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onStatusUpdate,
}: OrderDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const handleStatusUpdate = () => {
    onStatusUpdate(order.id, selectedStatus);
    onOpenChange(false);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      if (timestamp.toDate) {
        return new Date(timestamp.toDate()).toLocaleString('en-IN');
      }
      return new Date(timestamp).toLocaleString('en-IN');
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Details</DialogTitle>
          <DialogDescription>
            Order ID: <span className="font-semibold">{order.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid gap-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{order.rawData.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono text-sm">{order.rawData.user_id}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </h3>
            <div className="rounded-lg border p-4">
              <p className="text-sm">{order.rawData.delivery_address || "No address provided"}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h3>
            <div className="rounded-lg border">
              <div className="divide-y">
                {order.rawData.items?.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between p-4 bg-muted/30">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ₹{order.rawData.total_amount}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Timeline
            </h3>
            <div className="grid gap-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Created:
                </span>
                <span className="font-medium">{formatDate(order.rawData.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">{formatDate(order.rawData.updated_at)}</span>
              </div>
              {order.rawData.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-medium">{formatDate(order.rawData.estimatedDelivery)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          {order.rawData.statusHistory && order.rawData.statusHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Status History</h3>
              <div className="rounded-lg border">
                <div className="divide-y">
                  {order.rawData.statusHistory.map((entry: StatusHistoryEntry, index: number) => (
                    <div key={index} className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-1">{entry.status}</Badge>
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid gap-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <Badge variant="outline">{order.status}</Badge>
              </div>
              {order.rawData.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <span className="font-mono text-sm">{order.rawData.trackingNumber}</span>
                </div>
              )}
              {order.rawData.prescription_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prescription ID:</span>
                  <span className="font-mono text-sm">{order.rawData.prescription_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Update Status Section */}
          <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
            <Label htmlFor="status" className="text-base font-semibold">
              Update Order Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={selectedStatus === order.status}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}