// import { useState, useEffect } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AdminSidebar } from "@/components/AdminSidebar";
// import { AdminHeader } from "@/components/AdminHeader";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { FileText, Loader2, Eye, CheckCircle, XCircle, UserPlus } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import {
//   listenToPrescriptions,
//   verifyPrescription,
//   rejectPrescription,
//   assignPrescriptionToSeller,
//   getActiveSellers,
//   autoAssignPrescription,
//   type Prescription,
//   type Seller,
// } from "@/firebase/sellers-prescriptions-service";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// const Prescriptions = () => {
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);
//   const [assignDialogOpen, setAssignDialogOpen] = useState(false);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
//   const [sellers, setSellers] = useState<Seller[]>([]);
//   const [selectedSellerId, setSelectedSellerId] = useState<string>("");
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"all" | Prescription["status"]>("pending");

//   // Load sellers for assignment
//   useEffect(() => {
//     getActiveSellers()
//       .then(setSellers)
//       .catch((error) => {
//         console.error("Error loading sellers:", error);
//       });
//   }, []);

//   // Real-time listener for prescriptions
//   useEffect(() => {
//     console.log("👂 Setting up real-time prescriptions listener...");

//     const filter = statusFilter === "all" ? undefined : statusFilter;
//     const unsubscribe = listenToPrescriptions(
//       (fetchedPrescriptions) => {
//         console.log(`✅ Received ${fetchedPrescriptions.length} prescriptions`);
//         setPrescriptions(fetchedPrescriptions);
//         setLoading(false);
//       },
//       filter,
//       (error) => {
//         console.error("❌ Error in prescriptions listener:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load prescriptions: " + error.message,
//           variant: "destructive",
//         });
//         setLoading(false);
//       }
//     );

//     return () => {
//       console.log("🧹 Cleaning up prescriptions listener");
//       unsubscribe();
//     };
//   }, [statusFilter]);

//   const handleView = (prescription: Prescription) => {
//     setSelectedPrescription(prescription);
//     setViewDialogOpen(true);
//   };

//   const handleVerify = async (prescription: Prescription) => {
//     try {
//       await verifyPrescription(prescription.id!, "admin"); // Replace with actual admin ID
//       toast({
//         title: "Success",
//         description: "Prescription verified successfully",
//       });
//       setViewDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRejectClick = (prescription: Prescription) => {
//     setSelectedPrescription(prescription);
//     setRejectionReason("");
//     setRejectDialogOpen(true);
//   };

//   const handleRejectSubmit = async () => {
//     if (!selectedPrescription || !rejectionReason.trim()) {
//       toast({
//         title: "Error",
//         description: "Please provide a rejection reason",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await rejectPrescription(selectedPrescription.id!, rejectionReason, "admin");
//       toast({
//         title: "Prescription Rejected",
//         description: "Customer will be notified",
//         variant: "destructive",
//       });
//       setRejectDialogOpen(false);
//       setViewDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAssignClick = (prescription: Prescription) => {
//     setSelectedPrescription(prescription);
//     setSelectedSellerId("");
//     setAssignDialogOpen(true);
//   };

//   const handleAssignSubmit = async () => {
//     if (!selectedPrescription || !selectedSellerId) {
//       toast({
//         title: "Error",
//         description: "Please select a seller",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await assignPrescriptionToSeller(selectedPrescription.id!, selectedSellerId);
//       toast({
//         title: "Success",
//         description: "Prescription assigned to seller",
//       });
//       setAssignDialogOpen(false);
//       setViewDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAutoAssign = async (prescription: Prescription) => {
//     try {
//       // Extract city from delivery address (simple extraction)
//       const city = prescription.delivery_address.split(",").pop()?.trim() || "Unknown";

//       await autoAssignPrescription(prescription.id!, city);
//       toast({
//         title: "Success",
//         description: "Prescription auto-assigned to best available seller",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusBadge = (status: Prescription["status"]) => {
//     const variants = {
//       pending: { variant: "outline" as const, className: "border-warning text-warning" },
//       verified: { variant: "outline" as const, className: "border-success text-success" },
//       assigned: { variant: "outline" as const, className: "border-primary text-primary" },
//       rejected: { variant: "outline" as const, className: "border-destructive text-destructive" },
//       completed: { variant: "outline" as const, className: "border-success text-success" },
//     };

