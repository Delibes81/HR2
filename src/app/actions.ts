
"use server";

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import type { Product, BlogPost, Metric, PromoBanner, CartItem } from '@/lib/types';
import { onSnapshot } from "firebase/firestore";

// --- Helper Functions ---

async function uploadFile(file: File, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage no está configurado.");
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}


// --- Product Actions ---

const productSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0.01, "El precio debe ser positivo"),
  promotionalPrice: z.coerce.number().min(0).nullable(),
  category: z.string().min(1, "La categoría es requerida"),
  images: z.array(z.string()).min(1, "Se requiere al menos una imagen."),
});


export async function saveProduct(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  const id = formData.get('id') as string | null;
  const imageFiles = formData.getAll('images') as File[];
  
  const existingImages = JSON.parse(formData.get('existingImages') as string || '[]') as string[];
  
  let imageUrls = [...existingImages];

  try {
    if (imageFiles && imageFiles.some(file => file.size > 0)) {
      const validFiles = imageFiles.filter(file => file.size > 0);
      const uploadedUrls = await Promise.all(
        validFiles.map(file => uploadFile(file, 'product-images'))
      );
      imageUrls.push(...uploadedUrls);
    }

    if (imageUrls.length === 0) {
        imageUrls.push('https://placehold.co/600x600');
    }
    
    const promotionalPriceValue = formData.get('promotionalPrice');
    const promotionalPrice = promotionalPriceValue && parseFloat(promotionalPriceValue as string) > 0 
      ? parseFloat(promotionalPriceValue as string)
      : null;

    const rawData = {
        id,
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        promotionalPrice: promotionalPrice,
        category: formData.get('category'),
        images: imageUrls,
    };

    const validatedFields = productSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      console.error("Validation Errors:", errors);
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const { id: validatedId, ...productData } = validatedFields.data;

    if (validatedId) {
      const productRef = doc(db, 'products', validatedId);
      await updateDoc(productRef, productData);
    } else {
      await addDoc(collection(db, 'products'), productData);
    }
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error) {
    console.error("Error guardando producto:", error);
    return { error: "No se pudo guardar el producto." };
  }
}

export async function deleteProduct(id: string) {
    if (!db) throw new Error("Firestore no está configurado.");
    
    try {
        const productRef = doc(db, 'products', id);
        await deleteDoc(productRef);
        revalidatePath('/admin');
        revalidatePath('/catalogo');
        return { success: true };
    } catch (error) {
        console.error("Error eliminando producto:", error);
        return { error: "No se pudo eliminar el producto." };
    }
}


// --- Category Actions ---

const categorySchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, "El nombre es requerido"),
  logo: z.string().url("Debe ser una URL de imagen válida").optional().or(z.literal('')),
  order: z.coerce.number().int("El orden debe ser un número entero."),
});

export async function saveCategory(formData: FormData) {
    if (!db) throw new Error("Firestore no está configurado.");

    const id = formData.get('id') as string | null;
    const logoFile = formData.get('logo') as File | null;
    const existingLogo = formData.get('existingLogo') as string || '';

    let logoUrl = existingLogo;

    try {
        if (logoFile && logoFile.size > 0) {
            logoUrl = await uploadFile(logoFile, 'category-logos');
        }

        const rawData = {
            id,
            name: formData.get('name'),
            logo: logoUrl,
            order: formData.get('order'),
        };

        const validatedFields = categorySchema.safeParse(rawData);
        if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
        }
    
        const { id: validatedId, ...categoryData } = validatedFields.data;
    
        if (validatedId) {
            const categoryRef = doc(db, 'categories', validatedId);
            await updateDoc(categoryRef, categoryData);
        } else {
            await addDoc(collection(db, 'categories'), categoryData);
        }
        revalidatePath('/admin');
        revalidatePath('/catalogo');
        return { success: true };
    } catch (error) {
        console.error("Error guardando categoría:", error);
        return { error: "No se pudo guardar la categoría." };
    }
}

export async function deleteCategory(id: string) {
    if (!db) throw new Error("Firestore no está configurado.");

    try {
        const categoryRef = doc(db, 'categories', id);
        await deleteDoc(categoryRef);
        revalidatePath('/admin');
        revalidatePath('/catalogo');
        return { success: true };
    } catch (error) {
        console.error("Error eliminando categoría:", error);
        return { error: "No se pudo eliminar la categoría." };
    }
}

// --- Blog Post Actions ---

const blogPostSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  author: z.string().min(1, "El autor es requerido"),
  image: z.string().url("Se requiere una URL de imagen válida."),
});

