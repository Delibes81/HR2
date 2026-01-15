
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { createCheckoutSession } from "@/app/actions";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("El email no es válido."),
  address: z.string().min(1, "La dirección es requerida."),
  city: z.string().min(1, "La ciudad es requerida."),
  zip: z.string().min(1, "El código postal es requerido."),
});

export function CheckoutForm() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);

    if (cartItems.length === 0) {
      toast({ variant: "destructive", title: "Carrito vacío", description: "Tu carrito está vacío." });
      setIsProcessing(false);
      return;
    }

    if (!db) {
        toast({ variant: "destructive", title: "Error", description: "La base de datos no está configurada. No se puede procesar el pago." });
        setIsProcessing(false);
        return;
    }
    
    const result = await createCheckoutSession(cartItems, values.email);

    if (result.error || !result.sessionId || !result.customerId) {
      toast({ variant: "destructive", title: "Error", description: result.error || "No se pudo crear la sesión de pago." });
      setIsProcessing(false);
      return;
    }
    
    const docPath = `customers/${result.customerId}/checkout_sessions/${result.sessionId}`;

    const unsubscribe = onSnapshot(doc(db, docPath), (snap) => {
      const data = snap.data();
      const error = data?.error;
      const url = data?.url;

      if (error) {
        toast({ variant: "destructive", title: "Error de pago", description: error.message });
        setIsProcessing(false);
        unsubscribe();
      }
      
      if (url) {
        clearCart();
        window.location.assign(url);
        unsubscribe();
      }
    }, (error) => {
        toast({ variant: "destructive", title: "Error de conexión", description: "No se pudo conectar para finalizar el pago." });
        setIsProcessing(false);
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Información de Envío y Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email-input" placeholder="juan.perez@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle Falsa 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                          <Input placeholder="Ciudad de México" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                          <Input placeholder="01000" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Resumen del Pedido</h3>
                  {cartItems.map(item => {
                    const priceToUse = (item.promotionalPrice && item.promotionalPrice > 0) ? item.promotionalPrice : item.price;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(priceToUse * item.quantity).toFixed(2)}</span>
                      </div>
                    )
                  })}
                   <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                  </div>
              </div>

              <Button id="checkout-button" type="submit" size="lg" className="w-full" variant="accent" disabled={isProcessing}>
                {isProcessing ? "Procesando..." : `Pagar $${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
    </>
  );
}
