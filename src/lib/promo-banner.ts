import type { PromoBanner } from "@/lib/types";
import { db } from "./firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

export const revalidate = 0;

const toPromoBanner = (doc: DocumentData): PromoBanner => {
    const data = doc.data();
    return {
        text: data.text,
        link: data.link,
        isActive: data.isActive,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
    };
};

const defaultBanner: PromoBanner = {
    text: "¡Promoción especial! ¡Descuentos en toda la tienda!",
    link: "",
    isActive: false,
    backgroundColor: '#29ABE2', // Default primary color
    textColor: '#FFFFFF',       // Default white text
};

export async function getPromoBanner(): Promise<PromoBanner> {
    if (!db) {
        console.warn("Firestore no está inicializado. Devolviendo banner por defecto.");
        return defaultBanner;
    }
    try {
        const bannerRef = doc(db, "siteConfig", "promoBanner");
        const bannerSnap = await getDoc(bannerRef);
        
        if (bannerSnap.exists()) {
            const data = bannerSnap.data();
            // Return fetched data, but with defaults for colors if they are missing
            return {
                ...defaultBanner,
                ...data,
                text: data.text,
                link: data.link,
                isActive: data.isActive,
            };
        } else {
            return defaultBanner;
        }

    } catch (error) {
        console.error("Error fetching promo banner from Firestore:", error);
        return defaultBanner;
    }
}
