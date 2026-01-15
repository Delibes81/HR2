
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeartPulse, Leaf, Sparkles } from "lucide-react";
import { getTeamMembers } from "@/lib/team";

export default async function NosotrosPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-80 w-full bg-black">
        <Image
          src="/images/about_hero.jpg"
          alt="Nuestro equipo en Holy Remedies"
          fill
          className="object-contain"
          priority
        />
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-primary">
          Nuestra Misión
        </h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          En Holy Remedies, creemos que el bienestar es un acto sagrado. Nuestra misión es crear remedios honestos,
          efectivos y deliciosos que te ayuden a recuperarte y a sentirte increíble, sin importar cómo se haya salido
          de control la noche anterior. Combinamos la ciencia con ingredientes de alta calidad para que puedas vivir tu
          vida al máximo y despertar renovado.
        </p>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <HeartPulse className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline">Ciencia y Bienestar</h3>
              <p className="mt-2 text-muted-foreground">
                Cada fórmula está respaldada por la ciencia para garantizar la máxima efectividad y seguridad.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Leaf className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline">Ingredientes de Calidad</h3>
              <p className="mt-2 text-muted-foreground">
                Solo usamos ingredientes de la más alta calidad, puros y potentes, para nutrir tu cuerpo.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline">Disfrute y Equilibrio</h3>
              <p className="mt-2 text-muted-foreground">
                Creemos en el equilibrio. Disfruta la vida al máximo sabiendo que tienes un aliado para tu recuperación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-center mb-12">
          Conoce al Equipo
        </h2>
        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center">
                <CardHeader className="items-center">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-headline">{member.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Aún no se han añadido miembros al equipo.</p>
        )}
      </section>
    </div>
  );
}
