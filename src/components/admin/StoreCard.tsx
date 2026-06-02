import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Eye,
  CircleOff,
  CircleCheck,
  Trash2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StoreFormDialog } from "@/components/store/StoreFormDialog";
import { useUpdateStore, useDeleteStore } from "@/hooks/useStores";
import type { StoreDTO } from "@/types/api";

const BANNER_BG = [
  "bg-[linear-gradient(145deg,#FFE8E2,#FFAA97)]",
  "bg-[linear-gradient(145deg,#DBEAFE,#93C5FD)]",
  "bg-[linear-gradient(145deg,#D1FAE5,#6EE7B7)]",
] as const;

const ICON_COLORS = ["text-chart-3", "text-blue-700", "text-emerald-700"] as const;

interface StoreCardProps {
  store: StoreDTO;
  index: number;
  className?: string;
}

export function StoreCard({ store, index, className }: StoreCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: updateStore, isPending: isUpdating } = useUpdateStore();
  const { mutate: deleteStore, isPending: isDeleting } = useDeleteStore();

  const bannerBg = BANNER_BG[index % BANNER_BG.length];
  const iconColor = ICON_COLORS[index % ICON_COLORS.length];

  const defaultValues = {
    name: store.name,
    description: store.description ?? undefined,
    phone: store.phone ?? undefined,
    email: store.email ?? undefined,
    address: store.address ?? undefined,
    logo_url: store.logo_url ?? undefined,
    store_types: store.store_types,
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden transition-all",
        "hover:border-salmon-200 hover:shadow-[0_8px_28px_rgba(224,80,64,.1)]",
        "flex flex-col",
        !store.is_active && "opacity-75",
        className,
      )}
    >
      {/* Banner */}
      <div className={cn("h-36 flex items-end p-4 relative", bannerBg)}>
        <span
          className={cn(
            "absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white shadow-sm",
            store.is_active ? "text-emerald-700" : "text-slate-500",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              store.is_active ? "bg-emerald-500" : "bg-slate-400",
            )}
          />
          {store.is_active ? "Ativa" : "Inativa"}
        </span>
        <div className="size-12 rounded-2xl flex items-center justify-center bg-white/65 backdrop-blur-sm">
          <Building2 className={cn("size-6", iconColor)} />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground mb-1">{store.name}</h3>
        <div className="space-y-1 mb-3">
          {store.address && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {store.address}
            </p>
          )}
          {store.phone && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3 shrink-0" />
              {store.phone}
            </p>
          )}
          {store.email && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="size-3 shrink-0" />
              {store.email}
            </p>
          )}
        </div>
        {store.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {store.description}
          </p>
        )}
        {/* Chips + Actions pinned to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-chart-3">
              {store.professional_count} profissionais
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {store.service_count} serviços
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <Button
              size="sm"
              className="flex-1 bg-linear-to-br from-chart-3 to-primary text-white shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)]"
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
              Editar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/stores/$storeId" params={{ storeId: store.id }}>
                <Eye />
                Vitrine
              </Link>
            </Button>
            {store.is_active ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeactivateOpen(true)}
                disabled={isUpdating}
              >
                <CircleOff />
                Desativar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStore({ id: store.id, body: { is_active: true } })}
                disabled={isUpdating}
              >
                <CircleCheck />
                Ativar
              </Button>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteOpen(true)}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir definitivamente</TooltipContent>
            </Tooltip>
          </div>
        </div>{" "}
        {/* end mt-auto */}
      </div>

      {/* Edit dialog */}
      <StoreFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        storeId={store.id}
        defaultValues={defaultValues}
      />

      {/* Deactivate confirmation */}
      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar "{store.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta loja não ficará mais disponível para novos agendamentos. Os agendamentos já
              confirmados continuarão ativos e não serão cancelados. Você poderá reativar a loja a
              qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => updateStore({ id: store.id, body: { is_active: false } })}
            >
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir definitivamente "{store.name}"?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Esta ação é <strong className="text-foreground">permanente e irreversível</strong>
                  . Todos os dados associados a esta loja serão removidos e anonimizados:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Profissionais vinculados</li>
                  <li>Serviços e configurações de preço</li>
                  <li>Histórico de agendamentos</li>
                </ul>
                <p>Esses dados não poderão ser recuperados.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteStore(store.id)}
            >
              Sim, excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
