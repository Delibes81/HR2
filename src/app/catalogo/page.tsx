
"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toCategory, toProduct } from "@/lib/products";
import type { Product, Category, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { AnimatedMetrics } from "@/components/animated-metrics";
import { FaqSection } from "@/components/faq-section";
import { Skeleton } from "@/components/ui/skeleton";

function CatalogSkeleton() {
  return (
    <>
      <Skeleton className="w-full h-64 md:h-80" />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center"><Skeleton className="h-16 w-32 mb-2" /><Skeleton className="h-6 w-48" /></div>
            <div className="flex flex-col items-center"><Skeleton className="h-16 w-32 mb-2" /><Skeleton className="h-6 w-48" /></div>
            <div className="flex flex-col items-center"><Skeleton className="h-16 w-32 mb-2" /><Skeleton className="h-6 w-48" /></div>
          </div>
        </div>
      </section>
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center mb-12 md:mb-16">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="mt-4 h-6 w-3/4 mx-auto" />
        </div>
        <div className="w-full py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center mb-8 h-20">
              <Skeleton className="h-12 w-64" />
            </div>
            <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-6xl mx-auto">
              <Skeleton className="h-96 w-full max-w-xs sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]" />
              <Skeleton className="h-96 w-full max-w-xs sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]" />
              <Skeleton className="h-96 w-full max-w-xs sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CatalogPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const productsQuery = query(collection(db, 'products'), orderBy('name', 'asc'));

    const unsubCategories = onSnapshot(categoriesQuery, (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map(doc => toCategory(doc));

      const unsubProducts = onSnapshot(productsQuery, (productSnapshot) => {
        const allProducts = productSnapshot.docs.map(doc => toProduct(doc));

        const productsByCategory: Record<string, Product[]> = {};
        for (const product of allProducts) {
          if (!productsByCategory[product.category]) {
            productsByCategory[product.category] = [];
          }
          productsByCategory[product.category].push(product);
        }

        const categoryList: ProductCategory[] = categoriesData
          .map(category => ({
            name: category.name,
            logo: category.logo || undefined,
            products: productsByCategory[category.name] || []
          }))
          .filter(category => category.products.length > 0);

        setCategories(categoryList);
        setIsLoading(false);
      });

      return () => unsubProducts();
    });

    return () => unsubCategories();
  }, []);

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  return (
    <>
      <div className="relative w-full h-64 md:h-80">
        <Image
          src="https://placehold.co/1920x600?text=Catalog+Banner"
          alt="Banner de productos Holy Remedies"
          fill
          className="object-cover object-[center_20%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-black/30" />
      </div>

      <section className="py-12 md:py-16">
        <AnimatedMetrics />
      </section>

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center mb-12 md:mb-16">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
            Nuestros Productos
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Descubre nuestras fórmulas sagradas para la recuperación y el bienestar.
          </p>
        </div>

        <div className="flex flex-col items-center">
          {categories.map((category, index) => (
            <section
              key={category.name}
              className={cn(
                "w-full py-16",
                index % 2 === 1 ? "bg-secondary" : "bg-background"
              )}
            >
              <div className="container mx-auto px-4">
                <div className="flex justify-center items-center mb-8 h-20">
                  {category.logo ? (
                    <Image
                      src={category.logo}
                      alt={`${category.name} logo`}
                      width={250}
                      height={70}
                      className="h-auto object-contain max-h-full"
                    />
                  ) : (
                    <h2 className="text-3xl font-headline font-bold tracking-tighter text-center">
                      {category.name}
                    </h2>
                  )}
                </div>

                {category.products.length > 0 ? (
                  <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-6xl mx-auto">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No hay productos en esta categoría.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FaqSection />
        </div>
      </section>
    </>
  );
}
