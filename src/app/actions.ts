
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Unused
import type { CartItem } from '@/lib/types';
import { onSnapshot } from "firebase/firestore";

// --- Helper Functions ---
// (No helper functions currently needed for server actions)


// CRUD Actions removed in favor of Client-Side writes.

export async function createCheckoutSession(
  cartItems: CartItem[],
  userEmail: string
): Promise<{ sessionId?: string; customerId?: string; error?: string }> {
  if (!db) {
    return { error: "La base de datos no está configurada." };
  }
  if (!cartItems || cartItems.length === 0) {
    return { error: "El carrito está vacío." };
  }

  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://studio--holy-remedies-2s0vv.us-central1.hosted.app';

  // Ensure the base URL has a protocol
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }


  const line_items = cartItems.map((item) => {
    const priceToUse =
      item.promotionalPrice && item.promotionalPrice > 0
        ? item.promotionalPrice
        : item.price;
    return {
      price_data: {
        currency: "mxn",
        unit_amount: Math.round(priceToUse * 100),
        product_data: {
          name: item.name,
          images: item.images,
          description: item.description,
        },
      },
      quantity: item.quantity,
    };
  });

  try {
    const customersRef = collection(db, "customers");
    const q = query(customersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    let customerId: string;

    if (querySnapshot.empty) {
      const newCustomerRef = await addDoc(customersRef, {
        email: userEmail,
        createdAt: new Date(),
      });
      customerId = newCustomerRef.id;
    } else {
      customerId = querySnapshot.docs[0].id;
    }

    const checkoutSessionRef = await addDoc(
      collection(db, "customers", customerId, "checkout_sessions"),
      {
        line_items,
        success_url: `${baseUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/carrito`,
        metadata: {
          userEmail: userEmail,
        },
      }
    );
    return { sessionId: checkoutSessionRef.id, customerId: customerId };
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error);
    return { error: "No se pudo iniciar el proceso de pago." };
  }
}
