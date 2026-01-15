
"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import type { BlogPost } from "@/lib/types";
import { getBlogPosts } from "@/lib/blog";
import { saveBlogPost, deleteBlogPost } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { getClientStorage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
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

function BlogPostForm({
  post,
  onSave,
  onOpenChange,
}: {
  post?: BlogPost;
  onSave: (values: FormData) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post?.image || 'https://placehold.co/1200x600');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getClientStorage();
    if (!storage) {
        toast({ variant: "destructive", title: "Error", description: "Firebase Storage no está configurado." });
        return;
    }

    setIsUploading(true);
    try {
        const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImageUrl(downloadURL);
    } catch (error) {
        console.error("Error uploading image:", error);
        toast({ variant: "destructive", title: "Error de Carga", description: "No se pudo subir la imagen." });
    } finally {
        setIsUploading(false);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    formData.set('image', imageUrl); // Ensure the final image URL is in the form data
    await onSave(formData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
        {post?.id && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="image" value={imageUrl} />
      
        <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" defaultValue={post?.title ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" name="author" defaultValue={post?.author ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea id="content" name="content" defaultValue={post?.content ?? ''} required rows={10} />
        </div>
        <div className="space-y-2">
            <Label>Imagen del Post</Label>
            <div className="mt-2 flex flex-col items-center gap-4">
                <Image src={imageUrl} alt={post?.title || "Imagen del post"} width={200} height={100} className="rounded-md object-cover" />
                <Input id="newImage" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Guardando..." : "Guardar Post"}
            </Button>
            {isUploading && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Cargando imagen...</span>
                </div>
            )}
        </div>
    </form>
  );
}


export function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
        const postsData = await getBlogPosts();
        setPosts(postsData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los posts." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSavePost = async (formData: FormData) => {
    const result = await saveBlogPost(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Post guardado correctamente." });
      fetchPosts();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeletePost = async (id: string) => {
    const result = await deleteBlogPost(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Post eliminado correctamente." });
        fetchPosts();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewPostDialog = () => {
    setEditingPost(undefined);
    setIsDialogOpen(true);
  }

  const openEditPostDialog = (post: BlogPost) => {
    setEditingPost(post);
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
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingPost(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewPostDialog}>Añadir Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingPost ? 'Editar Post' : 'Añadir Nuevo Post'}</DialogTitle>
            </DialogHeader>
            <BlogPostForm post={editingPost} onSave={handleSavePost} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditPostDialog(post)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el post del blog.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Continuar</AlertDialogAction>
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
