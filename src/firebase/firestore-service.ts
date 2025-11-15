// src/firebase/firestore-service.ts
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
    arrayUnion,
} from "firebase/firestore";
import { db } from "./config";

// ==================== TYPES ====================

export interface Seller {
    seller_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    joined_at: Timestamp;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    description: string;
    seller_id: string;
    image: string;
    created_at: Timestamp;
}

export interface OrderItem {
    id: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    phone: string;
    prescription_id: string | null;
    status: string;
}

export interface StatusHistoryEntry {
    note: string;
    status: string;
    timestamp: Timestamp;
}

export interface Order {
    status: any;
    created_at: Timestamp;
    delivery_address: string;
    estimatedDelivery: Timestamp;
    items: OrderItem[];
    statusHistory: StatusHistoryEntry[];
    total_amount: number;
    trackingNumber: string | null;
    updated_at: Timestamp;
    user_id: string;
}

// ==================== SELLER FUNCTIONS ====================

/**
 * Add a new seller to the database
 * @param sellerData - Seller information (without seller_id and joined_at)
 * @returns The created seller document ID
 */
export async function addSeller(
    sellerData: Omit<Seller, "seller_id" | "joined_at">
): Promise<string> {
    try {
        const sellersRef = collection(db, "sellers");
        const docRef = await addDoc(sellersRef, {
            ...sellerData,
            joined_at: serverTimestamp(),
        });

        // Update the document with its own ID as seller_id
        await updateDoc(docRef, {
            seller_id: docRef.id,
        });

        console.log("✅ Seller added successfully:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding seller:", error);
        throw error;
    }
}

/**
 * Get a seller by ID
 * @param sellerId - The seller's document ID
 * @returns Seller data or null if not found
 */
export async function getSeller(sellerId: string): Promise<Seller | null> {
    try {
        const sellerRef = doc(db, "sellers", sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (sellerSnap.exists()) {
            return sellerSnap.data() as Seller;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching seller:", error);
        throw error;
    }
}

/**
 * Get all sellers
 * @returns Array of all sellers
 */
export async function getAllSellers(): Promise<Seller[]> {
    try {
        const sellersRef = collection(db, "sellers");
        const snapshot = await getDocs(sellersRef);

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            seller_id: doc.id,
        })) as Seller[];
    } catch (error) {
        console.error("❌ Error fetching sellers:", error);
        throw error;
    }
}

// ==================== PRODUCT FUNCTIONS ====================

/**
 * Add a new product to the database
 * @param productData - Product information (without id and created_at)
 * @returns The created product document ID
 */
export async function addProduct(
    productData: Omit<Product, "id" | "created_at">
): Promise<string> {
    try {
        const productsRef = collection(db, "products");
        const docRef = await addDoc(productsRef, {
            ...productData,
            created_at: serverTimestamp(),
        });

        // Update the document with its own ID
        await updateDoc(docRef, {
            id: docRef.id,
        });

        console.log("✅ Product added successfully:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding product:", error);
        throw error;
    }
}

/**
 * Get a product by ID
 * @param productId - The product's document ID
 * @returns Product data or null if not found
 */
export async function getProduct(productId: string): Promise<Product | null> {
    try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            return productSnap.data() as Product;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        throw error;
    }
}

/**
 * Get all products
 * @returns Array of all products
 */
export async function getAllProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

        return snapshot.docs.map((doc) => doc.data()) as Product[];
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        throw error;
    }
}

/**
 * Get products by seller
 * @param sellerId - The seller's ID
 * @returns Array of products for that seller
 */
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("seller_id", "==", sellerId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => doc.data()) as Product[];
    } catch (error) {
        console.error("❌ Error fetching products by seller:", error);
        throw error;
    }
}

/**
 * Update product stock
 * @param productId - The product's document ID
 * @param newStock - New stock quantity
 */
export async function updateProductStock(
    productId: string,
    newStock: number
): Promise<void> {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
            stock: newStock,
        });

        console.log("✅ Product stock updated successfully");
    } catch (error) {
        console.error("❌ Error updating product stock:", error);
        throw error;
    }
}

// ==================== ORDER FUNCTIONS ====================

/**
 * Add a new order to the database
 * @param orderData - Order information (without created_at and updated_at)
 * @returns The created order document ID
 */
export async function addOrder(
    orderData: Omit<Order, "created_at" | "updated_at">
): Promise<string> {
    try {
        const ordersRef = collection(db, "orders");
        const docRef = await addDoc(ordersRef, {
            ...orderData,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });

        console.log("✅ Order added successfully:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding order:", error);
        throw error;
    }
}

/**
 * Get an order by ID
 * @param orderId - The order's document ID
 * @returns Order data or null if not found
 */
