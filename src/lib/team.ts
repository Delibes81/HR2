import type { TeamMember } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const revalidate = 0;

// Helper to convert Firestore doc to TeamMember
const toTeamMember = (doc: QueryDocumentSnapshot<DocumentData>): TeamMember => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        role: data.role,
        avatar: data.avatar,
        fallback: data.fallback,
    };
};

export async function getTeamMembers(): Promise<TeamMember[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener los miembros del equipo.");
        return [];
    }
    try {
        const teamCol = collection(db, "teamMembers");
        const teamSnapshot = await getDocs(query(teamCol, orderBy('name', 'asc')));
        
        return teamSnapshot.docs.map(toTeamMember);
    } catch (error) {
        console.error("Error fetching team members from Firestore:", error);
        return [];
    }
}
