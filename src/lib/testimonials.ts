import type { Testimonial } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const revalidate = 0;

// Helper to convert Firestore doc to Testimonial
const toTestimonial = (doc: QueryDocumentSnapshot<DocumentData>): Testimonial => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        text: data.text,
        rating: data.rating,
        avatar: data.avatar,
        fallback: data.fallback,
    };
};

export async function getTestimonials(): Promise<Testimonial[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener los testimonios.");
        return [];
    }
    try {
        const testimonialsCol = collection(db, "testimonials");
        const testimonialSnapshot = await getDocs(query(testimonialsCol, orderBy('name', 'asc')));
        
        return testimonialSnapshot.docs.map(toTestimonial);
    } catch (error) {
        console.error("Error fetching testimonials from Firestore:", error);
        return [];
    }
}
