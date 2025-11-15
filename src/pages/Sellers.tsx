import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getAllSellers,
  addSeller,
  updateSeller,
  deleteSeller,
  toggleSellerStatus,
  listenToSellers,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    active: true,
  });

  // Real-time listener for sellers
  useEffect(() => {
    console.log("👂 Setting up real-time sellers listener...");

    const unsubscribe = listenToSellers(
      (fetchedSellers) => {
        console.log(`✅ Received ${fetchedSellers.length} sellers`);
        setSellers(fetchedSellers);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error in sellers listener:", error);
        toast({
          title: "Error",
          description: "Failed to load sellers: " + error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Cleaning up sellers listener");
      unsubscribe();
    };
  }, []);

  const handleAddSeller = () => {
    setEditingSeller(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      pincode: "",
      address: "",
      active: true,
    });
    setDialogOpen(true);
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSeller(seller);
    setFormData({
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      city: seller.city,
      pincode: seller.pincode,
      address: seller.address || "",
      active: seller.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSeller) {
        // Update existing seller
        await updateSeller(editingSeller.id!, formData);
        toast({
          title: "Success",
          description: "Seller updated successfully",
        });
      } else {
        // Add new seller
        await addSeller(formData);
        toast({
          title: "Success",
          description: "Seller added successfully",
        });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (sellerId: string, currentStatus: boolean) => {
    try {
      await toggleSellerStatus(sellerId, !currentStatus);
      toast({
        title: "Success",
        description: `Seller ${!currentStatus ? "activated" : "deactivated"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSeller = async (sellerId: string, sellerName: string) => {
    if (!confirm(`Are you sure you want to delete ${sellerName}?`)) return;

    try {
      await deleteSeller(sellerId);
      toast({
        title: "Success",
        description: "Seller deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sellers Management</h1>
                <p className="text-muted-foreground">
                  Manage pharmacy partners and their details
                </p>
              </div>
              <Button onClick={handleAddSeller}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Seller
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading sellers...</span>
              </div>
            ) : sellers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-muted-foreground text-lg">No sellers found</p>
                <Button onClick={handleAddSeller}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Seller
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sellers.map((seller) => (
                  <Card key={seller.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{seller.name}</CardTitle>
                        <Badge variant={seller.active ? "default" : "secondary"}>
                          {seller.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {seller.city}, {seller.pincode}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {seller.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {seller.phone}
                      </div>

                      {/* Metrics */}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Orders:</span>
                          <span className="font-semibold">{seller.total_orders || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completed:</span>
                          <span className="font-semibold">{seller.completed_orders || 0}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditSeller(seller)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(seller.id!, seller.active)}
                        >
                          {seller.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive"
                          onClick={() => handleDeleteSeller(seller.id!, seller.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add/Edit Seller Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingSeller ? "Edit Seller" : "Add New Seller"}
            </DialogTitle>
            <DialogDescription>
              {editingSeller
                ? "Update seller information"
                : "Add a new pharmacy partner"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Pharmacy Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., HealthPlus Pharmacy"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="pharmacy@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Chennai"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="600001"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, Area Name"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active Status</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSeller ? "Update Seller" : "Add Seller"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Sellers;