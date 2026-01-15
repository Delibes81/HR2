
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 1,
    number: "01",
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/agentes_1.png?alt=media&token=a952ea1c-78b7-411e-bbf3-4592e0cbfcfd",
    lines: [
      { text: "HOLY MOLY ", highlight: true },
      { text: 'envía a sus "Agentes Especiales"' },
    ],
    color: "bg-[#f7a83f]",
    textColor: "text-[#f7a83f]",
    darkerColor: "bg-[#f28b33]",
    rawColor: '#f7a83f',
  },
  {
    id: 2,
    number: "02",
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/transformado_2.png?alt=media&token=5669d3db-2a08-4e13-9827-fab1546456cd",
    lines: [
      { text: "TRANSFORMANDO ", highlight: true },
      { text: "el alcohol en sustancias menos tóxicas" },
    ],
    color: "bg-[#A076F5]",
    textColor: "text-[#A076F5]",
    darkerColor: "bg-[#7B4EE1]",
    rawColor: '#A076F5'
  },
  {
    id: 3,
    number: "03",
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/Recuperacio%CC%81n_3.png?alt=media&token=66cb277a-81a4-45e0-8352-e4ad9b10ab41",
    lines: [
      { text: "Logrando una " },
      { text: "RECUPERACIÓN MÁS RÁPIDA ", highlight: true },
      { text: "gracias a sus electrolitos y vitaminas." },
    ],
    color: "bg-[#EE649A]",
    textColor: "text-[#EE649A]",
    darkerColor: "bg-[#D94980]",
    rawColor: '#EE649A'
  },
  {
    id: 4,
    number: "04",
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/efecto_4.png?alt=media&token=c127acd9-fb62-411c-b36d-597883f78f94",
    lines: [
      { text: "Recuerda que el alcohol tiene un " },
      { text: "EFECTO DIURÉTICO ", highlight: true },
      { text: "el cual provoca la pérdida de minerales esenciales." },
    ],
    color: "bg-[#28C6B1]",
    textColor: "text-[#28C6B1]",
    darkerColor: "bg-[#1FA896]",
    rawColor: '#28C6B1'
  },
  {
    id: 5,
    number: "05",
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/holy-remedies.firebasestorage.app/o/holymoly_5.png?alt=media&token=ee0e1bf6-cdc8-4f3d-b383-849c5e3a59aa",
    lines: [
      { text: "HOLY MOLY ", highlight: true },
      { text: "llega al rescate para equilibrar tu cuerpo, reponer lo esencial y llenarte de energía." },
    ],
    color: "bg-[#f4e408]",
    textColor: "text-[#f4e408]",
    darkerColor: "bg-[#e5d223]",
    rawColor: '#f4e408'
  },
];


export function HowItWorks() {
  const [activeId, setActiveId] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId((prevId) => (prevId % steps.length) + 1);
    }, 4000); // Change step every 4 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);


  return (
    <section
      className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080?text=Background')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative container mx-auto px-4 md:px-6 z-10">
        {/* Mat Frame */}
        <div className="bg-background/70 p-2 md:p-4 rounded-xl shadow-lg">
          <div className="bg-background rounded-lg p-6 md:p-10">
            <div className="text-center mb-12 md:mb-20">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://placehold.co/400x114?text=Estas+Crudito"
                  alt="¿Estás crudito?"
                  width={400}
                  height={114}
                />
              </div>
              <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-lg">
                Holy Moly es un boost para tu cuerpo diseñado específicamente para cuando las cosas se salen de control.
              </p>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden md:flex justify-center items-start gap-4 lg:gap-0 flex-wrap">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "relative flex flex-col items-center group w-56",
                    index > 0 && "lg:-ml-10" // Overlap on large screens
                  )}
                >
                  {/* Text block + Connector */}
                  <div className="h-48 flex flex-col items-center justify-end text-center">
                    <div className={cn(
                      "transition-opacity duration-500 px-2",
                      activeId === step.id ? "opacity-100" : "opacity-0"
                    )}>
                      <p className="text-sm text-muted-foreground leading-tight mt-1 min-h-[5.5rem]">
                        {step.lines.map((line, index) => (
                          <span key={index} className={cn(line.highlight && `font-bold uppercase ${step.textColor}`)}>
                            {line.text}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="w-1.5 h-16 mt-4" style={{ backgroundColor: step.rawColor }}></div>
                    <div className="w-3 h-3 rounded-full -mt-1.5" style={{ backgroundColor: step.rawColor }}></div>
                  </div>

                  {/* The circle */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className={cn(
                      "absolute w-full h-full rounded-full transition-all duration-500 ease-in-out flex items-center justify-center",
                      step.color,
                      activeId === step.id ? 'scale-110' : 'scale-100'
                    )}>
                      <div className={cn(
                        "w-[85%] h-[85%] rounded-full",
                        step.darkerColor
                      )}></div>
                    </div>
                    <div className={cn("absolute pointer-events-none flex items-center justify-center")}>
                      {step.iconUrl ? (
                        <Image src={step.iconUrl} alt={`Step ${step.id} icon`} width={70} height={70} className="object-contain" />
                      ) : (
                        <span className="text-white font-bold text-5xl">{step.number}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Layout - Vertical */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-12">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center text-center">
                    <div className="h-44">
                      <div className={cn(
                        'transition-opacity duration-500',
                        activeId === step.id ? 'opacity-100' : 'opacity-0'
                      )}>
                        {/* Text block */}
                        <div className="w-full px-4">
                          <p className="text-sm text-muted-foreground leading-tight mt-1">
                            {step.lines.map((line, index) => (
                              <span key={index} className={cn(line.highlight && `font-bold uppercase ${step.textColor}`)}>
                                {line.text}
                              </span>
                            ))}
                          </p>
                        </div>

                        {/* Connector */}
                        <div className="w-1.5 h-16 my-3 mx-auto" style={{ backgroundColor: step.rawColor }}></div>
                      </div>
                    </div>

                    {/* Circle */}
                    <div
                      className="relative w-36 h-36 flex items-center justify-center"
                    >
                      <div className={cn(
                        "absolute w-full h-full rounded-full flex items-center justify-center transition-all duration-500 ease-in-out",
                        step.color,
                        activeId === step.id ? 'scale-110' : 'scale-100'
                      )}>
                        <div className={cn(
                          "w-[85%] h-[85%] rounded-full",
                          step.darkerColor
                        )}></div>
                      </div>
                      <div className={cn("absolute pointer-events-none flex items-center justify-center")}>
                        {step.iconUrl ? (
                          <Image src={step.iconUrl} alt={`Step ${step.id} icon`} width={63} height={63} className="object-contain" />
                        ) : (
                          <span className="text-white font-bold text-4xl">{step.number}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
