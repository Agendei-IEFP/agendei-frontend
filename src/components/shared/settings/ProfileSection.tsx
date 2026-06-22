import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useUpdateMe } from "@/hooks/useMe";
import { profileSchema, type ProfileFormData } from "@/lib/validations/settings";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserDTO } from "@/types/api";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors duration-150 disabled:bg-background disabled:text-muted-foreground disabled:cursor-not-allowed";

interface ProfileSectionProps {
  user: UserDTO | null;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { mutate: updateMe, isPending } = useUpdateMe();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  function onSubmit(data: ProfileFormData) {
    setError(null);
    setSuccess(false);
    updateMe(
      { name: data.name, email: data.email, phone: data.phone || undefined },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading font-extrabold tracking-tight text-slate-900 text-lg mb-0.5">
        Perfil
      </h2>
      <p className="text-xs text-muted-foreground mb-6">Informações pessoais da sua conta</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">
              Nome completo
            </Label>
            <Input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Email</Label>
            <Input type="email" {...register("email")} className={inputClass} />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Telefone</Label>
            <Input type="tel" {...register("phone")} className={inputClass} />
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Role</Label>
            <Input value={user?.role ?? ""} disabled className={inputClass} />
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <Check className="size-3" /> Alterações salvas
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Conta criada em{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all text-sm"
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </section>
  );
}
