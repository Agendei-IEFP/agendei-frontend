import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Calendar, Mail, Lock, User, Star, Loader2 } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/errorUtils";

export function RegisterForm() {
  const {
    register: registerField,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "cliente" },
  });
  const { mutate: registerUser, isPending, error } = useRegister();

  // useWatch subscribes only to the "role" field — avoids re-rendering the whole form on every keystroke
  const selectedRole = useWatch({ control, name: "role" });

  return (
    // Page wrapper — salmon background visible on sm+, full screen on mobile
    <div className="min-h-screen bg-brand-panel flex flex-col sm:items-center sm:justify-center sm:p-6">
      {/* Card — no border/shadow on mobile, rounded with shadow on sm+ */}
      <div className="flex-1 sm:flex-none w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden sm:shadow-xl sm:border sm:border-primary flex flex-col md:flex-row">
        {/* Left panel — brand/marketing (visible only on md+) */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 relative overflow-hidden bg-brand-panel">
          {/* Decorative background circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/7" />
          <div className="absolute bottom-10 -left-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -translate-y-1/2 right-8 w-20 h-20 rounded-full bg-white/6" />

          {/* Top block — logo, headline, tagline */}
          <div className="relative">
            {/* Logo + brand name */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-black text-white text-xl tracking-[-0.02em]">
                Agendei
              </span>
            </div>

            {/* Headline and tagline */}
            <h2 className="font-heading font-black text-white text-[1.7rem] tracking-[-0.03em] leading-[1.2] mb-3">
              Comece grátis
              <br />
              em 2 minutos.
            </h2>
            <p className="text-sm text-white/75 leading-[1.6] mb-30">
              Crie a sua conta e comece a receber agendamentos online ainda
              hoje.
            </p>
          </div>

          {/* Testimonial card — swaps content based on selected role */}
          <div className="relative rounded-2xl p-5 bg-white/14">
            {/* key={selectedRole} remounts this block on role change, triggering the fade-in animation */}
            <div key={selectedRole} className="animate-in fade-in duration-300">
              {/* Star rating */}
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-amber-300 fill-current"
                  />
                ))}
              </div>
              {selectedRole === "admin_loja" ? (
                <>
                  <p className="text-xs text-white mb-3 leading-relaxed">
                    "Antes ficava o dia todo no WhatsApp. Agora os clientes
                    agendam sozinhos."
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Author avatar — initials */}
                    <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold text-white">
                      JS
                    </div>
                    <span className="text-xs text-white font-medium">
                      João Silva — Cabeleireiro
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-white mb-3 leading-relaxed">
                    "Marquei minha manicure em 2 minutos, direto do celular. Nem
                    precisei ligar."
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Author avatar — initials */}
                    <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold text-white">
                      AL
                    </div>
                    <span className="text-xs text-white font-medium">
                      Ana Lima — Cliente
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right panel — registration form */}
        <div className="flex-1 md:flex-none md:w-96 flex flex-col justify-center p-5 sm:p-8 md:p-10 bg-white">
          {/* Compact logo — shown on mobile/sm where the left panel is hidden */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-black text-slate-900 text-xl tracking-[-0.02em]">
              Agendei
            </span>
          </div>

          {/* Form header — title and login link */}
          <div className="mb-8">
            <h3 className="font-heading font-black text-slate-900 text-2xl tracking-[-0.025em] mb-1.5">
              Criar conta
            </h3>
            <p className="text-sm text-slate-500">
              Já tem conta?{" "}
              <Link to="/login" className="font-semibold text-chart-3">
                Entrar
              </Link>
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => registerUser(data))}
          >
            {/* Role selector — sets hidden "role" field value */}
            <input type="hidden" {...registerField("role")} />
            <div className="flex rounded-lg border border-input p-1 gap-1">
              <button
                type="button"
                onClick={() => setValue("role", "cliente")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedRole === "cliente"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-muted"
                }`}
              >
                Quero agendar
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "admin_loja")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedRole === "admin_loja"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-muted"
                }`}
              >
                Tenho um negócio
              </button>
            </div>

            {/* Full name field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none pl-10"
                  {...registerField("nome")}
                  type="text"
                  placeholder="Flávia Pereira de Melo"
                />
              </div>
              {errors.nome && (
                <p className="text-destructive text-xs mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none pl-10"
                  {...registerField("email")}
                  type="email"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none pl-10"
                  {...registerField("password")}
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms and conditions checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="accepted_terms"
                className="mt-0.5 w-4 h-4 rounded shrink-0"
                {...registerField("accepted_terms")}
              />
              <label
                htmlFor="accepted_terms"
                className="text-xs text-slate-600 leading-relaxed"
              >
                Li e aceito os{" "}
                <a href="#" className="font-semibold text-chart-3">
                  Termos e Condições
                </a>{" "}
                e a{" "}
                <a href="#" className="font-semibold text-chart-3">
                  Política de Privacidade
                </a>
              </label>
            </div>
            {errors.accepted_terms && (
              <p className="text-destructive text-xs -mt-2">
                {errors.accepted_terms.message}
              </p>
            )}

            {/* Submit button */}
            <button
              className="w-full py-2.5 text-sm font-bold text-white rounded-lg mt-2 btn-salmon flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Criando conta..." : "Criar conta grátis →"}
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
