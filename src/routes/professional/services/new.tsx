import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { serviceSchema, type ServiceFormData } from "@/lib/validations/service";
import { useCreateService } from "@/hooks/useServices";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professional/services/new")({
  component: NewService,
});

const inputClass = cn(
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20",
  "transition-colors duration-150",
);

function NewService() {
  const navigate = useNavigate();
  const createService = useCreateService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      default_duration_minutes: 60,
    },
  });

  async function onSubmit(data: ServiceFormData) {
    await createService.mutateAsync({
      name: data.name,
      description: data.description ?? null,
      default_price: data.default_price,
      default_duration_minutes: data.default_duration_minutes,
    });
    navigate({ to: "/professional/services" });
  }

  return (
    <main className="flex-1 p-4 md:p-8 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/professional/services"
          className="size-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h2 className="font-heading font-bold text-foreground text-xl tracking-tight">
            Novo serviço
          </h2>
          <p className="text-xs text-muted-foreground">
            Crie um serviço canónico para o seu perfil
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Nome <span className="text-destructive">*</span>
            </label>
            <input {...register("name")} placeholder="Ex: Corte feminino" className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Descrição</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Descreva brevemente o serviço..."
              className={cn(inputClass, "resize-none")}
            />
          </div>

          {/* Preço e duração lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Preço padrão (€) <span className="text-destructive">*</span>
              </label>
              <input {...register("default_price")} placeholder="0.00" className={inputClass} />
              {errors.default_price && (
                <p className="mt-1 text-xs text-destructive">{errors.default_price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Duração (min) <span className="text-destructive">*</span>
              </label>
              <input
                {...register("default_duration_minutes", { valueAsNumber: true })}
                type="number"
                min={15}
                step={5}
                placeholder="60"
                className={inputClass}
              />
              {errors.default_duration_minutes && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.default_duration_minutes.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/professional/services"
            className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || createService.isPending}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all disabled:opacity-60 disabled:transform-none"
          >
            {isSubmitting || createService.isPending ? "Criando..." : "Criar serviço"}
          </button>
        </div>
      </form>
    </main>
  );
}
