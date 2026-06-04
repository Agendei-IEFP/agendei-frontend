import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUpdateProfessional } from "@/hooks/useProfessionals";
import { professionalEditSchema, type ProfessionalEditFormData } from "@/lib/validations/professional";
import type { ProfessionalWithStoreDTO } from "@/types/api";

interface ProfessionalEditDialogProps {
  professional: ProfessionalWithStoreDTO;
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors duration-150";

export function ProfessionalEditDialog({ professional, open, onClose }: ProfessionalEditDialogProps) {
  const updateMutation = useUpdateProfessional();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalEditFormData>({
    resolver: zodResolver(professionalEditSchema),
    defaultValues: {
      bio: professional.bio ?? "",
      photo_url: professional.photo_url ?? "",
      is_active: professional.is_active,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        bio: professional.bio ?? "",
        photo_url: professional.photo_url ?? "",
        is_active: professional.is_active,
      });
    }
  }, [open, professional, reset]);

  const isActive = watch("is_active");

  async function onSubmit(values: ProfessionalEditFormData) {
    await updateMutation.mutateAsync({
      storeId: professional.store_id,
      professionalId: professional.id,
      updates: {
        bio: values.bio || null,
        photo_url: values.photo_url || null,
        is_active: values.is_active,
      },
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar profissional</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Descreva o profissional..."
              className={inputClass}
              rows={3}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo_url">URL da foto</Label>
            <Input
              id="photo_url"
              placeholder="https://..."
              className={inputClass}
              {...register("photo_url")}
            />
            {errors.photo_url && (
              <p className="text-xs text-destructive">{errors.photo_url.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Profissional ativo" : "Profissional inativo"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("is_active", !isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
