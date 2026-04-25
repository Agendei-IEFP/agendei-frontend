import { useForm } from "react-hook-form";
import { Calendar, Mail, Lock, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errorUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const { mutate: loginMutate, isPending, error } = useLogin();

  return (
    // Página — fundo vermelho visível em sm+, tela cheia em mobile
    <div className="min-h-screen bg-brand-panel flex flex-col sm:items-center sm:justify-center sm:p-6">
      {/* Card — sem chrome em mobile, bordas arredondadas e sombra em sm+ */}
      <div className="flex-1 sm:flex-none w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden sm:shadow-xl sm:border sm:border-primary flex flex-col md:flex-row">
        {/* Painel esquerdo — marca (visível apenas em md+) */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 relative overflow-hidden bg-brand-panel">
          {/* Círculos decorativos de fundo */}
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-white/7" />
          <div className="absolute bottom-10 -left-12 size-40 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -translate-y-1/2 right-8 size-20 rounded-full bg-white/6" />

          {/* Bloco superior — logo, título e descrição */}
          <div className="relative">
            {/* Logo + nome da marca */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="size-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="size-4 text-white" />
              </div>
              <span className="font-heading font-black text-white text-xl tracking-[-0.02em]">
                Agendei
              </span>
            </div>

            {/* Headline e tagline */}
            <h2 className="font-heading font-black text-white text-[1.7rem] tracking-[-0.03em] leading-[1.2] mb-3">
              Sua agenda,
              <br />
              do seu jeito.
            </h2>
            <p className="text-sm text-white/75 leading-[1.6] mb-30">
              Clientes agendam online. Você só aparece para trabalhar.
            </p>
          </div>

          {/* Bullets de benefícios */}
          <div className="relative space-y-3">
            {[
              "Sem ligações para confirmar horários",
              "Lembretes automáticos por email",
              "Painel completo para gestão de equipa",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/15 backdrop-blur"
              >
                <Check className="size-4 text-white shrink-0" />
                <span className="text-white text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel direito — formulário */}
        <div className="flex-1 md:flex-none md:w-96 flex flex-col justify-center p-5 sm:p-8 md:p-10 bg-white">
          {/* Logo compacto — substitui o painel de marca em mobile e sm */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
              <Calendar className="size-4 text-white" />
            </div>
            <span className="font-heading font-black text-slate-900 text-xl tracking-[-0.02em]">
              Agendei
            </span>
          </div>

          {/* Cabeçalho do formulário — título e link de cadastro */}
          <div className="mb-8">
            <h3 className="font-heading font-black text-slate-900 text-2xl tracking-[-0.025em] mb-1.5">
              Entrar na conta
            </h3>
            <p className="text-sm text-slate-500">
              Não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold text-chart-3">
                Cadastrar-se
              </Link>
            </p>
          </div>

          {/* Formulário de login */}
          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => loginMutate(data))}
          >
            {/* Campo de email */}
            <div className="flex flex-col gap-1">
              <Label className="font-semibold text-slate-700" htmlFor="email">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="email"
                  className="pl-10"
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo de senha */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Label
                  className="font-semibold text-slate-700"
                  htmlFor="password"
                >
                  Senha
                </Label>
                <Link to="/login" className="text-xs font-medium text-chart-3">
                  Esqueceu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="password"
                  className="pl-10"
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isPending}
              type="submit"
              className="w-full py-2.5 text-sm font-bold text-white rounded-lg cursor-pointer mt-2 btn-salmon"
            >
              {isPending ? "Entrando..." : "Entrar na conta"}
            </button>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {getApiErrorMessage(error)}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
