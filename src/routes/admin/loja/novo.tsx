import { createFileRoute, Link } from "@tanstack/react-router";
import { LojaForm } from "@/components/lojas/LojaForm";
import { useCreateLoja } from "@/hooks/useLojas";

export const Route = createFileRoute("/admin/loja/novo")({
  component: CriarLojaPage,
});

function CriarLojaPage() {
  const { mutate, isPending, error } = useCreateLoja();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle mesh background */}
      <div className="bg-mesh-top pointer-events-none absolute inset-0" />

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Brand */}
          <div className="mb-8 text-center">
            <span className="font-heading text-2xl font-black tracking-tight text-primary">
              Agendei
            </span>
            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Crie sua loja
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure o perfil público do seu estabelecimento.
              <br />
              Apenas o nome é obrigatório — você pode completar o resto depois.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <LojaForm
              onSubmit={(data) => mutate(data)}
              isPending={isPending}
              apiError={error}
              submitLabel="Criar loja"
            />
          </div>

          {/* Skip hint for future multi-store */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Já tem uma loja?{" "}
            <Link
              to="/admin/dashboard"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Ver minhas lojas
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
