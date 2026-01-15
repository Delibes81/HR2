import type { Metric } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const revalidate = 0;

const toMetric = (doc: QueryDocumentSnapshot<DocumentData>): Metric => {
    const data = doc.data();
    return {
        id: doc.id,
        value: data.value,
        label: data.label,
        color: data.color,
    };
};

const defaultMetrics: Metric[] = [
    { id: "1", value: 105, label: "Datos con Holy remedies", color: "#1A8176" },
    { id: "2", value: 192, label: "Personas se la han curado con Holy Moly", color: "#F57C00" },
    { id: "3", value: 12, label: "Ingredientes Naturales", color: "#D32F2F" },
];

export async function getMetrics(): Promise<Metric[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener las métricas.");
        return defaultMetrics;
    }
    try {
        const metricsCol = collection(db, "metrics");
        const metricSnapshot = await getDocs(query(metricsCol, orderBy('__name__')));
        
        const fetchedMetrics = metricSnapshot.docs.map(toMetric);

        if (fetchedMetrics.length === 3) {
            return fetchedMetrics;
        }

        // If not all metrics are in firestore, merge them with defaults
        const finalMetrics = defaultMetrics.map(defaultMetric => {
            const found = fetchedMetrics.find(fm => fm.id === defaultMetric.id);
            return found || defaultMetric;
        });

        return finalMetrics;

    } catch (error) {
        console.error("Error fetching metrics from Firestore:", error);
        return defaultMetrics;
    }
}
