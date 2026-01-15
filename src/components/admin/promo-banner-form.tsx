
"use client";

import { useEffect, useState, useRef } from "react";
import type { PromoBanner } from "@/lib/types";
import { getPromoBanner } from "@/lib/promo-banner";
import { savePromoBanner } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";

function PromoBannerSkeleton() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
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

export function PromoBannerForm() {
  const [banner, setBanner] = useState<PromoBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    async function fetchBanner() {
      setIsLoading(true);
      const bannerData = await getPromoBanner();
      setBanner(bannerData);
      setBgColor(bannerData.backgroundColor || '#29ABE2');
      setTextColor(bannerData.textColor || '#FFFFFF');
      setIsLoading(false);
    }
    fetchBanner();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    const result = await savePromoBanner(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Banner guardado correctamente." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <PromoBannerSkeleton />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Banner Promocional Superior</CardTitle>
        <CardDescription>
          Gestiona el banner que aparece en la parte superior de todo el sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Texto del Banner</Label>
            <Input id="text" name="text" defaultValue={banner?.text ?? ''} required placeholder="Ej: ¡Envío gratis en todos los pedidos!"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Enlace (Opcional)</Label>
            <Input id="link" name="link" type="url" defaultValue={banner?.link ?? ''} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de Fondo (Hex)</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        id="backgroundColor" 
                        name="backgroundColor" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        required 
                        placeholder="#29ABE2"
                    />
                    <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: bgColor }}></div>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="textColor">Color de Texto (Hex)</Label>
                 <div className="flex items-center gap-2">
                    <Input 
                        id="textColor" 
                        name="textColor" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        required 
                        placeholder="#FFFFFF"
                    />
                     <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: textColor }}></div>
                </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={banner?.isActive ?? false} />
            <Label htmlFor="isActive">Mostrar Banner en el sitio</Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Banner"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
