import type { BlogPost } from "@/lib/types";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, DocumentData, QueryDocumentSnapshot, doc, getDoc } from "firebase/firestore";

export const revalidate = 0;

// Helper to convert Firestore doc to BlogPost
const toBlogPost = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): BlogPost => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        content: data.content,
        author: data.author,
        image: data.image,
    };
};

export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se pueden obtener los posts del blog.");
        return [];
    }
    try {
        const postsCol = collection(db, "blogPosts");
        const postSnapshot = await getDocs(query(postsCol, orderBy('title', 'asc')));
        
        return postSnapshot.docs.map(toBlogPost);
    } catch (error) {
        console.error("Error fetching blog posts from Firestore:", error);
        return [];
    }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    if (!db) {
        console.warn("Firestore no está inicializado. No se puede obtener el post del blog.");
        return null;
    }

    try {
        const postRef = doc(db, 'blogPosts', id);
        const postSnap = await getDoc(postRef);


        if (!postSnap.exists()) {
            return null;
        }

        return toBlogPost(postSnap);
    } catch (error) {
        console.error(`Error fetching post by id ${id} from Firestore:`, error);
        return null;
    }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}
