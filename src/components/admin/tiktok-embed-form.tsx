
"use client";

import { useEffect, useState, useRef } from "react";
import type { TikTokEmbed } from "@/lib/types";
import { getTikTokEmbed } from "@/lib/tiktok";
import { saveTikTokEmbed } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";

function TikTokEmbedSkeleton() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex items-center space-x-2">
                     <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    );
}

export function TiktokEmbedForm() {
  const [tiktok, setTiktok] = useState<TikTokEmbed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetcher() {
      setIsLoading(true);
      const data = await getTikTokEmbed();
      setTiktok(data);
      setIsLoading(false);
    }
    fetcher();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    const result = await saveTikTokEmbed(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Código de TikTok guardado correctamente." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <TikTokEmbedSkeleton />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Código de Inserción de TikTok</CardTitle>
        <CardDescription>
          Gestiona el video de TikTok que aparece en la página de inicio. Pega el código de inserción completo aquí.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="embedCode">Código de Inserción de TikTok</Label>
            <Textarea 
                id="embedCode" 
                name="embedCode" 
                defaultValue={tiktok?.embedCode ?? ''} 
                required 
                placeholder='Pega el código de <blockquote class="tiktok-embed" ...>'
                rows={8}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={tiktok?.isActive ?? false} />
            <Label htmlFor="isActive">Mostrar video de TikTok en el sitio</Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Código"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
