import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Mail, MapPin, Image } from "lucide-react";
import { storeSchema, type StoreFormData } from "@/lib/validations/store";
import { useCreateStore, useUpdateStore } from "@/hooks/useStores";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      phone: defaultValues?.phone?.replace(/^\+351\s?/, "") ?? "",
      email: defaultValues?.email ?? "",
      address: defaultValues?.address ?? "",
      logo_url: defaultValues?.logo_url ?? "",
      banner_url: defaultValues?.banner_url ?? "",
      store_types: defaultValues?.store_types ?? [],
    },
  });

  const isPending = createStore.isPending || updateStore.isPending;

  useEffect(() => {
    onSubmittingChange(isPending);
  }, [isPending, onSubmittingChange]);

  async function onSubmit(data: StoreFormData) {
    const payload = {
      ...data,
      phone: data.phone ? `+351 ${data.phone}` : undefined,
    };
    try {
      if (mode === "create") {
        await createStore.mutateAsync(payload);
      } else {
        if (!storeId) throw new Error("storeId é obrigatório no modo edit");
        await updateStore.mutateAsync({ id: storeId, body: payload });
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
              +351
            </span>
            <Input
              id="phone"
              className="pl-14"
              placeholder="912 345 678"
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

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-slate-700" htmlFor="banner_url">
          Banner <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <div className="relative">
          <Image className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            id="banner_url"
            className="pl-10"
            placeholder="https://exemplo.com/banner.jpg"
            aria-invalid={!!errors.banner_url}
            {...register("banner_url")}
          />
        </div>
        {errors.banner_url ? (
          <p className="text-destructive text-xs">{errors.banner_url.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Imagem de fundo do cabeçalho da página da loja.
          </p>
        )}
      </div>
    </form>
  );
}
