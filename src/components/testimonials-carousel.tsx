"use client"

import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"
import { getTestimonials } from "@/lib/testimonials"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

function TestimonialSkeleton() {
    return (
        <div className="p-1">
            <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center text-center p-6 gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                        <div className="flex justify-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-muted-foreground/20" />
                            ))}
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
      setIsLoading(false);
    }
    fetchTestimonials();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12 sm:text-4xl">
        Lo que dicen nuestros clientes
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: testimonials.length > 2,
        }}
        plugins={testimonials.length > 1 ? [
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
        ] : []}
        className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
      >
        <CarouselContent>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <TestimonialSkeleton />
                </CarouselItem>
            ))
          ) : testimonials.length === 0 ? (
            <CarouselItem>
                <p className="text-center text-muted-foreground">Aún no hay testimonios. ¡Vuelve pronto!</p>
            </CarouselItem>
          ) : (
            testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 gap-4">
                      <Avatar className="w-20 h-20 border">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                          <h3 className="font-bold text-lg">{testimonial.name}</h3>
                          <div className="flex justify-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                                  }`}
                                  />
                              ))}
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">"{testimonial.text}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        {testimonials.length > 1 && <>
            <CarouselPrevious />
            <CarouselNext />
        </>}
      </Carousel>
    </div>
  )
}
