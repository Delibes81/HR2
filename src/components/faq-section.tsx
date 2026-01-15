
"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqs } from "@/lib/faq";
import type { FaqItem } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

function FaqSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-b">
                    <div className="flex justify-between items-center py-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function FaqSection() {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchFaqs() {
            setIsLoading(true);
            const faqsData = await getFaqs();
            setFaqs(faqsData);
            setIsLoading(false);
        }
        fetchFaqs();
    }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
                ¿Tienes dudas? Aquí resolvemos las más comunes.
            </p>
        </div>
        {isLoading ? (
            <FaqSkeleton />
        ) : faqs.length === 0 ? (
            <p className="text-center text-muted-foreground">Aún no hay preguntas frecuentes.</p>
        ) : (
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base whitespace-pre-wrap">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        )}
    </div>
  )
}
