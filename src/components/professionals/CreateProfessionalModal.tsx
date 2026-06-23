import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Store, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyStores } from "@/hooks/useStores";
import { createProfessional } from "@/lib/api/professionals";
import {
  professionalCreateSchema,
  type ProfessionalCreateFormData,
} from "@/lib/validations/professional";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { isAxiosError } from "axios";

interface CreateProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type ModalStep = "selecting" | "form";

const inputClass = cn(
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
  "transition-colors duration-150",
);

export function CreateProfessionalModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateProfessionalModalProps) {
  const [step, setStep] = useState<ModalStep>("selecting");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: stores } = useMyStores();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalCreateFormData>({
    resolver: zodResolver(professionalCreateSchema),
  });

  function handleSelectStore(storeId: string) {
    setSelectedStoreId(storeId);
    setStep("form");
  }

  function handleBack() {
    setStep("selecting");
    setSubmitError(null);
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      setStep("selecting");
      setSelectedStoreId(null);
      setSubmitError(null);
      reset();
    }
    onOpenChange(val);
  }

  async function onSubmit(data: ProfessionalCreateFormData) {
    if (!selectedStoreId) return;
    setSubmitError(null);

    try {
      await createProfessional(selectedStoreId, data);
      handleOpenChange(false);
      onSuccess();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("email", { message: "Este e-mail já está cadastrado" });
        return;
      }
      setSubmitError(getApiErrorMessage(err));
    }
  }

  const selectedStore = stores?.find((s) => s.id === selectedStoreId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold tracking-tight">
            Cadastrar profissional
          </DialogTitle>
          <DialogDescription>
            {step === "selecting"
              ? "Selecione a loja onde o profissional vai atuar."
              : `Preencha os dados do novo profissional para ${selectedStore?.name}.`}
          </DialogDescription>
        </DialogHeader>

        {step === "selecting" && (
          <div className="flex flex-col gap-2 mt-2">
            {stores?.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => handleSelectStore(store.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors",
                  "hover:border-salmon-200 hover:bg-muted",
                )}
              >
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Store className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{store.name}</p>
                  <p className="text-xs text-muted-foreground">Clique para selecionar</p>
                </div>
              </button>
            ))}
            {stores?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma loja encontrada. Crie uma loja primeiro.
              </p>
            )}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
            {submitError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <input
                {...register("name")}
                placeholder="Nome completo"
                className={cn(
                  inputClass,
                  errors.name && "border-destructive focus:ring-destructive/20",
                )}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <input
                {...register("email")}
                type="email"
                placeholder="email@exemplo.com"
                className={cn(
                  inputClass,
                  errors.email && "border-destructive focus:ring-destructive/20",
                )}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Senha temporária</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                className={cn(
                  inputClass,
                  errors.password && "border-destructive focus:ring-destructive/20",
                )}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Telefone <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="(11) 99999-9999"
                className={inputClass}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Voltar
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto gap-2 font-bold text-white btn-salmon"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Cadastrar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
