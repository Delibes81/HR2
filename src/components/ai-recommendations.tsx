"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductRecommendations } from "@/app/actions";
import { Wand2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    const result = await getProductRecommendations();
    if (result.success) {
      setRecommendations(result.recommendations);
    } else {
      setError(result.error || "Algo salió mal.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="mb-12 bg-secondary border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline">
            <Wand2 className="text-primary"/>
            <span>Recomendaciones con IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          ¿No sabes por dónde empezar? Deja que nuestra IA te sugiera productos basados en las tendencias actuales de nuestro catálogo.
        </p>
        <Button onClick={handleFetchRecommendations} disabled={isLoading}>
          {isLoading ? "Generando..." : "Obtener Recomendaciones"}
        </Button>
        {isLoading && (
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
            </div>
        )}
        {error && <p className="mt-4 text-destructive">{error}</p>}
        {recommendations && (
          <div className="mt-4 p-4 bg-background rounded-md whitespace-pre-wrap">
            <h3 className="font-bold mb-2">Sugerencias para ti:</h3>
            <p className="text-sm">{recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
