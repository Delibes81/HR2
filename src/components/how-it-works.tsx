
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 1,
    number: "01",
    iconUrl: "/images/step_1_agents.png",
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
    iconUrl: "/images/step_2_bottles.png",
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
    iconUrl: "/images/step_3_recovery.png",
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
    iconUrl: "/images/step_4_diuretic.png",
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
    iconUrl: "/images/step_5_strength.png",
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
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full py-20 md:py-32 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080?text=Background')" }}
    >
      <div className="absolute inset-0 bg-neutral-900/60 z-0 backdrop-blur-[2px]"></div>
      <div className="relative container mx-auto px-4 md:px-6 z-10">

        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/estas_crudito.png"
                alt="¿Estás crudito?"
                width={400}
                height={114}
                className="drop-shadow-lg object-contain"
              />
            </div>
          </div>
          <p className="mt-6 max-w-2xl mx-auto text-white/90 text-lg md:text-xl font-light leading-relaxed">
            Holy Moly es un boost para tu cuerpo diseñado específicamente para cuando las cosas se salen de control.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-4 relative w-full">

          {steps.map((step, index) => {
            const isActive = activeId === step.id;
            return (
              <div
                key={step.id}
                className={cn(
                  "group relative flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                  isActive ? "scale-100 z-20" : "scale-90 opacity-80 hover:opacity-100 hover:scale-95",
                  "w-60 h-60 shrink-0"
                )}
              >
                {/* Circular Card Container */}
                <div
                  className={cn(
                    "w-full h-full rounded-full p-4 flex flex-col items-center justify-center text-center backdrop-blur-md border transition-colors duration-500 relative overflow-visible z-10",
                    isActive ? "border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  {/* Active Gradient Background Layer */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-opacity duration-500 ease-out -z-10",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      background: `radial-gradient(circle, ${step.rawColor}30 0%, transparent 70%), rgba(255,255,255,0.1)`
                    }}
                  ></div>

                  {/* Number Badge */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md z-30 text-sm ring-4 ring-neutral-900/10 transition-transform duration-500"
                    style={{ backgroundColor: step.rawColor }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-2 mt-2 relative w-12 h-12 flex items-center justify-center shrink-0 z-20">
                    <div className="relative z-10 drop-shadow-md">
                      {step.iconUrl ? (
                        <Image
                          src={step.iconUrl}
                          alt={`Paso ${step.number}`}
                          width={48}
                          height={48}
                          className="object-contain mix-blend-screen"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">{step.number}</span>
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col items-center justify-center w-full px-1 z-20">
                    <p className="text-xs text-white/90 leading-tight font-light transition-colors duration-300">
                      {step.lines.map((line, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "block",
                            line.highlight && isActive ? "font-bold mt-1 mb-1 tracking-wide" : "",
                            line.highlight && !isActive ? "font-medium" : ""
                          )}
                          style={line.highlight && isActive ? { color: step.rawColor } : {}}
                        >
                          {line.text}
                        </span>
                      ))}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