export async function saveBlogPost(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  try {
    const rawData = {
        id: formData.get('id') || null,
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author'),
        image: formData.get('image'),
    };

    const validatedFields = blogPostSchema.safeParse(rawData);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      const errorMessage = Object.entries(errors).map(([key, value]) => `${key}: ${value}`).join(', ');
      console.error("Validation Errors:", errors);
      return { error: `Datos inválidos: ${errorMessage}` };
    }

    const { id, ...postData } = validatedFields.data;

    if (id) {
      const postRef = doc(db, 'blogPosts', id);
      await updateDoc(postRef, postData);
      revalidatePath(`/blog/${id}`);
    } else {
      const docRef = await addDoc(collection(db, 'blogPosts'), postData);
      revalidatePath(`/blog/${docRef.id}`);
    }
    revalidatePath('/admin');
    revalidatePath('/blog');
    return { success: true };
  } catch (error) {
    console.error("Error guardando post:", error);
    const errorMessage = error instanceof Error ? error.message : "No se pudo guardar el post.";
    return { error: errorMessage };
  }
}

export async function deleteBlogPost(id: string) {
    if (!db) throw new Error("Firestore no está configurado.");
    
    try {
        const postRef = doc(db, 'blogPosts', id);
        await deleteDoc(postRef);
        revalidatePath('/admin');
        revalidatePath('/blog');
        revalidatePath(`/blog/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error eliminando post:", error);
        return { error: "No se pudo eliminar el post." };
    }
}

// --- Testimonial Actions ---

const testimonialSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, "El nombre es requerido"),
  text: z.string().min(1, "El texto es requerido"),
  rating: z.coerce.number().int().min(1).max(5),
  avatar: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  fallback: z.string().min(1, "Las iniciales son requeridas").max(2),
});

export async function saveTestimonial(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  const id = formData.get('id') as string | null;
  const avatarFile = formData.get('avatar') as File | null;
  const existingAvatar = formData.get('existingAvatar') as string || '';

  let avatarUrl = existingAvatar;

  try {
    if (avatarFile && avatarFile.size > 0) {
        avatarUrl = await uploadFile(avatarFile, 'avatars');
    }
    
    if (!avatarUrl) {
        avatarUrl = 'https://placehold.co/100x100';
    }

    const rawData = {
        id,
        name: formData.get('name'),
        text: formData.get('text'),
        rating: formData.get('rating'),
        fallback: formData.get('fallback'),
        avatar: avatarUrl,
    };

    const validatedFields = testimonialSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const { id: validatedId, ...testimonialData } = validatedFields.data;

    if (validatedId) {
      const testimonialRef = doc(db, 'testimonials', validatedId);
      await updateDoc(testimonialRef, testimonialData);
    } else {
      await addDoc(collection(db, 'testimonials'), testimonialData);
    }
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error) {
    console.error("Error guardando testimonio:", error);
    return { error: "No se pudo guardar el testimonio." };
  }
}

export async function deleteTestimonial(id: string) {
    if (!db) throw new Error("Firestore no está configurado.");
    
    try {
        const testimonialRef = doc(db, 'testimonials', id);
        await deleteDoc(testimonialRef);
        revalidatePath('/admin');
        revalidatePath('/catalogo');
        return { success: true };
    } catch (error) {
        console.error("Error eliminando testimonio:", error);
        return { error: "No se pudo eliminar el testimonio." };
    }
}


// --- Team Member Actions ---

const teamMemberSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, "El nombre es requerido"),
  role: z.string().min(1, "El rol es requerido"),
  avatar: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  fallback: z.string().min(1, "Las iniciales son requeridas").max(2),
});

export async function saveTeamMember(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  const id = formData.get('id') as string | null;
  const avatarFile = formData.get('avatar') as File | null;
  const existingAvatar = formData.get('existingAvatar') as string || '';

  let avatarUrl = existingAvatar;

  try {
    if (avatarFile && avatarFile.size > 0) {
        avatarUrl = await uploadFile(avatarFile, 'team-avatars');
    }
    
    if (!avatarUrl) {
        avatarUrl = 'https://placehold.co/100x100';
    }

    const rawData = {
        id,
        name: formData.get('name'),
        role: formData.get('role'),
        fallback: formData.get('fallback'),
        avatar: avatarUrl,
    };

    const validatedFields = teamMemberSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const { id: validatedId, ...teamMemberData } = validatedFields.data;

    if (validatedId) {
      const memberRef = doc(db, 'teamMembers', validatedId);
      await updateDoc(memberRef, teamMemberData);
    } else {
      await addDoc(collection(db, 'teamMembers'), teamMemberData);
    }
    revalidatePath('/admin');
    revalidatePath('/nosotros');
    return { success: true };
  } catch (error) {
    console.error("Error guardando miembro del equipo:", error);
    return { error: "No se pudo guardar el miembro del equipo." };
  }
}

export async function deleteTeamMember(id: string) {
    if (!db) throw new Error("Firestore no está configurado.");
    
    try {
        const memberRef = doc(db, 'teamMembers', id);
        await deleteDoc(memberRef);
        revalidatePath('/admin');
        revalidatePath('/nosotros');
        return { success: true };
    } catch (error) {
        console.error("Error eliminando miembro del equipo:", error);
        return { error: "No se pudo eliminar el miembro del equipo." };
    }
}

// --- Metric Actions ---

const metricSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "La etiqueta es requerida"),
  value: z.coerce.number().int("El valor debe ser un número entero."),
  color: z.string().min(1, "El color es requerido"),
});

export async function saveMetric(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");

  const id = formData.get('id') as string;

  try {
    const rawData = {
        id: id,
        label: formData.get('label'),
        value: formData.get('value'),
        color: formData.get('color'),
    };
    
    const validatedFields = metricSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }
    
    const { id: validatedId, ...metricData } = validatedFields.data;
    
    const metricRef = doc(db, 'metrics', validatedId);
    await setDoc(metricRef, metricData);
    
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error) {
    console.error("Error guardando métrica:", error);
    return { error: "No se pudo guardar la métrica." };
  }
}

// --- Promo Banner Actions ---

const promoBannerSchema = z.object({
  text: z.string().min(1, "El texto es requerido."),
  link: z.union([z.literal(''), z.string().url("Debe ser una URL válida.")]).optional(),
  isActive: z.preprocess((value) => value === 'on', z.boolean()),
  backgroundColor: z.string().min(1, "El color de fondo es requerido."),
  textColor: z.string().min(1, "El color de texto es requerido."),
});

export async function savePromoBanner(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  try {
    const rawData = {
        text: formData.get('text'),
        link: formData.get('link'),
        isActive: formData.get('isActive'),
        backgroundColor: formData.get('backgroundColor'),
        textColor: formData.get('textColor'),
    };

    const validatedFields = promoBannerSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      console.error('Validation errors:', errors);
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const bannerRef = doc(db, 'siteConfig', 'promoBanner');
    await setDoc(bannerRef, validatedFields.data);
    
    revalidatePath('/'); // Revalidate all pages
    return { success: true };
  } catch (error) {
    console.error("Error guardando el banner promocional:", error);
    return { error: "No se pudo guardar el banner promocional." };
  }
}

// --- TikTok Embed Actions ---

const tiktokEmbedSchema = z.object({
  embedCode: z.string().min(1, "El código de inserción es requerido."),
  isActive: z.preprocess((value) => value === 'on', z.boolean()),
});

export async function saveTikTokEmbed(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  
  try {
    const rawData = {
        embedCode: formData.get('embedCode'),
        isActive: formData.get('isActive'),
    };

    const validatedFields = tiktokEmbedSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      console.error('Validation errors:', errors);
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const tiktokRef = doc(db, 'siteConfig', 'tiktokEmbed');
    await setDoc(tiktokRef, validatedFields.data);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error guardando el código de TikTok:", error);
    return { error: "No se pudo guardar el código de TikTok." };
  }
}

// --- FAQ Actions ---

const faqSchema = z.object({
  id: z.string().nullish(),
  question: z.string().min(1, "La pregunta es requerida"),
  answer: z.string().min(1, "La respuesta es requerida"),
  order: z.coerce.number().int("El orden debe ser un número entero"),
});

export async function saveFaq(formData: FormData) {
  if (!db) throw new Error("Firestore no está configurado.");
  try {
    const rawData = {
      id: formData.get('id') || null,
      question: formData.get('question'),
      answer: formData.get('answer'),
      order: formData.get('order'),
    };

    const validatedFields = faqSchema.safeParse(rawData);
    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return { error: `Datos inválidos: ${JSON.stringify(errors)}` };
    }

    const { id: validatedId, ...faqData } = validatedFields.data;
    
    if (validatedId) {
      const faqRef = doc(db, 'faqs', validatedId);
      await updateDoc(faqRef, faqData);
    } else {
      await addDoc(collection(db, 'faqs'), faqData);
    }
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error) {
    console.error("Error guardando FAQ:", error);
    return { error: "No se pudo guardar la pregunta frecuente." };
  }
}

export async function deleteFaq(id: string) {
  if (!db) throw new Error("Firestore no está configurado.");

  try {
    const faqRef = doc(db, 'faqs', id);
    await deleteDoc(faqRef);
    revalidatePath('/admin');
    revalidatePath('/catalogo');
    return { success: true };
  } catch (error) {
    console.error("Error eliminando FAQ:", error);
    return { error: "No se pudo eliminar la pregunta frecuente." };
  }
}


// --- Checkout Action ---

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
