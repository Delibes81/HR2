import type { Product, ProductCategory, Category } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot, doc, getDoc } from "firebase/firestore";

export const revalidate = 0;

// Helper to convert Firestore doc to Product
export const toProduct = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        promotionalPrice: data.promotionalPrice,
        images: data.images || [data.image || 'https://placehold.co/600x600'], // Fallback for old data model
        category: data.category,
    };
};

// Helper to convert Firestore doc to Category
export const toCategory = (doc: QueryDocumentSnapshot<DocumentData>): Category => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        logo: data.logo,
        order: data.order,
    };
};

export async function getProducts(): Promise<Product[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener productos.");
        return [];
    }
    try {
        const productsCol = collection(db, "products");
        const productSnapshot = await getDocs(query(productsCol, orderBy('name', 'asc')));
        return productSnapshot.docs.map(toProduct);
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        return [];
    }
}

export async function getAdminCategories(): Promise<Category[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener categorías.");
        return [];
    }
     try {
        const categoriesCol = query(collection(db, 'categories'), orderBy('order', 'asc'));
        const categorySnapshot = await getDocs(categoriesCol);
        return categorySnapshot.docs.map(toCategory);
    } catch (error) {
        console.error("Error fetching categories from Firestore:", error);
        return [];
    }
}
