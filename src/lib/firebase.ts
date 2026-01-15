
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage as getServerStorage, type FirebaseStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

function isConfigured() {
    return !!(firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId);
}

if (isConfigured()) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getServerStorage(app);
    } catch (e) {
        console.error("Error al inicializar Firebase:", e);
    }
} else {
    if (typeof window !== 'undefined') {
        console.warn("La configuración de Firebase está incompleta. Faltan una o más variables en tu archivo .env. La aplicación se ejecutará en modo limitado.");
    }
}

// Client-side storage instance
export const getClientStorage = () => {
    if (app) {
        return getServerStorage(app);
    }
    return null;
}

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const storage = getClientStorage();
    if (!storage) throw new Error("Firebase Storage no está configurado.");
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

export { db, auth, storage, isConfigured };
