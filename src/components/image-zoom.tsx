
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageZoomProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function ImageZoom({ src, alt, children }: ImageZoomProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">Imagen ampliada de {alt}</DialogDescription>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          className="w-full h-auto object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
