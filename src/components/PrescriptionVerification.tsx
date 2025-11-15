// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle, XCircle, FileText } from "lucide-react";

// const prescriptions = [
//   {
//     id: "PRX-001",
//     orderId: "ORD-001",
//     customer: "Rajesh Kumar",
//     uploadedAt: "2025-01-15 10:30 AM",
//     status: "pending",
//   },
//   {
//     id: "PRX-002",
//     orderId: "ORD-002",
//     customer: "Priya Sharma",
//     uploadedAt: "2025-01-15 09:15 AM",
//     status: "pending",
//   },
//   {
//     id: "PRX-003",
//     orderId: "ORD-005",
//     customer: "Vikram Singh",
//     uploadedAt: "2025-01-13 02:45 PM",
//     status: "pending",
//   },
// ];

// export function PrescriptionVerification() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5 text-primary" />
//           Prescription Verification Queue
//         </CardTitle>
//         <CardDescription>Review and verify uploaded prescriptions</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {prescriptions.map((prescription) => (
//           <div
//             key={prescription.id}
//             className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
//           >
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <p className="font-semibold text-foreground">{prescription.customer}</p>
//                 <Badge variant="outline" className="border-warning text-warning">
//                   Pending
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Order: {prescription.orderId} • Uploaded: {prescription.uploadedAt}
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm">
//                 View
//               </Button>
//               <Button size="sm" className="bg-success hover:bg-success/90">
//                 <CheckCircle className="mr-1 h-4 w-4" />
//                 Verify
//               </Button>
//               <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
//                 <XCircle className="mr-1 h-4 w-4" />
//                 Reject
//               </Button>
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

interface Prescription {
  id?: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  order_id?: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  delivery_address: string;
  notes?: string;
  status: "pending" | "verified" | "rejected" | "assigned" | "completed";
  assigned_seller_id?: string;
  assigned_seller_name?: string;
  verified_by?: string;
  verified_at?: Timestamp;
  rejection_reason?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export function PrescriptionVerification() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Real-time listener for pending prescriptions
  useEffect(() => {
    console.log("👂 Setting up prescriptions listener...");

    try {
      const prescriptionsRef = collection(db, "prescriptions");
      const q = query(prescriptionsRef, where("status", "==", "pending"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let fetchedPrescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Prescription[];

          // Sort by created_at in memory
          fetchedPrescriptions = fetchedPrescriptions.sort((a, b) => {
            const aTime = a.created_at?.toMillis() || 0;
            const bTime = b.created_at?.toMillis() || 0;
            return bTime - aTime; // newest first
          });

          console.log(`✅ Received ${fetchedPrescriptions.length} prescriptions`);
          setPrescriptions(fetchedPrescriptions);
          setLoading(false);
        },
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
    } catch (error: any) {
      console.error("❌ Error setting up listener:", error);
      toast({
        title: "Error",
        description: "Failed to setup prescriptions listener",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, []);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  const handleView = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDialogOpen(true);
  };

  const handleVerify = async (prescriptionId: string) => {
    try {
      const prescriptionRef = doc(db, "prescriptions", prescriptionId);
      await updateDoc(prescriptionRef, {
        status: "verified",
        verified_by: "admin",
        verified_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      toast({
        title: "Prescription verified",
        description: "Prescription has been approved successfully.",
      });
    } catch (error: any) {
      console.error("Error verifying:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (prescriptionId: string) => {
    try {
      const reason = prompt("Please provide a rejection reason:");
      if (!reason) return;

      const prescriptionRef = doc(db, "prescriptions", prescriptionId);
      await updateDoc(prescriptionRef, {
        status: "rejected",
        rejection_reason: reason,
        verified_by: "admin",
        verified_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      toast({
        title: "Prescription rejected",
        description: "Customer will be notified.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Error rejecting:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prescription Verification Queue
          </CardTitle>
          <CardDescription>Review and verify uploaded prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading prescriptions...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Prescription Verification Queue
        </CardTitle>
        <CardDescription>Review and verify uploaded prescriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No pending prescriptions
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {prescription.customer_name}
                  </p>
                  <Badge variant="outline" className="border-warning text-warning">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {prescription.order_id ? `Order: ${prescription.order_id}` : "No order ID"} • 
                  Uploaded: {formatDate(prescription.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(prescription)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90"
                  onClick={() => handleVerify(prescription.id!)}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Verify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleReject(prescription.id!)}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

