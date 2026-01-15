
"use client";

import { useEffect, useState, useRef } from "react";
import type { FaqItem } from "@/lib/types";
import { getFaqs } from "@/lib/faq";
import { saveFaq, deleteFaq } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
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

function FaqForm({
  faq,
  onSave,
  onOpenChange,
}: {
  faq?: FaqItem;
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
        {faq?.id && <input type="hidden" name="id" value={faq.id} />}
        
        <div className="space-y-2">
            <Label htmlFor="order">Orden</Label>
            <Input id="order" name="order" type="number" defaultValue={faq?.order ?? 0} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="question">Pregunta</Label>
            <Input id="question" name="question" defaultValue={faq?.question ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="answer">Respuesta</Label>
            <Textarea id="answer" name="answer" defaultValue={faq?.answer ?? ''} required rows={5} />
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Pregunta"}</Button>
    </form>
  );
}


export function FaqList() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | undefined>(undefined);
  const { toast } = useToast();

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
        const faqsData = await getFaqs();
        setFaqs(faqsData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las preguntas frecuentes." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSaveFaq = async (formData: FormData) => {
    const result = await saveFaq(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Pregunta guardada correctamente." });
      fetchFaqs();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeleteFaq = async (id: string) => {
    const result = await deleteFaq(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Pregunta eliminada correctamente." });
        fetchFaqs();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewFaqDialog = () => {
    setEditingFaq(undefined);
    setIsDialogOpen(true);
  }

  const openEditFaqDialog = (faq: FaqItem) => {
    setEditingFaq(faq);
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingFaq(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewFaqDialog}>Añadir Pregunta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingFaq ? 'Editar Pregunta' : 'Añadir Nueva Pregunta'}</DialogTitle>
            </DialogHeader>
            <FaqForm faq={editingFaq} onSave={handleSaveFaq} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Pregunta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.order}</TableCell>
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditFaqDialog(faq)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la pregunta frecuente.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteFaq(faq.id)}>Continuar</AlertDialogAction>
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
