import { CheckoutForm } from "@/components/checkout-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout | Holy Remedies',
    description: 'Completa tu compra de forma segura.',
};

export default function CheckoutPage() {
    return (
        <div className="container py-12 max-w-2xl mx-auto">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-center mb-12">Checkout</h1>
            <CheckoutForm />
        </div>
    )
}
