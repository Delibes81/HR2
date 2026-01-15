
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
                  src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group.png?alt=media&token=2486ca1b-9fbe-4305-b9de-bbf5690d9bb6"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%20verde_2.png?alt=media&token=ecf1a8bf-e152-4f5d-9f8e-01053535dec5"
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
                  src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group(1).png?alt=media&token=e191e2f3-36b0-4b70-8112-5da6f8a8d07c"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%202560x1706%20naranja(1).png?alt=media&token=2bd5a6ab-ca57-4988-a03a-3b6341dc48a1"
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
                  src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group.png?alt=media&token=2486ca1b-9fbe-4305-b9de-bbf5690d9bb6"
                  alt="Tu Remedio Sagrado para la Recuperación"
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%20verde_2.png?alt=media&token=ecf1a8bf-e152-4f5d-9f8e-01053535dec5"
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
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group.png?alt=media&token=2486ca1b-9fbe-4305-b9de-bbf5690d9bb6"
                            alt="Tu Remedio Sagrado para la Recuperación"
                            width={1200}
                            height={600}
                            className="w-full h-full object-cover"
                            priority
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Image
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%20verde_2.png?alt=media&token=ecf1a8bf-e152-4f5d-9f8e-01053535dec5"
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
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group(1).png?alt=media&token=e191e2f3-36b0-4b70-8112-5da6f8a8d07c"
                            alt="Tu Remedio Sagrado para la Recuperación"
                            width={1200}
                            height={600}
                            className="w-full h-full object-cover"
                            priority
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Image
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%202560x1706%20naranja(1).png?alt=media&token=2bd5a6ab-ca57-4988-a03a-3b6341dc48a1"
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
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Clip%20path%20group.png?alt=media&token=2486ca1b-9fbe-4305-b9de-bbf5690d9bb6"
                            alt="Tu Remedio Sagrado para la Recuperación"
                            width={1200}
                            height={600}
                            className="w-full h-full object-cover"
                            priority
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Image
                            src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/stick%20holymoly%20verde_2.png?alt=media&token=ecf1a8bf-e152-4f5d-9f8e-01053535dec5"
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
              src="https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/HM%20horizontal%20subs.mov?alt=media&token=dbb0df42-b29e-4359-8c55-dcb11051994b" 
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
