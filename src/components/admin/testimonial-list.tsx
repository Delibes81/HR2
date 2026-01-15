"use client";

import { useEffect, useState, useRef } from "react";
import type { Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/testimonials";
import { saveTestimonial, deleteTestimonial } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function TestimonialForm({
  testimonial,
  onSave,
  onOpenChange,
}: {
  testimonial?: Testimonial;
  onSave: (values: FormData) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    await onSave(formData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
        {testimonial?.id && <input type="hidden" name="id" value={testimonial.id} />}
        {testimonial?.avatar && <input type="hidden" name="existingAvatar" value={testimonial.avatar} />}
      
        <div className="space-y-2">
            <Label htmlFor="name">Nombre del Cliente</Label>
            <Input id="name" name="name" defaultValue={testimonial?.name ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="fallback">Iniciales (Fallback)</Label>
            <Input id="fallback" name="fallback" defaultValue={testimonial?.fallback ?? ''} required maxLength={2} placeholder="EJ: JD"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="text">Texto del Testimonio</Label>
            <Textarea id="text" name="text" defaultValue={testimonial?.text ?? ''} required rows={5} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="rating">Calificación (1-5)</Label>
            <Input id="rating" name="rating" type="number" min="1" max="5" defaultValue={testimonial?.rating ?? 5} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="avatar">Avatar del Cliente</Label>
            {testimonial?.avatar && (
                <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Avatar actual:</p>
                    <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                    </Avatar>
                </div>
            )}
            <Input id="avatar" name="avatar" type="file" accept="image/*" />
             <p className="text-xs text-muted-foreground">
                {testimonial?.avatar ? 'Sube un nuevo archivo para reemplazar el avatar actual.' : 'Sube un archivo de imagen.'}
            </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Testimonio"}</Button>
    </form>
  );
}


export function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>(undefined);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
        const testimonialsData = await getTestimonials();
        setTestimonials(testimonialsData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los testimonios." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSaveTestimonial = async (formData: FormData) => {
    const result = await saveTestimonial(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Testimonio guardado correctamente." });
      fetchTestimonials();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeleteTestimonial = async (id: string) => {
    const result = await deleteTestimonial(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Testimonio eliminado correctamente." });
        fetchTestimonials();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewTestimonialDialog = () => {
    setEditingTestimonial(undefined);
    setIsDialogOpen(true);
  }

  const openEditTestimonialDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingTestimonial(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewTestimonialDialog}>Añadir Testimonio</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingTestimonial ? 'Editar Testimonio' : 'Añadir Nuevo Testimonio'}</DialogTitle>
            </DialogHeader>
            <TestimonialForm testimonial={editingTestimonial} onSave={handleSaveTestimonial} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Testimonio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>
                 <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{testimonial.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                    {testimonial.rating} <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400"/>
                </div>
              </TableCell>
              <TableCell className="max-w-sm truncate">{testimonial.text}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditTestimonialDialog(testimonial)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el testimonio.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTestimonial(testimonial.id)}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
