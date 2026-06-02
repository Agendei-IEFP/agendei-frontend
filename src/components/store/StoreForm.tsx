import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Phone, Mail, MapPin, Image } from "lucide-react";
import { storeSchema, type StoreFormData } from "@/lib/validations/store";
import { useCreateStore, useUpdateStore } from "@/hooks/useStores";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { StoreType } from "@/types/api";

const STORE_TYPE_OPTIONS: { value: StoreType; label: string }[] = [
  { value: "hair_salon", label: "Cabelo" },
  { value: "barbershop", label: "Barbearia" },
  { value: "nails", label: "Unhas" },
  { value: "aesthetics", label: "Estética" },
  { value: "massage", label: "Massagem" },
  { value: "treatments", label: "Tratamentos" },
];

interface StoreFormProps {
  formId: string;
  mode: "create" | "edit";
  storeId?: string;
  defaultValues?: Partial<StoreFormData>;
  onSuccess: () => void;
  onError: (message: string) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export function StoreForm({
  formId,
  mode,
  storeId,
  defaultValues,
  onSuccess,
  onError,
  onSubmittingChange,
}: StoreFormProps) {
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      address: defaultValues?.address ?? "",
      logo_url: defaultValues?.logo_url ?? "",
      store_types: defaultValues?.store_types ?? [],
    },
  });

  const selectedTypes = watch("store_types");

  function toggleType(type: StoreType) {
    const current = selectedTypes ?? [];
    if (current.includes(type)) {
      setValue(
        "store_types",
        current.filter((t) => t !== type),
        { shouldValidate: true },
      );
    } else if (current.length < 3) {
      setValue("store_types", [...current, type], { shouldValidate: true });
    }
  }

  const isPending = createStore.isPending || updateStore.isPending;

  useEffect(() => {
    onSubmittingChange(isPending);
  }, [isPending, onSubmittingChange]);

  async function onSubmit(data: StoreFormData) {
    try {
      if (mode === "create") {
        await createStore.mutateAsync(data);
      } else {
        if (!storeId) throw new Error("storeId é obrigatório no modo edit");
        await updateStore.mutateAsync({ id: storeId, body: data });
      }
      onSuccess();
    } catch (err) {
      onError(getApiErrorMessage(err));
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-slate-700" htmlFor="name">
          Nome da loja <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Store className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            id="name"
            className="pl-10"
            placeholder="Ex: Salão da Ana"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </div>
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-slate-700" htmlFor="description">
          Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Apresente seu espaço, especialidades, diferenciais..."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-slate-700" htmlFor="phone">
            Telefone <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="phone"
              className="pl-10"
              placeholder="(+351) 999 999 999"
              {...register("phone")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-slate-700" htmlFor="email">
            Email <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              className="pl-10"
              placeholder="contato@minhaloja.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-slate-700" htmlFor="address">
          Endereço <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            id="address"
            className="pl-10"
            placeholder="Rua das Flores, 123 — Porto"
            {...register("address")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-slate-700" htmlFor="logo_url">
          Logo <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <div className="relative">
          <Image className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            id="logo_url"
            className="pl-10"
            placeholder="https://exemplo.com/logo.png"
            aria-invalid={!!errors.logo_url}
            {...register("logo_url")}
          />
        </div>
        {errors.logo_url ? (
          <p className="text-destructive text-xs">{errors.logo_url.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Apenas URL por agora. Upload de arquivo em breve.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-semibold text-slate-700">
          Tipos de serviço <span className="text-muted-foreground font-normal">(máx. 3)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {STORE_TYPE_OPTIONS.map(({ value, label }) => {
            const isSelected = selectedTypes?.includes(value);
            const isDisabled = !isSelected && (selectedTypes?.length ?? 0) >= 3;
            return (
              <button
                key={value}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleType(value)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  isSelected
                    ? "border-chart-3 bg-chart-3 text-white"
                    : "border-input bg-white text-foreground hover:border-salmon-200 hover:bg-muted",
                  isDisabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.store_types && (
          <p className="text-destructive text-xs">{errors.store_types.message}</p>
        )}
      </div>
    </form>
  );
}
