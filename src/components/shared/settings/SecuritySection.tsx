import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useChangePassword } from "@/hooks/useMe";
import { passwordSchema, type PasswordFormData } from "@/lib/validations/settings";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors duration-150 disabled:bg-background disabled:text-muted-foreground disabled:cursor-not-allowed";

export function SecuritySection() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  function onSubmit(data: PasswordFormData) {
    setError(null);
    setSuccess(false);
    changePassword(
      { current_password: data.current_password, new_password: data.new_password },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  }
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading font-extrabold tracking-tight text-slate-900 text-lg mb-0.5">
        Segurança
      </h2>
      <p className="text-xs text-muted-foreground mb-6">Proteja o acesso à sua conta</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm font-semibold text-slate-800">Alterar senha</p>
        <div>
          <Label className="text-xs font-semibold text-foreground mb-1.5 block">Senha atual</Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("current_password")}
            className={inputClass}
          />
          {errors.current_password && (
            <p className="text-xs text-destructive mt-1">{errors.current_password.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">Nova senha</Label>
            <Input
              type="password"
              placeholder="Mín. 8 caracteres"
              {...register("new_password")}
              className={inputClass}
            />
            {errors.new_password && (
              <p className="text-xs text-destructive mt-1">{errors.new_password.message}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold text-foreground mb-1.5 block">
              Confirmar nova senha
            </Label>
            <Input
              type="password"
              placeholder="Repita a nova senha"
              {...register("confirm_password")}
              className={inputClass}
            />
            {errors.confirm_password && (
              <p className="text-xs text-destructive mt-1">{errors.confirm_password.message}</p>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <Check className="size-3" /> Senha atualizada
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-linear-to-br from-chart-3 to-primary shadow-[0_3px_14px_rgba(224,80,64,0.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(224,80,64,0.38)] transition-all text-sm"
        >
          {isPending ? "Atualizando..." : "Atualizar senha"}
        </Button>
      </form>
    </section>
  );
}
