
"use client";

import { useEffect, useState, useRef } from "react";
import type { TeamMember } from "@/lib/types";
import { getTeamMembers } from "@/lib/team";
import { saveTeamMember, deleteTeamMember } from "@/app/actions";
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
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function TeamMemberForm({
  member,
  onSave,
  onOpenChange,
}: {
  member?: TeamMember;
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
        {member?.id && <input type="hidden" name="id" value={member.id} />}
        {member?.avatar && <input type="hidden" name="existingAvatar" value={member.avatar} />}
      
        <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={member?.name ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Input id="role" name="role" defaultValue={member?.role ?? ''} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="fallback">Iniciales (Fallback)</Label>
            <Input id="fallback" name="fallback" defaultValue={member?.fallback ?? ''} required maxLength={2} placeholder="EJ: JD"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            {member?.avatar && (
                <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Avatar actual:</p>
                    <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                </div>
            )}
            <Input id="avatar" name="avatar" type="file" accept="image/*" />
             <p className="text-xs text-muted-foreground">
                {member?.avatar ? 'Sube un nuevo archivo para reemplazar el avatar actual.' : 'Sube un archivo de imagen.'}
            </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Miembro"}</Button>
    </form>
  );
}


export function TeamMemberList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
        const membersData = await getTeamMembers();
        setMembers(membersData);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los miembros del equipo." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSaveMember = async (formData: FormData) => {
    const result = await saveTeamMember(formData);
    if (result.success) {
      toast({ title: "¡Éxito!", description: "Miembro del equipo guardado correctamente." });
      fetchMembers();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };
  
  const handleDeleteMember = async (id: string) => {
    const result = await deleteTeamMember(id);
    if (result.success) {
        toast({ title: "¡Éxito!", description: "Miembro del equipo eliminado correctamente." });
        fetchMembers();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const openNewMemberDialog = () => {
    setEditingMember(undefined);
    setIsDialogOpen(true);
  }

  const openEditMemberDialog = (member: TeamMember) => {
    setEditingMember(member);
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
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) setEditingMember(undefined)}}>
          <DialogTrigger asChild>
            <Button onClick={openNewMemberDialog}>Añadir Miembro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingMember ? 'Editar Miembro' : 'Añadir Nuevo Miembro'}</DialogTitle>
            </DialogHeader>
            <TeamMemberForm member={editingMember} onSave={handleSaveMember} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                 <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditMemberDialog(member)}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al miembro del equipo.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>Continuar</AlertDialogAction>
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
