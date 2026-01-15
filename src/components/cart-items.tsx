
"use client"

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator";

export function CartItems() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center space-y-4">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground">Parece que aún no has añadido nada. ¡Explora nuestro catálogo!</p>
        <Button asChild>
          <Link href="/catalogo">Ir al Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
      <div className="space-y-4">
        {cartItems.map((item) => {
          const priceToDisplay = (item.promotionalPrice && item.promotionalPrice > 0) ? item.promotionalPrice : item.price;
          const hasPromo = (item.promotionalPrice && item.promotionalPrice > 0);
          return (
            <Card key={item.id} className="flex items-center p-4 gap-4">
              <Image
                src={item.images[0]}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              <div className="flex-grow space-y-1">
                <span className="font-semibold">{item.name}</span>
                <div className="flex items-baseline gap-2">
                    <p className={`font-semibold ${hasPromo ? 'text-destructive' : 'text-muted-foreground'}`}>
                        ${priceToDisplay.toFixed(2)}
                    </p>
                    {hasPromo && <p className="text-sm text-muted-foreground line-through">${item.price.toFixed(2)}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-20 h-9"
                      aria-label={`Cantidad de ${item.name}`}
                  />
                </div>
              </div>
              <div className="text-right">
                  <p className="font-semibold">${(priceToDisplay * item.quantity).toFixed(2)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label={`Quitar ${item.name} del carrito`}>
                <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </Card>
          )
        })}
      </div>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full" variant="accent" size="lg">
                <Link href="/checkout">Proceder al Pago</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
