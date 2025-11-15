// import { useState } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AdminSidebar } from "@/components/AdminSidebar";
// import { AdminHeader } from "@/components/AdminHeader";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Pill } from "lucide-react";
// import { ProductDialog } from "@/components/ProductDialog";

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   requiresPrescription: boolean;
//   available: boolean;
// }

// const Products = () => {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
//   const [products, setProducts] = useState<Product[]>([
//     {
//       id: "1",
//       name: "Paracetamol 650mg",
//       category: "Fever",
//       price: 35,
//       requiresPrescription: false,
//       available: true,
//     },
//     {
//       id: "2",
//       name: "Amoxicillin 500mg",
//       category: "Antibiotic",
//       price: 120,
//       requiresPrescription: true,
//       available: true,
//     },
//     {
//       id: "3",
//       name: "Vitamin C 1000mg",
//       category: "Supplements",
//       price: 250,
//       requiresPrescription: false,
//       available: true,
//     },
//     {
//       id: "4",
//       name: "Azithromycin 500mg",
//       category: "Antibiotic",
//       price: 475,
//       requiresPrescription: true,
//       available: true,
//     },
//     {
//       id: "5",
//       name: "Insulin Glargine",
//       category: "Diabetes",
//       price: 2100,
//       requiresPrescription: true,
//       available: false,
//     },
//     {
//       id: "6",
//       name: "Blood Pressure Monitor",
//       category: "Medical Devices",
//       price: 1250,
//       requiresPrescription: false,
//       available: true,
//     },
//   ]);

//   const handleAddProduct = () => {
//     setSelectedProduct(undefined);
//     setDialogOpen(true);
//   };

//   const handleEditProduct = (product: Product) => {
//     setSelectedProduct(product);
//     setDialogOpen(true);
//   };

//   const handleSaveProduct = (productData: Omit<Product, "id"> & { id?: string }) => {
//     if (productData.id) {
//       // Edit existing
//       setProducts((prev) =>
//         prev.map((p) => (p.id === productData.id ? { ...productData, id: p.id } : p))
//       );
//     } else {
//       // Add new
//       const newProduct = {
//         ...productData,
//         id: (products.length + 1).toString(),
//       };
//       setProducts((prev) => [...prev, newProduct]);
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
//                 <h1 className="text-3xl font-bold text-foreground">Products Catalog</h1>
//                 <p className="text-muted-foreground">
//                   Manage medicines and healthcare products
//                 </p>
//               </div>
//               <Button onClick={handleAddProduct}>Add New Product</Button>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {products.map((product) => (
//                 <Card key={product.id}>
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="rounded-full bg-primary-light p-2">
//                           <Pill className="h-4 w-4 text-primary" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-base">{product.name}</CardTitle>
//                           <CardDescription className="text-xs">{product.category}</CardDescription>
//                         </div>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-2xl font-bold text-primary">₹{product.price}</span>
//                       <Badge variant={product.available ? "default" : "secondary"}>
//                         {product.available ? "In Stock" : "Out of Stock"}
//                       </Badge>
//                     </div>
//                     {product.requiresPrescription && (
//                       <Badge variant="outline" className="border-warning text-warning">
//                         Prescription Required
//                       </Badge>
//                     )}
//                     <div className="flex gap-2 pt-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1"
//                         onClick={() => handleEditProduct(product)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1"
//                         onClick={() => handleEditProduct(product)}
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </main>
//         </div>
//       </div>

//       <ProductDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         product={selectedProduct}
//         onSave={handleSaveProduct}
//       />
//     </SidebarProvider>
//   );
// };

// export default Products;


import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAllSellers, type Seller } from "@/firebase/sellers-prescriptions-service";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  description: string;
  seller_id: string;
  seller_name?: string;
  image: string;
  requiresPrescription: boolean;
  available: boolean;
  created_at?: any;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    rating: 0,
    stock: 0,
    description: "",
    seller_id: "",
    image: "",
    requiresPrescription: false,
    available: true,
  });

  // Load sellers
  useEffect(() => {
    getAllSellers()
      .then((fetchedSellers) => {
        setSellers(fetchedSellers);
        console.log("✅ Loaded sellers:", fetchedSellers.length);
      })
      .catch((error) => {
        console.error("❌ Error loading sellers:", error);
        toast({
          title: "Error",
          description: "Failed to load sellers",
          variant: "destructive",
        });
      });
  }, []);

  // Real-time listener for products
  useEffect(() => {
    console.log("👂 Setting up products listener...");

    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Find seller name
          const seller = sellers.find((s) => s.id === data.seller_id);
          return {
            id: doc.id,
            ...data,
            seller_name: seller?.name || "Unknown Seller",
          } as Product;
        });

        console.log(`✅ Received ${fetchedProducts.length} products`);
        setProducts(fetchedProducts);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error in products listener:", error);
        toast({
          title: "Error",
          description: "Failed to load products: " + error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => {
      console.log("🧹 Cleaning up products listener");
      unsubscribe();
    };
  }, [sellers]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      rating: 0,
      stock: 0,
      description: "",
      seller_id: "",
      image: "/placeholder-medicine.jpg",
      requiresPrescription: false,
      available: true,
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      description: product.description,
      seller_id: product.seller_id,
      image: product.image,
      requiresPrescription: product.requiresPrescription,
      available: product.available,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.seller_id) {
      toast({
        title: "Error",
        description: "Please select a seller",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const productRef = doc(db, "products", editingProduct.id!);
        await updateDoc(productRef, {
          ...formData,
          updated_at: serverTimestamp(),
        });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Add new product
        await addDoc(collection(db, "products"), {
          ...formData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete ${productName}?`)) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
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
                <h1 className="text-3xl font-bold text-foreground">Products Catalog</h1>
                <p className="text-muted-foreground">
                  Manage medicines and healthcare products
                </p>
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-muted-foreground text-lg">No products found</p>
                <Button onClick={handleAddProduct}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Product
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary-light p-2">
                            <Pill className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{product.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {product.category}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{product.price}
                        </span>
                        <Badge variant={product.available ? "default" : "secondary"}>
                          {product.available ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Stock:</span>
                          <span className="font-semibold">{product.stock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-semibold">⭐ {product.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seller:</span>
                          <span className="font-semibold text-xs">
                            {product.seller_name}
                          </span>
                        </div>
                      </div>

                      {product.requiresPrescription && (
                        <Badge variant="outline" className="border-warning text-warning">
                          Prescription Required
                        </Badge>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive"
                          onClick={() => handleDeleteProduct(product.id!, product.name)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update product information"
                : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Paracetamol 650mg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Fever, Antibiotic"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) })
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seller">Seller *</Label>
                <Select
                  value={formData.seller_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, seller_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a seller" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No sellers available. Add sellers first.
                      </div>
                    ) : (
                      sellers
                        .filter((s) => s.active)
                        .map((seller) => (
                          <SelectItem key={seller.id} value={seller.id!}>
                            {seller.name} - {seller.city}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/product.jpg"
                />
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Label htmlFor="prescription">Requires Prescription</Label>
                <Switch
                  id="prescription"
                  checked={formData.requiresPrescription}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requiresPrescription: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available in Stock</Label>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, available: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Products;