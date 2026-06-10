import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormData } from "@/lib/validations/service";
import { useCreateService, useUpdateService } from "@/hooks/useServices";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
  "transition-colors duration-150",
);

interface ServiceFormProps {
  formId: string;
  mode: "create" | "edit";
  serviceId?: string;
  defaultValues?: Partial<ServiceFormData> & { is_active?: boolean };
  onSuccess: () => void;
  onError: (message: string) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export function ServiceForm({
  formId,
  mode,
  serviceId,
  defaultValues,
  onSuccess,
  onError,
  onSubmittingChange,
}: ServiceFormProps) {
  const createService = useCreateService();
  const updateService = useUpdateService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? "",
      duration_minutes: defaultValues?.duration_minutes ?? 60,
    },
  });

  const [isActive, setIsActive] = useState(defaultValues?.is_active ?? true);

  const isPending = createService.isPending || updateService.isPending;

  useEffect(() => {
    onSubmittingChange(isPending);
  }, [isPending, onSubmittingChange]);

  async function onSubmit(data: ServiceFormData) {
    try {
      if (mode === "create") {
        await createService.mutateAsync({
          name: data.name,
          description: data.description ?? null,
          price: data.price,
          duration_minutes: data.duration_minutes,
        });
      } else {
        if (!serviceId) throw new Error("serviceId é obrigatório no modo edit");
        await updateService.mutateAsync({
          id: serviceId,
          body: {
            name: data.name,
            description: data.description ?? null,
            price: data.price,
            duration_minutes: data.duration_minutes,
          },
        });
      }
      onSuccess();
    } catch (err) {
      onError(getApiErrorMessage(err));
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Nome <span className="text-destructive">*</span>
        </label>
        <input
          {...register("name")}
          placeholder="Ex: Corte feminino"
          className={inputClass}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Descrição</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Descreva brevemente o serviço..."
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Preço (€) <span className="text-destructive">*</span>
          </label>
          <input
            {...register("price")}
            placeholder="0.00"
            className={inputClass}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Duração (min) <span className="text-destructive">*</span>
          </label>
          <input
            {...register("duration_minutes", { valueAsNumber: true })}
            type="number"
            min={15}
            step={5}
            placeholder="60"
            className={inputClass}
            aria-invalid={!!errors.duration_minutes}
          />
          {errors.duration_minutes && (
            <p className="mt-1 text-xs text-destructive">
              {errors.duration_minutes.message}
            </p>
          )}
        </div>
      </div>

      {mode === "edit" && serviceId && (
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">Serviço ativo</p>
            <p className="text-xs text-muted-foreground">Clientes podem agendar este serviço</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !isActive;
              setIsActive(next);
              updateService.mutate({ id: serviceId, body: { is_active: next } });
            }}
            className={cn(
              "relative inline-flex size-6 w-11 items-center rounded-full transition-colors focus:outline-none",
              isActive ? "bg-chart-3" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "inline-block size-4 rounded-full bg-white shadow transition-transform mx-1",
                isActive ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      )}
    </form>
  );
}
