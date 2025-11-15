// src/firebase/admin-auth-service.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";

// ==================== TYPES ====================

export interface AdminUser {
    uid: string;
    email: string;
    displayName: string;
    location: string;
    role: "admin";
    createdAt: any;
    lastLogin: any;
}

// ==================== AUTH FUNCTIONS ====================

/**
 * Register a new admin user
 */
export async function registerAdmin(
    email: string,
    password: string,
    displayName: string
): Promise<{ user: User; adminData: AdminUser }> {
    try {
        console.log("📝 Registering new admin:", email);

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: displayName,
        });

        // Create admin document in Firestore
        const adminData: AdminUser = {
            uid: user.uid,
            email: email,
            
            displayName: displayName,
            location: "",
            role: "admin",

            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        };

        await setDoc(doc(db, "admins", user.uid), adminData);

        console.log("✅ Admin registered successfully");
        return { user, adminData };
    } catch (error: any) {
        console.error("❌ Error registering admin:", error);
        throw new Error(error.message || "Registration failed");
    }
}

/**
 * Login admin user
 */
export async function loginAdmin(
    email: string,
    password: string
): Promise<{ user: User; adminData: AdminUser }> {
    try {
        console.log("🔐 Logging in admin:", email);

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Get admin data from Firestore
        const adminDoc = await getDoc(doc(db, "admins", user.uid));

        if (!adminDoc.exists()) {
            throw new Error("Admin account not found");
        }

        const adminData = adminDoc.data() as AdminUser;

        // Update last login
        await setDoc(
            doc(db, "admins", user.uid),
            {
                lastLogin: serverTimestamp(),
            },
            { merge: true }
        );

        console.log("✅ Admin logged in successfully");
        return { user, adminData };
    } catch (error: any) {
        console.error("❌ Error logging in:", error);
        throw new Error(error.message || "Login failed");
    }
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<void> {
    try {
        await signOut(auth);
        console.log("✅ Admin logged out successfully");
    } catch (error) {
        console.error("❌ Error logging out:", error);
        throw error;
    }
}

/**
 * Get current admin user data
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
    try {
        const user = auth.currentUser;
        if (!user) return null;

        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        if (!adminDoc.exists()) return null;

        return adminDoc.data() as AdminUser;
    } catch (error) {
        console.error("❌ Error fetching current admin:", error);
        return null;
    }
}

/**
 * Listen to auth state changes
 */
export function onAdminAuthStateChanged(
    callback: (user: User | null) => void
): () => void {
    return onAuthStateChanged(auth, callback);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return auth.currentUser !== null;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}