// src/firebase/admin-location-service.ts
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
} from "firebase/firestore";
import { db } from "./config";
import { getCurrentAdmin } from "./admin-auth-service";

/**
 * Get orders filtered by admin's location
 * Only returns orders where delivery location matches admin's registered location
 */
export async function getOrdersByAdminLocation() {
    try {
        const admin = await getCurrentAdmin();

        if (!admin || !admin.location) {
            throw new Error("Admin location not found");
        }

        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("location", "==", admin.location),
            orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(q);

        const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Fetched ${orders.length} orders for location: ${admin.location}`);
        return orders;
    } catch (error) {
        console.error("❌ Error fetching orders by location:", error);
        throw error;
    }
}

/**
 * Get prescriptions filtered by admin's location
 * Only returns prescriptions where delivery location matches admin's registered location
 */
export async function getPrescriptionsByAdminLocation() {
    try {
        const admin = await getCurrentAdmin();

        if (!admin || !admin.location) {
            throw new Error("Admin location not found");
        }

        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(
            prescriptionsRef,
            where("location", "==", admin.location),
            orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(q);

        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Fetched ${prescriptions.length} prescriptions for location: ${admin.location}`);
        return prescriptions;
    } catch (error) {
        console.error("❌ Error fetching prescriptions by location:", error);
        throw error;
    }
}

/**
 * Get prescriptions by status AND admin's location
 */
export async function getPrescriptionsByStatusAndLocation(status: string) {
    try {
        const admin = await getCurrentAdmin();

        if (!admin || !admin.location) {
            throw new Error("Admin location not found");
        }

        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(
            prescriptionsRef,
            where("location", "==", admin.location),
            where("status", "==", status),
            orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(q);

        const prescriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Fetched ${prescriptions.length} ${status} prescriptions for location: ${admin.location}`);
        return prescriptions;
    } catch (error) {
        console.error("❌ Error fetching prescriptions by status and location:", error);
        throw error;
    }
}

/**
 * Get orders by status AND admin's location
 */
export async function getOrdersByStatusAndLocation(status: string) {
    try {
        const admin = await getCurrentAdmin();

        if (!admin || !admin.location) {
            throw new Error("Admin location not found");
        }

        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("location", "==", admin.location),
            where("status", "==", status),
            orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(q);

        const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Fetched ${orders.length} ${status} orders for location: ${admin.location}`);
        return orders;
    } catch (error) {
        console.error("❌ Error fetching orders by status and location:", error);
        throw error;
    }
}