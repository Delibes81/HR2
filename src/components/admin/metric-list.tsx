
"use client";

import { useEffect, useState, useRef } from "react";
import type { Metric } from "@/lib/types";
import { getMetrics } from "@/lib/metrics";
// import { saveMetric } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

function MetricForm({
  metric,
  onSave,
}: {
  metric: Metric;
  onSave: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    await onSave(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={metric.id} />

      <div className="space-y-2">
        <Label htmlFor={`label-${metric.id}`}>Etiqueta</Label>
        <Input id={`label-${metric.id}`} name="label" defaultValue={metric.label} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`value-${metric.id}`}>Valor</Label>
        <Input id={`value-${metric.id}`} name="value" type="number" defaultValue={metric.value} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`color-${metric.id}`}>Color (Hex)</Label>
        <div className="flex items-center gap-2">
          <Input id={`color-${metric.id}`} name="color" defaultValue={metric.color} required className="w-full" />
          <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: metric.color }}></div>
        </div>
      </div>
      <Button type="submit">Guardar Métrica</Button>
    </form>
  );
}


export function MetricList() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const metricsData = await getMetrics();
      setMetrics(metricsData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las métricas." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSaveMetric = async (formData: FormData) => {
    if (!db) return;
    try {
      const id = formData.get('id') as string;
      const label = formData.get('label') as string;
      const value = parseInt(formData.get('value') as string || '0');
      const color = formData.get('color') as string;

      const metricData = {
        id,
        label,
        value,
        color
      };

      await setDoc(doc(db, "metrics", id), metricData);
      toast({ title: "¡Éxito!", description: "Métrica guardada correctamente." });
      fetchMetrics();
    } catch (error) {
      console.error("Error saving metric:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la métrica." });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={metric.id}>
          <CardHeader>
            <CardTitle className="font-headline">Métrica {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricForm metric={metric} onSave={handleSaveMetric} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
