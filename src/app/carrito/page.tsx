import { CartItems } from "@/components/cart-items";

export default function CartPage() {
    return (
        <div className="container py-12">
             <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl text-center mb-12">Tu Carrito</h1>
             <CartItems />
        </div>
    )
}
