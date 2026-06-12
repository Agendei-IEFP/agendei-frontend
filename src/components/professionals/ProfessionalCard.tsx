import { useState } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";
import type { ProfessionalWithStoreDTO } from "@/types/api";
import { useUnlinkProfessional } from "@/hooks/useProfessionals";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProfessionalEditDialog } from "./ProfessionalEditDialog";

interface ProfessionalCardProps {
  professional: ProfessionalWithStoreDTO;
  className?: string;
}

export function ProfessionalCard({ professional, className }: ProfessionalCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const unlinkMutation = useUnlinkProfessional();

  const initials = getInitials(professional.name);

  function handleConfirmRemove() {
    unlinkMutation.mutate({
      storeId: professional.store_id,
      professionalId: professional.id,
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-salmon-200",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={
            "size-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-salmon-100 text-chart-4"
          }
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground text-sm">{professional.name}</p>
            <span
              className={cn(
                "chip",
                professional.is_active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {professional.is_active ? "Ativo" : "Inativo"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{professional.store_name}</p>
        </div>
      </div>

      {/* Bio */}
      {professional.bio ? (
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {professional.bio}
        </p>
      ) : (
        <p className="text-xs text-muted-warm italic mb-4">Sem bio cadastrada</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-input text-secondary-foreground bg-secondary hover:bg-muted transition-colors"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={unlinkMutation.isPending}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-destructive bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Remover
        </button>
      </div>

      <ProfessionalEditDialog
        professional={professional}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              {professional.name} será removido da loja. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