//     const config = variants[status];
//     return (
//       <Badge variant={config.variant} className={config.className}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return "N/A";
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return date.toLocaleString("en-IN", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "N/A";
//     }
//   };

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-background">
//         <AdminSidebar />

//         <div className="flex flex-1 flex-col">
//           <AdminHeader />

//           <main className="flex-1 space-y-6 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground">Prescription Verification</h1>
//                 <p className="text-muted-foreground">
//                   Review and verify uploaded prescriptions
//                 </p>
//               </div>
//               <Select
//                 value={statusFilter}
//                 onValueChange={(value: any) => setStatusFilter(value)}
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Prescriptions</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="verified">Verified</SelectItem>
//                   <SelectItem value="assigned">Assigned</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {loading ? (
//               <div className="flex items-center justify-center py-12">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 <span className="ml-2 text-muted-foreground">Loading prescriptions...</span>
//               </div>
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-primary" />
//                     Verification Queue
//                   </CardTitle>
//                   <CardDescription>
//                     {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}{" "}
//                     {statusFilter !== "all" ? `with status: ${statusFilter}` : "total"}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {prescriptions.length === 0 ? (
//                     <div className="flex h-32 items-center justify-center text-muted-foreground">
//                       No prescriptions found
//                     </div>
//                   ) : (
//                     prescriptions.map((prescription) => (
//                       <div
//                         key={prescription.id}
//                         className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
//                       >
//                         <div className="space-y-2 flex-1">
//                           <div className="flex items-center gap-3">
//                             <p className="font-semibold text-foreground">
//                               {prescription.customer_name}
//                             </p>
//                             {getStatusBadge(prescription.status)}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             Phone: {prescription.customer_phone} • Uploaded:{" "}
//                             {formatDate(prescription.created_at)}
//                           </p>
//                           {prescription.order_id && (
//                             <p className="text-sm text-muted-foreground">
//                               Order ID: {prescription.order_id}
//                             </p>
//                           )}
//                           {prescription.assigned_seller_name && (
//                             <p className="text-sm text-primary">
//                               Assigned to: {prescription.assigned_seller_name}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleView(prescription)}
//                           >
//                             <Eye className="mr-1 h-4 w-4" />
//                             View
//                           </Button>
//                           {prescription.status === "pending" && (
//                             <>
//                               <Button
//                                 size="sm"
//                                 className="bg-success hover:bg-success/90"
//                                 onClick={() => handleVerify(prescription)}
//                               >
//                                 <CheckCircle className="mr-1 h-4 w-4" />
//                                 Verify
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="border-destructive text-destructive"
//                                 onClick={() => handleRejectClick(prescription)}
//                               >
//                                 <XCircle className="mr-1 h-4 w-4" />
//                                 Reject
//                               </Button>
//                             </>
//                           )}
//                           {prescription.status === "verified" && (
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleAssignClick(prescription)}
//                             >
//                               <UserPlus className="mr-1 h-4 w-4" />
//                               Assign
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </main>
//         </div>
//       </div>