export async function getOrder(orderId: string): Promise<Order | null> {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
            return orderSnap.data() as Order;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching order:", error);
        throw error;
    }
}

/**
 * Get all orders (admin view)
 * @returns Array of all orders sorted by creation date (newest first)
 */
export async function getAllOrders(): Promise<Order[]> {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as Order[];
    } catch (error) {
        console.error("❌ Error fetching all orders:", error);
        throw error;
    }
}

/**
 * Get orders for a specific user
 * @param userId - The user's ID
 * @returns Array of orders for that user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("user_id", "==", userId),
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as Order[];
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        throw error;
    }
}

/**
 * Update order status
 * This will:
 * 1. Update the status field of all items in the order
 * 2. Add an entry to the statusHistory array
 * 3. Update the updated_at timestamp
 * 
 * @param orderId - The order's document ID
 * @param newStatus - The new status (e.g., "pending", "Confirmed", "Shipped", "Delivered")
 * @param note - Optional note about the status change
 */
export async function updateOrderStatus(
    orderId: string,
    newStatus: string,
    note?: string
): Promise<void> {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            throw new Error("Order not found");
        }

        const orderData = orderSnap.data() as Order;

        // Update all items' status
        const updatedItems = orderData.items.map((item) => ({
            ...item,
            status: newStatus,
        }));

        // Create status history entry
        const statusEntry: StatusHistoryEntry = {
            status: newStatus,
            note: note || `Order status updated to ${newStatus}`,
            timestamp: Timestamp.now(),
        };

        // Update the order document
        await updateDoc(orderRef, {
            items: updatedItems,
            status: newStatus, // Also update top-level status field
            statusHistory: arrayUnion(statusEntry),
            updated_at: serverTimestamp(),
        });

        console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        throw error;
    }
}

/**
 * Update tracking number for an order
 * @param orderId - The order's document ID
 * @param trackingNumber - The tracking number
 */
export async function updateTrackingNumber(
    orderId: string,
    trackingNumber: string
): Promise<void> {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            trackingNumber,
            updated_at: serverTimestamp(),
        });

        console.log("✅ Tracking number updated successfully");
    } catch (error) {
        console.error("❌ Error updating tracking number:", error);
        throw error;
    }
}

/**
 * Get orders by status
 * @param status - The status to filter by
 * @returns Array of orders with that status
 */
export async function getOrdersByStatus(status: string): Promise<Order[]> {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("status", "==", status),
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as Order[];
    } catch (error) {
        console.error("❌ Error fetching orders by status:", error);
        throw error;
    }
}

// ==================== SAMPLE DATA CREATION ====================

/**
 * Create sample data for testing
 * This is useful for initial setup and testing
 */
export async function createSampleData(): Promise<void> {
    try {
        console.log("🔄 Creating sample data...");

        // Add sample seller
        const sellerId = await addSeller({
            name: "HealthPlus Pharmacy",
            email: "healthplus@gmail.com",
            phone: "+91 98765 43210",
            address: "123 Medical Street, Chennai, Tamil Nadu 600028",
        });

        // Add sample products
        const productId1 = await addProduct({
            name: "Paracetamol",
            category: "Medicine",
            price: 25,
            rating: 4.5,
            stock: 100,
            description: "Used to relieve pain and reduce fever.",
            seller_id: sellerId,
            image: "/src/assets/medicine-1.jpg",
        });

        const productId2 = await addProduct({
            name: "Ibuprofen 400mg",
            category: "Medicine",
            price: 45,
            rating: 4.7,
            stock: 75,
            description: "Anti-inflammatory pain reliever.",
            seller_id: sellerId,
            image: "/src/assets/medicine-3.jpg",
        });

        // Add sample order
        await addOrder({
            delivery_address: "4/6 obbula subbaiyer lane, South masi Street, madurai 625001, Tamil Nadu",
            estimatedDelivery: Timestamp.fromDate(
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ), // 7 days from now
            items: [
                {
                    id: productId2,
                    image: "/src/assets/medicine-3.jpg",
                    name: "Ibuprofen 400mg",
                    price: 45,
                    quantity: 2,
                    phone: "08438433653",
                    prescription_id: null,
                    status: "pending",
                },
            ],
            statusHistory: [
                {
                    note: "Order placed successfully",
                    status: "Confirmed",
                    timestamp: Timestamp.now(),
                },
            ],
            total_amount: 90,
            trackingNumber: null,
            user_id: "ixayNX17IGPRFGsYZoaMu4IkW7w1",
            status: undefined
        });

        console.log("✅ Sample data created successfully!");
    } catch (error) {
        console.error("❌ Error creating sample data:", error);
        throw error;
    }
}