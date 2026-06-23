import { Shield, Info, AlertTriangle } from "lucide-react";
import { useAnonymizeMe } from "@/hooks/useMe";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { UserDTO } from "@/types/api";

interface PrivacySectionProps {
  user: UserDTO | null;
}

export function PrivacySection({ user }: PrivacySectionProps) {
  const { mutate: anonymize, isPending } = useAnonymizeMe();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading font-extrabold tracking-tight text-slate-900 text-lg mb-0.5">
        Privacidade &amp; LGPD
      </h2>
      <p className="text-xs text-muted-foreground mb-5">
        Seus direitos sobre os dados pessoais armazenados
      </p>

      <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-5 bg-blue-50 border border-blue-200">
        <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Seus dados são armazenados de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018). Você tem o direito de acessar, corrigir ou solicitar a anonimização dos seus
          dados a qualquer momento.
        </p>
      </div>

      {user?.accepted_terms_at && (
        <div className="pb-5 mb-5 border-b border-border">
          <p className="text-sm font-semibold text-slate-800 mb-3">Termos aceitos</p>
          <div className="flex items-start gap-3 rounded-xl px-4 py-3 bg-background border border-border">
            <Shield className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Termos de Uso {user.accepted_terms_version ?? ""}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aceito em{" "}
                {new Date(user.accepted_terms_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(user.accepted_terms_at).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                UTC
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-red-700 mb-3">Zona de perigo</p>
        <div className="rounded-xl px-4 py-4 bg-red-50 border border-red-200">
          <p className="text-sm font-semibold text-red-800 mb-1">Solicitar anonimização da conta</p>
          <p className="text-xs leading-relaxed text-red-900/70 mb-4">
            Ao anonimizar sua conta, todos os seus dados pessoais identificáveis serão removidos
            permanentemente (nome, email, telefone). Seus registros de agendamento serão mantidos
            para fins de histórico, mas desvinculados da sua identidade. Esta ação é{" "}
            <strong>irreversível</strong>.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm"
              >
                <AlertTriangle className="size-4" />
                Solicitar anonimização
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seus dados pessoais (nome, email, telefone) serão apagados permanentemente e você
                  será desconectado. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => anonymize()}
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPending ? "Anonimizando..." : "Confirmar anonimização"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
