import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvitePublic, useAcceptInvite } from "@/hooks/useInvites";
import { getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { inviteRegisterSchema, type InviteRegisterFormData } from "@/lib/validations/invite";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/invite/$token")({
  component: InvitePage,
});

type PageState = "loading" | "confirm" | "register" | "success";

function InvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const { data: invite, isLoading, error: loadError } = useInvitePublic(token);
  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite(token);

  const [pageState, setPageState] = useState<PageState>("loading");
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Determinar estado inicial assim que o convite carrega
  if (!isLoading && invite && pageState === "loading") {
    if (user) {
      setShowConfirmDialog(true);
      setPageState("confirm");
    } else {
      setPageState("register");
    }
  }

  function redirectAfterAccept() {
    const role = user?.role ?? "professional";
    if (role === "store_admin") {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/professional/dashboard" });
    }
  }

  function handleConfirmAccept() {
    setAcceptError(null);
    acceptInvite(undefined, {
      onSuccess: () => {
        setShowConfirmDialog(false);
        setPageState("success");
        setTimeout(redirectAfterAccept, 1500);
      },
      onError: (err) => {
        setAcceptError(getApiErrorMessage(err));
      },
    });
  }

  function handleAnonymousAccept(body: {
    name: string;
    email: string;
    password: string;
    accepted_terms: true;
  }) {
    setAcceptError(null);
    acceptInvite(body, {
      onSuccess: async (data) => {
        if (data.access_token) {
          setAccessToken(data.access_token);
          // Buscar o UserDTO completo agora que temos o token no authStore
          try {
            const me = await getMe();
            useAuthStore.getState().login(data.access_token, me);
          } catch {
            // Se falhar, o token já está salvo — o dashboard vai redirecionar
          }
        }
        setPageState("success");
        setTimeout(() => navigate({ to: "/professional/dashboard" }), 1500);
      },
      onError: (err) => setAcceptError(getApiErrorMessage(err)),
    });
  }

  // Loading
  if (isLoading || pageState === "loading") {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  // Convite inválido / expirado / já usado
  if (loadError || !invite) {
    return (
      <PageShell>
        <div className="flex flex-col items-center text-center py-12 gap-4">
          <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              Convite inválido
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Este link pode ter expirado, já ter sido utilizado, ou ser inválido.
            </p>
          </div>
          <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
            Ir para o login
          </Link>
        </div>
      </PageShell>
    );
  }

  // Sucesso
  if (pageState === "success") {
    return (
      <PageShell>
        <div className="flex flex-col items-center text-center py-12 gap-4">
          <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="size-7 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              Bem-vindo à {invite.store_name}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Redirecionando para o seu painel...
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  // Usuário logado — modal de confirmação
  if (pageState === "confirm" && user) {
    return (
      <PageShell>
        <div className="flex flex-col items-center text-center py-12 gap-2">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Verificando convite...</p>
        </div>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading font-bold tracking-tight">
                Aceitar convite?
              </DialogTitle>
              <DialogDescription>
                Deseja ser profissional em{" "}
                <strong className="text-foreground">{invite.store_name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: "/" })}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 font-bold text-white btn-salmon"
                disabled={isAccepting}
                onClick={handleConfirmAccept}
              >
                {isAccepting && <Loader2 className="size-4 animate-spin mr-2" />}
                Confirmar
              </Button>
            </div>
            {acceptError && (
              <p className="text-xs text-destructive mt-2">{acceptError}</p>
            )}
          </DialogContent>
        </Dialog>
      </PageShell>
    );
  }

  // Usuário anônimo
  return (
    <AnonymousInvitePage
      token={token}
      storeName={invite.store_name}
      isAccepting={isAccepting}
      acceptError={acceptError}
      onAccept={handleAnonymousAccept}
    />
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: fluxo anônimo
// ---------------------------------------------------------------------------

interface AnonymousInvitePageProps {
  token: string;
  storeName: string;
  isAccepting: boolean;
  acceptError: string | null;
  onAccept: (body: {
    name: string;
    email: string;
    password: string;
    accepted_terms: true;
  }) => void;
}

type AnonState = "choice" | "register";

function AnonymousInvitePage({
  token,
  storeName,
  isAccepting,
  acceptError,
  onAccept,
}: AnonymousInvitePageProps) {
  const [anonState, setAnonState] = useState<AnonState>("choice");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteRegisterFormData>({
    resolver: zodResolver(inviteRegisterSchema),
  });

  if (anonState === "choice") {
    return (
      <PageShell>
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl text-foreground tracking-tight mb-2">
            Você foi convidado!
          </h2>
          <p className="text-sm text-muted-foreground">
            Para aceitar o convite e ser profissional em{" "}
            <strong className="text-foreground">{storeName}</strong>, entre ou crie uma conta.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            className="w-full font-bold text-white btn-salmon h-auto py-3"
            onClick={() => setAnonState("register")}
          >
            Criar conta e aceitar convite
          </Button>
          <Link
            to="/login"
            search={{ redirect: `/invite/${token}` }}
            className={cn(
              "w-full flex items-center justify-center py-3 rounded-lg border border-input",
              "text-sm font-semibold text-secondary-foreground bg-secondary",
              "hover:bg-muted transition-colors",
            )}
          >
            Já tenho conta — entrar
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setAnonState("choice")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          ← Voltar
        </button>
        <h2 className="font-heading font-bold text-2xl text-foreground tracking-tight mb-1">
          Criar conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Após o cadastro você será vinculado como profissional em{" "}
          <strong className="text-foreground">{storeName}</strong>.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => onAccept({ ...data, accepted_terms: true }))}
      >
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-slate-700" htmlFor="name">
            Nome completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="name"
              className="pl-10"
              placeholder="Seu nome"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-slate-700" htmlFor="email">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              className="pl-10"
              placeholder="seu@email.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-slate-700" htmlFor="password">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              className="pl-10"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Termos */}
        <div className="flex items-start gap-2.5">
          <input
            id="accepted_terms"
            type="checkbox"
            className="mt-0.5 accent-primary"
            {...register("accepted_terms")}
          />
          <Label
            htmlFor="accepted_terms"
            className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
          >
            Aceito os{" "}
            <span className="font-semibold text-primary">Termos e Condições</span>{" "}
            da plataforma Agendei
          </Label>
        </div>
        {errors.accepted_terms && (
          <p className="text-destructive text-xs">{errors.accepted_terms.message}</p>
        )}

        {acceptError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {acceptError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isAccepting}
          className="w-full h-auto py-2.5 font-bold text-white btn-salmon gap-2"
        >
          {isAccepting && <Loader2 className="size-4 animate-spin" />}
          {isAccepting ? "Criando conta..." : "Criar conta e aceitar convite"}
        </Button>
      </form>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Layout shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
            <Calendar className="size-4 text-white" />
          </div>
          <span className="font-heading font-black text-foreground text-xl tracking-[-0.02em]">
            Agendei
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
