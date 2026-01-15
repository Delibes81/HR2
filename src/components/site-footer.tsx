
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Share2 } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-muted-foreground">

          <div className="md:col-span-2 flex justify-center md:justify-start">
            <Link href="/">
              <Image
                src="https://placehold.co/100x100?text=HR"
                alt="Holy Moly Logo"
                width={100}
                height={100}
                className="h-auto"
              />
            </Link>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <h3 className="font-bold text-primary uppercase text-sm tracking-wider">Contáctanos</h3>
              <div className="text-sm space-y-1">
                <p>
                  <a href="mailto:contacto@holyremedies.com.mx" className="hover:text-primary">
                    contacto@holyremedies.com.mx
                  </a>
                </p>
                <p>
                  <a href="tel:+525596314008" className="hover:text-primary">
                    Tel.: +52 55 9631 4008
                  </a>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-primary uppercase text-sm tracking-wider">Síguenos en</h3>
              <div className="space-y-1">
                <a href="https://www.facebook.com/holyremediesmx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 text-sm hover:text-primary">
                  <Facebook className="h-4 w-4" />
                  <span>@holyremediesmx</span>
                </a>
                <a href="https://www.instagram.com/holyremediesmx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 text-sm hover:text-primary">
                  <Instagram className="h-4 w-4" />
                  <span>holyremediesmx</span>
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-primary uppercase text-sm tracking-wider">Compartir Página</h3>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <a href="#" aria-label="Share on Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></a>
                <a href="#" aria-label="Share on Instagram"><Instagram className="h-5 w-5 hover:text-primary" /></a>
                <a href="#" aria-label="Share link"><Share2 className="h-5 w-5 hover:text-primary" /></a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center md:justify-end">
            <Link href="/login" title="Admin Login">
              <img
                src="https://placehold.co/120x30?text=Holy+Remedies"
                alt="Holy Remedies Logo"
                width={120}
                height={30}
                style={{ height: '30px', width: 'auto' }}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-primary-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-2">
            <Link href="/aviso-de-privacidad" className="hover:underline">Aviso de privacidad</Link>
            <span className="hidden sm:block">|</span>
            <Link href="/terminos-y-condiciones" className="hover:underline">Términos y condiciones</Link>
          </div>
          <p className="mt-2 text-xs opacity-90">
            © {new Date().getFullYear()} Holy Remedies. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
