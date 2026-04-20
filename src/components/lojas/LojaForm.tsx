import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lojaSchema, type LojaFormData } from "@/lib/validations/loja";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface LojaFormProps {
  defaultValues?: Partial<LojaFormData>;
  onSubmit: (data: LojaFormData) => void;
  isPending: boolean;
  apiError: Error | null;
  submitLabel: string;
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function LojaForm({
  defaultValues,
  onSubmit,
  isPending,
  apiError,
  submitLabel,
}: LojaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LojaFormData>({
    resolver: zodResolver(lojaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      telefone: "",
      email: "",
      endereco: "",
      logo_url: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field id="nome" label="Nome da loja" required error={errors.nome?.message}>
        <Input
          id="nome"
          {...register("nome")}
          placeholder="Ex: Studio Bella"
          aria-invalid={!!errors.nome}
          autoFocus
        />
      </Field>

      <Field id="descricao" label="Descrição" error={errors.descricao?.message}>
        <Textarea
          id="descricao"
          {...register("descricao")}
          placeholder="Conte um pouco sobre o seu salão..."
          className="min-h-22 resize-none"
          aria-invalid={!!errors.descricao}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="telefone" label="Telefone" error={errors.telefone?.message}>
          <Input
            id="telefone"
            {...register("telefone")}
            placeholder="(11) 99999-9999"
            aria-invalid={!!errors.telefone}
          />
        </Field>

        <Field id="email" label="Email de contato" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="contato@loja.com"
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>

      <Field id="endereco" label="Endereço" error={errors.endereco?.message}>
        <Input
          id="endereco"
          {...register("endereco")}
          placeholder="Rua, número, bairro, cidade"
          aria-invalid={!!errors.endereco}
        />
      </Field>

      <Field
        id="logo_url"
        label="Logo (URL)"
        error={errors.logo_url?.message}
        hint="Upload de imagem será disponível em breve"
      >
        <Input
          id="logo_url"
          {...register("logo_url")}
          placeholder="https://..."
          aria-invalid={!!errors.logo_url}
        />
      </Field>

      {apiError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Erro ao salvar. Tente novamente.
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="btn-salmon mt-2 h-11 w-full text-sm font-semibold text-white"
      >
        {isPending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
