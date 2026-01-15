
"use client";

import { useEffect, useState, useRef } from "react";
import type { Product, Category } from "@/lib/types";
import { getProducts, getAdminCategories } from "@/lib/products";
import { saveProduct, deleteProduct } from "@/app/actions";
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
import { Edit, Trash2, X } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";

function ProductForm({
  product,
  categories,
  onSave,
  onOpenChange,
}: {
  product?: Product;
  categories: Category[];
  onSave: (values: FormData) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const handleNewImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewImageFiles(files);
      setNewImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    formData.delete('images');
    newImageFiles.forEach(file => formData.append('images', file));
    formData.set('existingImages', JSON.stringify(existingImages));
    await onSave(formData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
        {product?.id && <input type="hidden" name="id" value={product.id} />}
      
        <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={product?.name ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={product?.description ?? ''} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="price">Precio Real</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price ?? 0} required />
          </div>
          <div className="space-y-2">
              <Label htmlFor="promotionalPrice">Precio de Promoción (Opcional)</Label>
              <Input id="promotionalPrice" name="promotionalPrice" type="number" step="0.01" defaultValue={product?.promotionalPrice ?? 0} />
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select name="category" defaultValue={product?.category ?? ''} required>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
          <Label>Imágenes Actuales</Label>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image src={image} alt={`Producto ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full h-24" />
                  <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeExistingImage(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No hay imágenes existentes.</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="images">Añadir Nuevas Imágenes</Label>
            <Input id="images" name="images" type="file" accept="image/*" multiple onChange={handleNewImagesChange} />
        </div>

        {newImagePreviews.length > 0 && (
            <div className="space-y-2">
                <Label>Previsualización de Nuevas Imágenes</Label>
                <div className="grid grid-cols-3 gap-2">
                    {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                            <Image src={preview} alt={`Nueva imagen ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full h-24" />
                             <Button type="button" size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeNewImage(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}
       
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Producto"}</Button>
    </form>
  );
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
        const [productsData, categoriesData] = await Promise.all([
            getProducts(),
            getAdminCategories() 
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleSaveProduct = async (formData: FormData) => {
    const result = await saveProduct(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Producto guardado correctamente." });
      fetchProductsAndCategories();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Producto eliminado correctamente." });
        fetchProductsAndCategories();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewProductDialog = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  }

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  }
  
  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Skeleton className="h-10 w-36" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingProduct(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewProductDialog}>Añadir Producto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onOpenChange={setIsDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Precio Promocional</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.promotionalPrice ? `$${product.promotionalPrice.toFixed(2)}` : '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Continuar</AlertDialogAction>
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
