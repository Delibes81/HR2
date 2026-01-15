
import type {Metadata} from 'next';
import './globals.css';
import { cn } from "@/lib/utils"
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Providers } from '@/components/providers';
import { Toaster } from "@/components/ui/toaster"
import { PromoBanner } from '@/components/promo-banner';

export const metadata: Metadata = {
  title: 'Holy Remedies',
  description: 'Suplementos para recuperarte del ejercicio y de la fiesta.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <PromoBanner />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