//       {/* View Prescription Dialog */}
//       <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
//         <DialogContent className="sm:max-w-[700px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-primary" />
//               Prescription Details
//             </DialogTitle>
//             <DialogDescription>Review prescription information</DialogDescription>
//           </DialogHeader>
//           {selectedPrescription && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
//                 <div>
//                   <p className="text-sm font-medium">Customer Name</p>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedPrescription.customer_name}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Phone</p>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedPrescription.customer_phone}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Status</p>
//                   {getStatusBadge(selectedPrescription.status)}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Uploaded</p>
//                   <p className="text-sm text-muted-foreground">
//                     {formatDate(selectedPrescription.created_at)}
//                   </p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-sm font-medium">Delivery Address</p>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedPrescription.delivery_address}
//                   </p>
//                 </div>
//                 {selectedPrescription.notes && (
//                   <div className="col-span-2">
//                     <p className="text-sm font-medium">Notes</p>
//                     <p className="text-sm text-muted-foreground">
//                       {selectedPrescription.notes}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Prescription Image */}
//               <div className="rounded-lg border p-4">
//                 <p className="text-sm font-medium mb-2">Prescription Image</p>
//                 {selectedPrescription.file_url ? (
//                   <a
//                     href={selectedPrescription.file_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block"
//                   >
//                     <img
//                       src={selectedPrescription.file_url}
//                       alt="Prescription"
//                       className="w-full rounded-lg border"
//                     />
//                   </a>
//                 ) : (
//                   <div className="flex h-48 items-center justify-center border rounded-lg bg-muted/30">
//                     <FileText className="h-12 w-12 text-muted-foreground" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
//               Close
//             </Button>
//             {selectedPrescription?.status === "pending" && (
//               <>
//                 <Button
//                   variant="outline"
//                   className="border-destructive text-destructive"
//                   onClick={() => {
//                     setViewDialogOpen(false);
//                     handleRejectClick(selectedPrescription);
//                   }}
//                 >
//                   <XCircle className="mr-1 h-4 w-4" />
//                   Reject
//                 </Button>
//                 <Button
//                   className="bg-success hover:bg-success/90"
//                   onClick={() => handleVerify(selectedPrescription)}
//                 >
//                   <CheckCircle className="mr-1 h-4 w-4" />
//                   Verify
//                 </Button>
//               </>
//             )}
//             {selectedPrescription?.status === "verified" && (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={() => handleAutoAssign(selectedPrescription)}
//                 >
//                   Auto Assign
//                 </Button>
//                 <Button onClick={() => handleAssignClick(selectedPrescription)}>
//                   <UserPlus className="mr-1 h-4 w-4" />
//                   Assign to Seller
//                 </Button>
//               </>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Assign to Seller Dialog */}
//       <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Assign to Seller</DialogTitle>
//             <DialogDescription>
//               Select a pharmacy to fulfill this prescription
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Select Seller</Label>
//               <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose a seller" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {sellers.map((seller) => (
//                     <SelectItem key={seller.id} value={seller.id!}>
//                       {seller.name} - {seller.city} ({seller.total_orders || 0} orders)
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAssignSubmit}>Assign</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Reject Prescription Dialog */}
//       <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Reject Prescription</DialogTitle>
//             <DialogDescription>
//               Please provide a reason for rejection
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="reason">Rejection Reason</Label>
//               <Textarea
//                 id="reason"
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 placeholder="e.g., Prescription is unclear, expired, or incomplete"
//                 rows={4}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleRejectSubmit}
//               disabled={!rejectionReason.trim()}
//             >
//               Reject Prescription
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </SidebarProvider>
//   );
// };

