
"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getMetrics } from "@/lib/metrics";
import type { Metric } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

function AnimatedCounter({ end, duration = 2000, className, style }: { end: number, duration?: number, className?: string, style?: React.CSSProperties }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const stepTime = 50; // ms

  useEffect(() => {
    if (inView) {
      let currentCount = 0;
      const steps = duration / stepTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(currentCount));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, end, duration, stepTime]);

  return <span ref={ref} className={className} style={style}>{count.toLocaleString()}</span>;
}

function MetricSkeleton() {
    return (
        <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-32 mb-2" />
            <Skeleton className="h-6 w-48" />
        </div>
    );
}

export function AnimatedMetrics() {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            setIsLoading(true);
            const data = await getMetrics();
            setMetrics(data);
            setIsLoading(false);
        }
        fetchMetrics();
    }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {isLoading ? (
            <>
                <MetricSkeleton />
                <MetricSkeleton />
                <MetricSkeleton />
            </>
        ) : (
            metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center">
                <AnimatedCounter
                end={metric.value}
                className="text-6xl font-bold"
                style={{ color: metric.color }}
                />
                <p className="mt-2 text-muted-foreground text-lg">{metric.label}</p>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
