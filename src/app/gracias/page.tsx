import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="container py-24 text-center">
      <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="mt-6 text-4xl font-headline font-bold">¡Gracias por tu compra!</h1>
      <p className="mt-4 text-muted-foreground md:text-lg">
        Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por email en breve.
      </p>
      <Button asChild className="mt-8">
        <Link href="/catalogo">Seguir Comprando</Link>
      </Button>
    </div>
  );
}