// export default Prescriptions;

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Eye, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  listenToPrescriptions,
  verifyPrescription,
  rejectPrescription,
  assignPrescriptionToSeller,
  getActiveSellers,
  autoAssignPrescription,
  type Prescription,
  type Seller,
} from "@/firebase/sellers-prescriptions-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Prescription["status"]>("pending");

  // Load sellers for assignment
  useEffect(() => {
    getActiveSellers()
      .then(setSellers)
      .catch((error) => {
        console.error("Error loading sellers:", error);
      });
  }, []);

  // Real-time listener for prescriptions
  useEffect(() => {
    console.log("👂 Setting up real-time prescriptions listener...");

    const filter = statusFilter === "all" ? undefined : statusFilter;
    const unsubscribe = listenToPrescriptions(
      (fetchedPrescriptions) => {
        console.log(`✅ Received ${fetchedPrescriptions.length} prescriptions`);
        setPrescriptions(fetchedPrescriptions);
        setLoading(false);
      },
      filter,
      (error) => {
        console.error("❌ Error in prescriptions listener:", error);
        toast({
          title: "Error",
          description: "Failed to load prescriptions: " + error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Cleaning up prescriptions listener");
      unsubscribe();
    };
  }, [statusFilter]);

  const handleView = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleVerify = async (prescription: Prescription) => {
    try {
      await verifyPrescription(prescription.id!, "admin"); // Replace with actual admin ID
      toast({
        title: "Success",
        description: "Prescription verified successfully",
      });
      setViewDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedPrescription || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    try {
      await rejectPrescription(selectedPrescription.id!, rejectionReason, "admin");
      toast({
        title: "Prescription Rejected",
        description: "Customer will be notified",
        variant: "destructive",
      });
      setRejectDialogOpen(false);
      setViewDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAssignClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setSelectedSellerId("");
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedPrescription || !selectedSellerId) {
      toast({
        title: "Error",
        description: "Please select a seller",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignPrescriptionToSeller(selectedPrescription.id!, selectedSellerId);
      toast({
        title: "Success",
        description: "Prescription assigned to seller",
      });
      setAssignDialogOpen(false);
      setViewDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAutoAssign = async (prescription: Prescription) => {
    try {
      // Extract city from delivery address (simple extraction)
      const city = prescription.delivery_address.split(",").pop()?.trim() || "Unknown";

      await autoAssignPrescription(prescription.id!, city);
      toast({
        title: "Success",
        description: "Prescription auto-assigned to best available seller",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Prescription["status"]) => {
    const variants = {
      pending: { variant: "outline" as const, className: "border-warning text-warning" },
      verified: { variant: "outline" as const, className: "border-success text-success" },
      assigned: { variant: "outline" as const, className: "border-primary text-primary" },
      rejected: { variant: "outline" as const, className: "border-destructive text-destructive" },
      completed: { variant: "outline" as const, className: "border-success text-success" },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <AdminHeader />

          <main className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Prescription Verification</h1>
                <p className="text-muted-foreground">
                  Review and verify uploaded prescriptions
                </p>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: any) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prescriptions</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading prescriptions...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Verification Queue
                  </CardTitle>
                  <CardDescription>
                    {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}{" "}
                    {statusFilter !== "all" ? `with status: ${statusFilter}` : "total"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prescriptions.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-muted-foreground">
                      No prescriptions found
                    </div>
                  ) : (
                    prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-foreground">
                              {prescription.customer_name}
                            </p>
                            {getStatusBadge(prescription.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Phone: {prescription.customer_phone} • Uploaded:{" "}
                            {formatDate(prescription.created_at)}
                          </p>
                          {prescription.order_id && (
                            <p className="text-sm text-muted-foreground">
                              Order ID: {prescription.order_id}
                            </p>
                          )}
                          {prescription.assigned_seller_name && (
                            <p className="text-sm text-primary">
                              Assigned to: {prescription.assigned_seller_name}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(prescription)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                          {prescription.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90"
                                onClick={() => handleVerify(prescription)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Verify
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive text-destructive"
                                onClick={() => handleRejectClick(prescription)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {prescription.status === "verified" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignClick(prescription)}
                            >
                              <UserPlus className="mr-1 h-4 w-4" />
                              Assign
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* View Prescription Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prescription Details
            </DialogTitle>
            <DialogDescription>Review prescription information</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Customer Name</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPrescription.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPrescription.customer_phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  {getStatusBadge(selectedPrescription.status)}
                </div>
                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedPrescription.created_at)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPrescription.delivery_address}
                  </p>
                </div>
                {selectedPrescription.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Prescription Image */}
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-2">Prescription Image</p>
                {selectedPrescription.file_url ? (
                  <a
                    href={selectedPrescription.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selectedPrescription.file_url}
                      alt="Prescription"
                      className="w-full rounded-lg border"
                    />
                  </a>
                ) : (
                  <div className="flex h-48 items-center justify-center border rounded-lg bg-muted/30">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedPrescription?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleRejectClick(selectedPrescription);
                  }}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-success hover:bg-success/90"
                  onClick={() => handleVerify(selectedPrescription)}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Verify
                </Button>
              </>
            )}
            {selectedPrescription?.status === "verified" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAutoAssign(selectedPrescription)}
                >
                  Auto Assign
                </Button>
                <Button onClick={() => handleAssignClick(selectedPrescription)}>
                  <UserPlus className="mr-1 h-4 w-4" />
                  Assign to Seller
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Seller Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Seller</DialogTitle>
            <DialogDescription>
              Select a pharmacy to fulfill this prescription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Seller</Label>
              <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No active sellers available. Please add sellers first.
                    </div>
                  ) : (
                    sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id!}>
                        {seller.name} - {seller.city}, {seller.pincode} • {seller.total_orders || 0} orders
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {sellers.length > 0 && selectedSellerId && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Selected Seller Details:</p>
                  {(() => {
                    const selectedSeller = sellers.find(s => s.id === selectedSellerId);
                    return selectedSeller ? (
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <p><strong>Name:</strong> {selectedSeller.name}</p>
                        <p><strong>Location:</strong> {selectedSeller.city}, {selectedSeller.pincode}</p>
                        <p><strong>Contact:</strong> {selectedSeller.phone}</p>
                        <p><strong>Total Orders:</strong> {selectedSeller.total_orders || 0}</p>
                        <p><strong>Completed:</strong> {selectedSeller.completed_orders || 0}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {sellers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: Choose sellers based on location and current workload.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={!selectedSellerId}
            >
              Assign Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Reject Prescription Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Prescription</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Prescription is unclear, expired, or incomplete"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim()}
            >
              Reject Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Prescriptions;