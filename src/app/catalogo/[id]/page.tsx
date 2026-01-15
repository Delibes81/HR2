
"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImageZoom } from "@/components/image-zoom";
import { Skeleton } from "@/components/ui/skeleton";

type ProductPageProps = {
  params: {
    id: string;
  };
};

function ProductPageSkeleton() {
  return (
    <div className="container py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id: productId } = params;

  useEffect(() => {
    if (!db || !productId) {
        setLoading(false);
        return;
    }
    const productRef = doc(db, 'products', productId);
    const unsubscribe = onSnapshot(productRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setProduct({
                id: docSnap.id,
                name: data.name,
                description: data.description,
                price: data.price,
                promotionalPrice: data.promotionalPrice,
                images: data.images || [],
                category: data.category
            });
        } else {
            setProduct(null);
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    notFound();
  }
  
  const hasPromo = product.promotionalPrice && product.promotionalPrice > 0 && product.promotionalPrice < product.price;

  return (
    <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <Carousel className="w-full">
                <CarouselContent>
                    {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                           <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <ImageZoom src={image} alt={`${product.name} - imagen ${index + 1}`}>
                                        <Image
                                            src={image}
                                            alt={`${product.name} - imagen ${index + 1}`}
                                            width={800}
                                            height={800}
                                            className="w-full h-auto object-cover aspect-square cursor-zoom-in"
                                            priority={index === 0}
                                        />
                                    </ImageZoom>
                                </CardContent>
                           </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {product.images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </>
                )}
            </Carousel>
            
            <div className="space-y-6">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">{product.name}</h1>
                <div className="flex items-baseline gap-4">
                    {hasPromo ? (
                    <>
                        <p className="text-4xl font-bold text-destructive">
                        ${product.promotionalPrice?.toFixed(2)}
                        </p>
                        <p className="text-2xl font-medium text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                        </p>
                    </>
                    ) : (
                    <p className="text-4xl font-bold">
                        ${product.price.toFixed(2)}
                    </p>
                    )}
                </div>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                </div>
                 <AddToCartButton product={product} className="w-full sm:w-auto" />
            </div>
        </div>
    </div>
  );
}
