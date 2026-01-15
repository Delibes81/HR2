"use client"

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MouseEvent } from 'react';

export function AddToCartButton({ product, className, onClick }: { product: Product, className?: string, onClick?: (e: MouseEvent<HTMLButtonElement>) => void }) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
        if(onClick) {
            onClick(e);
        }
        addToCart(product, 1);
        toast({
          title: "¡Añadido al carrito!",
          description: `${product.name} ha sido añadido a tu carrito.`,
        });
    }

    return (
        <Button onClick={handleAddToCart} variant="accent" className={className}>
            <ShoppingCart className="mr-2 h-4 w-4"/>
            Añadir
        </Button>
    )
}