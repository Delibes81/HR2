
import type { FaqItem } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const revalidate = 0;

const toFaqItem = (doc: QueryDocumentSnapshot<DocumentData>): FaqItem => {
    const data = doc.data();
    return {
        id: doc.id,
        question: data.question,
        answer: data.answer,
        order: data.order,
    };
};

const defaultFaqs: FaqItem[] = [
    {
        id: '1',
        question: "¿Qué es Holy Moly?",
        answer: "Holy Moly es un suplemento en polvo diseñado para ayudarte a recuperarte después de una noche de fiesta o ejercicio intenso. Combina vitaminas, minerales y aminoácidos para rehidratarte y reponer lo que tu cuerpo pierde.",
        order: 1,
    },
    {
        id: '2',
        question: "¿Cuándo debo tomarlo?",
        answer: "Puedes tomarlo antes de empezar a beber para preparar a tu cuerpo, durante la fiesta para mantenerte hidratado, o después para acelerar tu recuperación. También es excelente después de hacer ejercicio.",
        order: 2,
    },
    {
        id: '3',
        question: "¿Tiene efectos secundarios?",
        answer: "Holy Moly está hecho con ingredientes de alta calidad y es seguro para la mayoría de las personas. Sin embargo, si tienes alguna condición médica preexistente, te recomendamos consultar a tu médico antes de consumirlo.",
        order: 3,
    }
];

export async function getFaqs(): Promise<FaqItem[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. Devolviendo FAQs por defecto.");
        return defaultFaqs.sort((a, b) => a.order - b.order);
    }
    try {
        const faqsCol = collection(db, "faqs");
        const faqSnapshot = await getDocs(query(faqsCol, orderBy('order', 'asc')));
        
        const fetchedFaqs = faqSnapshot.docs.map(toFaqItem);

        if (fetchedFaqs.length > 0) {
            return fetchedFaqs;
        }
        
        return defaultFaqs.sort((a, b) => a.order - b.order);

    } catch (error) {
        console.error("Error fetching FAQs from Firestore:", error);
        return defaultFaqs.sort((a, b) => a.order - b.order);
    }
}
