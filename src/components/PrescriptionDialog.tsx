// PrescriptionDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Prescription } from "@/firebase/sellers-prescriptions-service";

interface PrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription | null;
  onVerify: (prescriptionId: string) => void;
  onReject: (prescriptionId: string) => void;
}

export function PrescriptionDialog({
  open,
  onOpenChange,
  prescription,
  onVerify,
  onReject,
}: PrescriptionDialogProps) {
  if (!prescription) return null;

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  const handleVerify = () => {
    onVerify(prescription.id!);
    toast({
      title: "Prescription verified",
      description: `Prescription has been approved successfully.`,
    });
    onOpenChange(false);
  };

  const handleReject = () => {
    const reason = prompt("Please provide a rejection reason:");
    if (!reason) return;

    onReject(prescription.id!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prescription Review
          </DialogTitle>
          <DialogDescription>Review and verify uploaded prescription</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Name:</span>
                <span className="text-sm text-muted-foreground">
                  {prescription.customer_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm text-muted-foreground">
                  {prescription.customer_phone}
                </span>
              </div>
              {prescription.order_id && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order ID:</span>
                  <span className="text-sm text-muted-foreground">
                    {prescription.order_id}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploaded:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(prescription.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Address:</span>
                <span className="text-sm text-muted-foreground">
                  {prescription.delivery_address}
                </span>
              </div>
              {prescription.notes && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notes:</span>
                  <span className="text-sm text-muted-foreground">
                    {prescription.notes}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="outline" className="border-warning text-warning">
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Prescription Image */}
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium mb-2">Prescription Image</p>
            {prescription.file_url ? (
              <a
                href={prescription.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={prescription.file_url}
                  alt="Prescription"
                  className="w-full rounded-lg border object-contain max-h-96"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Failed to load image. Click to view in new tab.
                    </p>
                  </div>
                </div>
              </a>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No prescription image available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleReject}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
          <Button className="bg-success hover:bg-success/90" onClick={handleVerify}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}