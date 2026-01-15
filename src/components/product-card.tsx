"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "./add-to-cart-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { MouseEvent } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images?.[0] || 'https://placehold.co/600x600.png';
  const hasPromo = product.promotionalPrice && product.promotionalPrice < product.price;

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <Card className={cn("flex flex-col overflow-hidden h-full w-full max-w-xs sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] group", className)}>
        <Link href={`/catalogo/${product.id}`} className="flex flex-col h-full">
            <div className="relative p-0 overflow-hidden">
                <Image
                src={primaryImage}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex-grow">
                <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                    {hasPromo ? (
                    <>
                        <p className="text-2xl font-semibold text-destructive">
                        ${product.promotionalPrice?.toFixed(2)}
                        </p>
                        <p className="text-lg font-medium text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                        </p>
                    </>
                    ) : (
                    <p className="text-2xl font-semibold">
                        ${product.price.toFixed(2)}
                    </p>
                    )}
                </div>
                </div>
                 <AddToCartButton
                    product={product}
                    className="w-full mt-4"
                    onClick={handleButtonClick}
                />
            </CardContent>
        </Link>
    </Card>
  );
}