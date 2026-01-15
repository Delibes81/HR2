
import Image from 'next/image';
import Script from 'next/script';
import { HowItWorks } from '@/components/how-it-works';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTikTokEmbed } from '@/lib/tiktok';
import { TiktokEmbed } from '@/components/tiktok-embed';

export default async function Home() {
  const tiktok = await getTikTokEmbed();

  return (
    <>
      {/* Hero Section */}
      <section>
        {/* Desktop Hero */}
        <div className="hidden md:block">
          <div className="relative w-full h-[80vh] overflow-hidden">
            <div className="flex w-[300%] h-full animate-slide-in-out">
              {/* Scene 1: Base (Purple/Limón) */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/6A0dad/ffffff?text=Hero+Image+1"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/00ff00/000000?text=Stick+Green"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-1/2 h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Scene 2: Overlay (Orange) */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/FFA500/ffffff?text=Hero+Image+2"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/FFA500/000000?text=Stick+Orange"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-1/2 h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Scene 1 Copy for seamless loop */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/6A0dad/ffffff?text=Hero+Image+1"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/00ff00/000000?text=Stick+Green"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-1/2 h-auto"
                    priority
                  />
                </div>
              </div>

            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl font-bold font-headline max-w-3xl text-primary-foreground">
                Cruda realidad. Sagrada solución: Holy Moly va contigo: antes, durante o después de la fiesta.
              </h1>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="accent">
                  <Link href="/catalogo">Comprar</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-background transition-colors bg-transparent backdrop-blur-sm">
                  <Link href="#como-funciona">Cómo funciona</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden">
          <div className="relative w-full h-[60vh] overflow-hidden">
            <div className="flex w-[300%] h-full animate-slide-in-out">
              {/* Scene 1: Base (Purple/Limón) */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/6A0dad/ffffff?text=Hero+Image+1"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/00ff00/000000?text=Stick+Green"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-full h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Scene 2: Overlay (Orange) */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/FFA500/ffffff?text=Hero+Image+2"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/FFA500/000000?text=Stick+Orange"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-1/2 h-auto"
                    priority
                  />
                </div>
              </div>

              {/* Scene 1 Copy for seamless loop */}
              <div className="relative w-1/3 h-full shrink-0">
                <Image
                  src="https://placehold.co/1200x600/6A0dad/ffffff?text=Hero+Image+1"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://placehold.co/500x500/00ff00/000000?text=Stick+Green"
                    alt="Floating Supplement Stick"
                    width={500}
                    height={500}
                    className="animate-float w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-400 p-8 text-center">
            <h1 className="text-2xl font-bold font-headline max-w-3xl text-gray-800 mx-auto">
              Cruda realidad. Sagrada solución: Holy Moly va contigo: antes, durante o después de la fiesta.
            </h1>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="accent">
                <Link href="/catalogo">Comprar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-yellow-400 transition-colors">
                <Link href="#como-funciona">Cómo funciona</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-background">
        <div className="w-full">
          <div className="aspect-video w-full overflow-hidden">
            <video
              className="w-full h-full object-cover"
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
            >
              Tu navegador no soporta el tag de video.
            </video>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div id="como-funciona">
        <HowItWorks />
      </div>

      {/* Embed Section */}
      {tiktok?.isActive && tiktok.embedCode && (
        <section className="py-12 md:py-24 bg-secondary">
          <TiktokEmbed embedCode={tiktok.embedCode} />
          <Script async src="https://www.tiktok.com/embed.js"></Script>
        </section>
      )}
    </>
  );
}
