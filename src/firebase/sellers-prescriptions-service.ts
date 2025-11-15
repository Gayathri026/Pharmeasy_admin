// src/firebase/sellers-prescriptions-service.ts
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

// ==================== TYPES ====================

export interface Seller {
    id?: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    pincode: string;
    address?: string;
    active: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
    // Optional metrics
    total_orders?: number;
    completed_orders?: number;
    rating?: number;
}

export interface Prescription {
    id?: string;
    user_id: string;
    customer_name: string;
    customer_phone: string;
    order_id?: string;
    file_name: string;
    file_url: string;
    file_type?: string; // e.g., 'image/jpeg', 'application/pdf'
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

// ==================== SELLER FUNCTIONS ====================

/**
 * Add a new seller
 */
export async function addSeller(
    sellerData: Omit<Seller, "id" | "created_at" | "updated_at">
): Promise<string> {
    try {
        console.log("📝 Adding new seller:", sellerData.name);

        const sellersRef = collection(db, "sellers");
        const docRef = await addDoc(sellersRef, {
            ...sellerData,
            total_orders: 0,
            completed_orders: 0,
            rating: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });

        console.log("✅ Seller added successfully:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding seller:", error);
        throw error;
    }
}

/**
 * Get all sellers
 */
export async function getAllSellers(): Promise<Seller[]> {
    try {
        const sellersRef = collection(db, "sellers");
        const q = query(sellersRef, orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);

        const sellers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Seller[];

        console.log(`✅ Fetched ${sellers.length} sellers`);
        return sellers;
    } catch (error) {
        console.error("❌ Error fetching sellers:", error);
        throw error;
    }
}

/**
 * Get active sellers only
 */
export async function getActiveSellers(): Promise<Seller[]> {
    try {
        const sellersRef = collection(db, "sellers");
        const q = query(
            sellersRef,
            where("active", "==", true),
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        const sellers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Seller[];

        console.log(`✅ Fetched ${sellers.length} active sellers`);
        return sellers;
    } catch (error) {
        console.error("❌ Error fetching active sellers:", error);
        throw error;
    }
}

/**
 * Get seller by ID
 */
export async function getSeller(sellerId: string): Promise<Seller | null> {
    try {
        const sellerRef = doc(db, "sellers", sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (sellerSnap.exists()) {
            return { id: sellerSnap.id, ...sellerSnap.data() } as Seller;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching seller:", error);
        throw error;
    }
}

/**
 * Update seller information
 */
export async function updateSeller(
    sellerId: string,
    updates: Partial<Seller>
): Promise<void> {
    try {
        console.log(`📝 Updating seller: ${sellerId}`);

        const sellerRef = doc(db, "sellers", sellerId);
        await updateDoc(sellerRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });

        console.log("✅ Seller updated successfully");
    } catch (error) {
        console.error("❌ Error updating seller:", error);
        throw error;
    }
}

/**
 * Toggle seller active status
 */
export async function toggleSellerStatus(
    sellerId: string,
    active: boolean
): Promise<void> {
    try {
        const sellerRef = doc(db, "sellers", sellerId);
        await updateDoc(sellerRef, {
            active,
            updated_at: serverTimestamp(),
        });

        console.log(`✅ Seller ${active ? "activated" : "deactivated"}`);
    } catch (error) {
        console.error("❌ Error toggling seller status:", error);
        throw error;
    }
}

/**
 * Delete seller
 */
export async function deleteSeller(sellerId: string): Promise<void> {
    try {
        console.log(`🗑️ Deleting seller: ${sellerId}`);

        const sellerRef = doc(db, "sellers", sellerId);
        await deleteDoc(sellerRef);

        console.log("✅ Seller deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting seller:", error);
        throw error;
    }
}

/**
 * Get sellers by city
 */
export async function getSellersByCity(city: string): Promise<Seller[]> {
    try {
        const sellersRef = collection(db, "sellers");
        const q = query(
            sellersRef,
            where("city", "==", city),
            where("active", "==", true)
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Seller[];
    } catch (error) {
        console.error("❌ Error fetching sellers by city:", error);
        throw error;
    }
}

// ==================== PRESCRIPTION FUNCTIONS ====================

/**
 * Add a new prescription
 */
export async function addPrescription(
    prescriptionData: Omit<Prescription, "id" | "created_at" | "updated_at">
): Promise<string> {
    try {
        console.log("📝 Adding new prescription");

        const prescriptionsRef = collection(db, "prescriptions");
        const docRef = await addDoc(prescriptionsRef, {
            ...prescriptionData,
            status: prescriptionData.status || "pending",
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });

        console.log("✅ Prescription added successfully:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding prescription:", error);
        throw error;
    }
}

/**
 * Get all prescriptions
 */
export async function getAllPrescriptions(): Promise<Prescription[]> {
    try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(prescriptionsRef, orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);

        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Prescription[];

        console.log(`✅ Fetched ${prescriptions.length} prescriptions`);
        return prescriptions;
    } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
        throw error;
    }
}

/**
 * Get prescriptions by status
 */
export async function getPrescriptionsByStatus(
    status: Prescription["status"]
): Promise<Prescription[]> {
    try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(
            prescriptionsRef,
            where("status", "==", status),
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Prescription[];

        console.log(`✅ Fetched ${prescriptions.length} ${status} prescriptions`);
        return prescriptions;
    } catch (error) {
        console.error("❌ Error fetching prescriptions by status:", error);
        throw error;
    }
}

/**
 * Get prescriptions assigned to a seller
 */
export async function getPrescriptionsBySeller(
    sellerId: string
): Promise<Prescription[]> {
    try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(
            prescriptionsRef,
            where("assigned_seller_id", "==", sellerId),
            orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Prescription[];
    } catch (error) {
        console.error("❌ Error fetching seller prescriptions:", error);
        throw error;
    }
}

/**
 * Get prescription by ID
 */
export async function getPrescription(
    prescriptionId: string
): Promise<Prescription | null> {
    try {
        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        const prescriptionSnap = await getDoc(prescriptionRef);

        if (prescriptionSnap.exists()) {
            return {
                id: prescriptionSnap.id,
                ...prescriptionSnap.data(),
            } as Prescription;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching prescription:", error);
        throw error;
    }
}

/**
 * Verify prescription
 */
export async function verifyPrescription(
    prescriptionId: string,
    verifiedBy: string
): Promise<void> {
    try {
        console.log(`✅ Verifying prescription: ${prescriptionId}`);

        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        await updateDoc(prescriptionRef, {
            status: "verified",
            verified_by: verifiedBy,
            verified_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });

        console.log("✅ Prescription verified successfully");
    } catch (error) {
        console.error("❌ Error verifying prescription:", error);
        throw error;
    }
}

/**
 * Reject prescription
 */
export async function rejectPrescription(
    prescriptionId: string,
    reason: string,
    rejectedBy: string
): Promise<void> {
    try {
        console.log(`❌ Rejecting prescription: ${prescriptionId}`);

        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        await updateDoc(prescriptionRef, {
            status: "rejected",
            rejection_reason: reason,
            verified_by: rejectedBy,
            verified_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });

        console.log("✅ Prescription rejected successfully");
    } catch (error) {
        console.error("❌ Error rejecting prescription:", error);
        throw error;
    }
}

/**
 * Assign prescription to seller
 */
export async function assignPrescriptionToSeller(
    prescriptionId: string,
    sellerId: string
): Promise<void> {
    try {
        console.log(`📦 Assigning prescription ${prescriptionId} to seller ${sellerId}`);

        // Get seller details
        const seller = await getSeller(sellerId);
        if (!seller) {
            throw new Error("Seller not found");
        }

        if (!seller.active) {
            throw new Error("Cannot assign to inactive seller");
        }

        // Update prescription
        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        await updateDoc(prescriptionRef, {
            status: "assigned",
            assigned_seller_id: sellerId,
            assigned_seller_name: seller.name,
            updated_at: serverTimestamp(),
        });

        // Update seller's total orders
        const sellerRef = doc(db, "sellers", sellerId);
        await updateDoc(sellerRef, {
            total_orders: (seller.total_orders || 0) + 1,
            updated_at: serverTimestamp(),
        });

        console.log("✅ Prescription assigned successfully");
    } catch (error) {
        console.error("❌ Error assigning prescription:", error);
        throw error;
    }
}

/**
 * Update prescription status
 */
export async function updatePrescriptionStatus(
    prescriptionId: string,
    status: Prescription["status"]
): Promise<void> {
    try {
        console.log(`📝 Updating prescription ${prescriptionId} to ${status}`);

        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        await updateDoc(prescriptionRef, {
            status,
            updated_at: serverTimestamp(),
        });

        // If status is completed, update seller's completed orders
        if (status === "completed") {
            const prescription = await getPrescription(prescriptionId);
            if (prescription?.assigned_seller_id) {
                const seller = await getSeller(prescription.assigned_seller_id);
                if (seller) {
                    const sellerRef = doc(db, "sellers", prescription.assigned_seller_id);
                    await updateDoc(sellerRef, {
                        completed_orders: (seller.completed_orders || 0) + 1,
                        updated_at: serverTimestamp(),
                    });
                }
            }
        }

        console.log("✅ Prescription status updated successfully");
    } catch (error) {
        console.error("❌ Error updating prescription status:", error);
        throw error;
    }
}

/**
 * Delete prescription
 */
export async function deletePrescription(prescriptionId: string): Promise<void> {
    try {
        console.log(`🗑️ Deleting prescription: ${prescriptionId}`);

        const prescriptionRef = doc(db, "prescriptions", prescriptionId);
        await deleteDoc(prescriptionRef);

        console.log("✅ Prescription deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting prescription:", error);
        throw error;
    }
}

// ==================== REAL-TIME LISTENERS ====================

/**
 * Listen to sellers in real-time
 */
export function listenToSellers(
    callback: (sellers: Seller[]) => void,
    onError?: (error: Error) => void
): () => void {
    try {
        const sellersRef = collection(db, "sellers");
        const q = query(sellersRef, orderBy("created_at", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const sellers = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Seller[];
                callback(sellers);
            },
            (error) => {
                console.error("❌ Error in sellers listener:", error);
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error("❌ Error setting up sellers listener:", error);
        throw error;
    }
}

/**
 * Listen to prescriptions in real-time
 */
export function listenToPrescriptions(
    callback: (prescriptions: Prescription[]) => void,
    statusFilter?: Prescription["status"],
    onError?: (error: Error) => void
): () => void {
    try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = statusFilter
            ? query(
                prescriptionsRef,
                where("status", "==", statusFilter),
                orderBy("created_at", "desc")
            )
            : query(prescriptionsRef, orderBy("created_at", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const prescriptions = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Prescription[];
                callback(prescriptions);
            },
            (error) => {
                console.error("❌ Error in prescriptions listener:", error);
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    } catch (error) {
        console.error("❌ Error setting up prescriptions listener:", error);
        throw error;
    }
}

// ==================== AUTO-ASSIGNMENT LOGIC ====================

/**
 * Auto-assign prescription to nearest available seller
 * This would typically be done in a Cloud Function, but can work client-side too
 */
export async function autoAssignPrescription(
    prescriptionId: string,
    customerCity: string
): Promise<string> {
    try {
        console.log("🤖 Auto-assigning prescription to seller...");

        // Get active sellers from the same city
        let availableSellers = await getSellersByCity(customerCity);

        // If no sellers in city, get all active sellers
        if (availableSellers.length === 0) {
            availableSellers = await getActiveSellers();
        }

        if (availableSellers.length === 0) {
            throw new Error("No active sellers available");
        }

        // Simple assignment: seller with least orders
        const bestSeller = availableSellers.reduce((prev, current) => {
            const prevOrders = prev.total_orders || 0;
            const currentOrders = current.total_orders || 0;
            return currentOrders < prevOrders ? current : prev;
        });

        // Assign to best seller
        await assignPrescriptionToSeller(prescriptionId, bestSeller.id!);

        console.log(`✅ Auto-assigned to seller: ${bestSeller.name}`);
        return bestSeller.id!;
    } catch (error) {
        console.error("❌ Error auto-assigning prescription:", error);
        throw error;
    }
}