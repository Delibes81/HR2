"use client";

import { useEffect, useState, useRef } from "react";
import type { Category } from "@/lib/types";
import { getAdminCategories } from "@/lib/products";
import { saveCategory, deleteCategory } from "@/app/actions";
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
import { Skeleton } from "../ui/skeleton";

function CategoryForm({
  category,
  onSave,
  onOpenChange,
}: {
  category?: Category;
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      {category?.logo && <input type="hidden" name="existingLogo" value={category.logo} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={category?.name ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        {category?.logo && (
            <div className="my-2">
                <p className="text-sm text-muted-foreground mb-2">Logo actual:</p>
                <Image src={category.logo} alt={category.name} width={100} height={40} className="rounded-md object-contain h-10" />
            </div>
        )}
        <Input id="logo" name="logo" type="file" accept="image/*" />
        <p className="text-xs text-muted-foreground">
            {category?.logo ? 'Sube un nuevo archivo para reemplazar el logo actual.' : 'Sube un archivo de imagen.'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Orden</Label>
        <Input id="order" name="order" type="number" defaultValue={category?.order ?? 0} required />
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Categoría"}</Button>
    </form>
  );
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
        const categoriesData = await getAdminCategories();
        setCategories(categoriesData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (formData: FormData) => {
    const result = await saveCategory(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Categoría guardada correctamente." });
      fetchCategories();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    const result = await deleteCategory(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Categoría eliminada correctamente." });
        fetchCategories();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewCategoryDialog = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  }

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
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
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingCategory(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewCategoryDialog}>Añadir Categoría</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingCategory ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</DialogTitle>
            </DialogHeader>
            <CategoryForm category={editingCategory} onSave={handleSaveCategory} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.logo && <Image src={category.logo} alt={category.name} width={100} height={40} className="object-contain h-10"/>}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.order}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría. Los productos asociados no se eliminarán.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Continuar</AlertDialogAction>
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
