
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function SiteHeader() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const navItems = [
    { href: "/", label: "Home" },
    { href: "/catalogo", label: "Productos" },
    { href: "/blog", label: "Blog" },
    { href: "/nosotros", label: "Nosotros" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top row: Logo, Actions */}
        <div className="flex h-20 items-center">
          {/* Left Section: Spacer */}
          <div className="flex-1 flex justify-start">
            {/* This div is a spacer to keep the logo centered */}
          </div>

          {/* Center Section: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <img
                src="https://placehold.co/176x44?text=Holy+Remedies"
                alt="Holy Remedies Logo"
                width={176}
                height={44}
                style={{ height: '44px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Right Section: Cart */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/carrito">
                <ShoppingCart className="h-7 w-7" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom row: Navigation Links */}
        <nav className="flex justify-center pt-4 pb-2">
          <div className="flex gap-8 items-center">
            {navItems.map((item) => {
              const isActive = item.href !== "#" && pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
              return (
                <div key={item.label} className="relative flex flex-col items-center">
                  <Image
                    src="https://placehold.co/20x20?text=O"
                    alt="Active page indicator"
                    width={20}
                    height={0}
                    className={cn(
                      "absolute -top-2 transition-opacity",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                    unoptimized
                  />
                  <Link href={item.href} className="text-base font-medium text-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
